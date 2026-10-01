'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';

export const getAllNotes = async (query = {}) => {
  const search = query?.search || null;
  const tag = query?.tag || null;

  try {
    const filter = {};

    if (query.search) {
      filter.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (query.tag) {
      filter.tags = { some: { name: tag } };
    }

    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: 'You must be logged in.',
      };
    }

    filter.userId = user.id;

    const notes = await prisma.note.findMany({
      where: filter,
      include: { tags: true },
      orderBy: { createdAt: 'desc' },
    });
    if (!notes) {
      throw new Error('Notes not found!');
    }

    return notes;
  } catch (err) {
    return null;
  }
};

export const getNoteById = async id => {
  try {
    const note = await prisma.note.findUnique({
      where: {
        id: id,
      },
      include: { tags: true },
    });
    if (!note) {
      throw new Error('Note not found!');
    }

    return note;
  } catch (err) {
    return null;
  }
};

export const getTags = async () => {
  try {
    const tags = await prisma.tag.findMany();
    if (!tags) {
      throw new Error('Tags not found!');
    }

    return tags;
  } catch (err) {
    return null;
  }
};

export const createNote = async (prevData, formData) => {
  const title = formData.get('title');
  const content = formData.get('content');
  const tagIds = formData.getAll('tag');

  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: 'You must be logged in.',
      };
    }

    await prisma.note.create({
      data: {
        title,
        content,
        userId: user.id,
        tags: {
          connect: tagIds.map(id => ({ id })),
        },
      },
    });
    revalidatePath('/dashboard');
    return {
      success: true,
      message: 'Note successfully created',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Failed to create note ',
    };
  }
};

export const updateNote = async (id, prevData, formData) => {
  const noteId = id;
  const title = formData.get('title');
  const content = formData.get('content');
  const tagIds = formData.getAll('tag');

  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: 'You must be logged in.',
      };
    }

    await prisma.note.update({
      where: { id: noteId },
      data: {
        title,
        content,
        userId: user.id,
        tags: {
          set: tagIds.map(id => ({ id })),
        },
      },
    });
    revalidatePath('/dashboard');
    return {
      success: true,
      message: 'Note successfully updated',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Failed to update note ',
    };
  }
};

export const deleteNote = async id => {
  try {
    await prisma.note.delete({
      where: {
        id: id,
      },
    });
    revalidatePath('/dashboard');
    return {
      success: true,
      message: 'Note successfully  deleted.',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Failed to delete note.',
    };
  }
};

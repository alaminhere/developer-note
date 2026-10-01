'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const registerUser = async (prevData, formData) => {
  const cookieStore = await cookies();

  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  try {
    if (!name || !email || !password || !confirmPassword) {
      return {
        success: false,
        message: 'All fields are  required!',
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match!',
      };
    }

    const existsUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existsUser) {
      return {
        success: false,
        message: 'User Already exists!',
      };
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'Something went wrong! Please try again',
      };
    }

    cookieStore.set({
      name: 'USER_TOKEN',
      value: user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week valid
    });

    return {
      success: true,
      message: 'Successfully Register',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Something went wrong! Please try again',
    };
  }
};

export const loginUser = async (prevData, formData) => {
  const cookieStore = await cookies();

  const email = formData.get('email');
  const password = formData.get('password');

  try {
    if (!email || !password) {
      return {
        success: false,
        message: 'All fields are  required!',
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found! Please try again',
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        message: 'Passwords do not match!',
      };
    }

    cookieStore.set({
      name: 'USER_TOKEN',
      value: user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week valid
    });

    return {
      success: true,
      message: 'Successfully Login',
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || 'Something went wrong! Please try again',
    };
  }
};

export const logOutUser = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('USER_TOKEN');
};

export const getCurrentUser = async () => {
  const cookieStore = await cookies();

  const token = cookieStore.get('USER_TOKEN');

  try {
    if (!token) {
      throw new Error('Token not found');
    }
    const user = await prisma.user.findFirst({
      where: {
        id: token.value,
      },
    });

    return user;
  } catch (err) {
    return null;
  }
};

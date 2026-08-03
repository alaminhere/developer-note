'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { redirect, useSearchParams } from 'next/navigation';
import { Book, LogOut, MenuIcon, Plus, Undo2, User, X } from 'lucide-react';
import { getAllNotes } from '@/actions/noteAction';

import NoteCard from './noteCard';
import Button from '@/components/ui/button';
import TagCard from './tagCard';
import Search from '@/components/ui/search';
import clsx from 'clsx';
import { logOutUser } from '@/actions/auth';

const DashboardLayout = ({ tags, currentUser }) => {
  const [notes, setNotes] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const params = useSearchParams();
  const search = params.search;

  if (!currentUser) {
    redirect('/login');
  }

  useEffect(() => {
    const n = async () => {
      const rowparams = Object.fromEntries(params);
      const filtredParams = Object.fromEntries(
        Object.entries(rowparams).filter(
          ([_, value]) =>
            value !== undefined &&
            value !== '' &&
            value !== ' ' &&
            value !== "''",
        ),
      );

      const notes = await getAllNotes(filtredParams);
      setNotes(notes);
    };
    n();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString()]);

  return (
    <>
      <aside
        className={clsx(
          ' fixed lg:static lg:w-1/5 w-full min-h-screen flex flex-col justify-between border-r p-4 border-neo-coudy/50  bg-neo-dark z-50 ',
          isMenuOpen
            ? 'transform translate-y-0 '
            : 'transform -translate-y-full lg:translate-y-0',
        )}
      >
        <div className="space-y-8 ">
          <div>
            <div className="flex flex-col">
              <div className="flex gap-3 mt-5">
                <div className="w-12 h-12 rounded-full bg-neo-border flex items-center justify-center">
                  <User size={24} className="text-neo-grey" />
                </div>
                <div>
                  <p className="text-neo-grey font-semibold">
                    {currentUser.name}
                  </p>
                  <p className="text-neo-coudy ">{currentUser.email}</p>
                </div>
                <button
                  onClick={() => setIsMenuOpen(prev => !prev)}
                  className="lg:hidden  absolute right-5 top-5 "
                >
                  <X />
                </button>
              </div>
            </div>
          </div>

          <div>
            <Link href={'/dashboard/notes/add'}>
              <Button variant={'pink'} className={'w-full'}>
                <Plus /> Add new note
              </Button>
            </Link>
          </div>

          <div>
            <p className="text-xl">#FILTER BY TAG</p>
            <div className="flex gap-2 justify-between items-center px-4 py-2 mt-2 rounded-md bg-neo-border">
              <Book size={20} className="text-neo-white" />
              <p className="text-base">All Note</p>
              <span className="w-5 h-5 bg-neo-coudy/10 flex items-center justify-center text-neo-grey p-1">
                10
              </span>
            </div>
          </div>

          <div className="">
            <TagCard tags={tags} />
          </div>
          <Link href={'/'}>
            <Button size="lg" variant="green" className={'w-full'}>
              <Undo2 size={16} />
              Back to home
            </Button>
          </Link>
        </div>

        <Button onClick={async () => await logOutUser()} className={'mb-2'}>
          <LogOut size={16} />
          Logout
        </Button>
      </aside>
      <main className="w-full min-h-screen p-4 ">
        <div className="flex items-center gap-4">
          <Search className={'flex-1'} search={search} />
          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            className=" lg:hidden p-1.5 bg-neo-border rounded-md"
          >
            <MenuIcon />
          </button>
        </div>
        <div className="overflow-y-scroll scrollbar-none h-[93vh]  ">
          {notes?.length === 0 ? (
            <div className="w-full h-[90vh] flex justify-center items-center p-5">
              <div className="w-full h-full flex flex-col justify-center items-center border-3 border-dashed  border-neo-border rounded-md">
                {' '}
                <h4 className="mb-5  text-center">No Note Found</h4>
                <Link href={'/dashboard/notes/add'}>
                  <Button variant={'pink'}>
                    <Plus /> Add new note
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 ">
              {notes?.map((item, index) => (
                <NoteCard key={index} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default DashboardLayout;

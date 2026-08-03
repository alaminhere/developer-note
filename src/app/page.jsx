import AuthButtons from '@/components/AuthButtons';
import Badeg from '@/components/ui/badeg';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Suspense } from 'react';

const Home = () => {
  return (
    <div className="max-w-7xl w-ful min-h-screen mx-auto px-5 py-10 flex flex-col items-center justify-center gap-5 scrollbar-none">
      <h1 className="text-neo-grey  text-5xl font-semibold tracking-wider ">
        DEVELOPER
      </h1>
      <h2 className="text-neo-black text-4xl font-semibold tracking-wider bg-neo-blue px-8 py-2 rounded-md -rotate-2">
        NOTEBOOK
      </h2>
      <p className="text-xl text-center font-medium max-w-2xl mt-5">
        This is a simple note-taking application for developers. It serves as an
        official baseline project for mastering database relationships, schema
        migrations, and Server Actions in Next.js.
      </p>

      <Suspense
        fallback={
          <Button size="lg" variant="green" className={'mt-5'}>
            Loading...
          </Button>
        }
      >
        <AuthButtons />
      </Suspense>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl w-full mx-auto">
        <Card>
          <Badeg>SERVER RENDERED</Badeg>
          <h4 className="mt-4">Server-first design</h4>
          <p className="mt-2">
            No client-side state hooks for fetching or list rendering. Pages are
            fully server-side rendered by default.
          </p>
        </Card>
        <Card>
          <Badeg variant="green">URL ROUTING</Badeg>
          <h4 className="mt-4">URL-driven state</h4>
          <p className="mt-2">
            Searches, active tags, and listings synchronize directly to the URL.
            Instant revalidation, clean routing.
          </p>
        </Card>
        <Card>
          <Badeg variant="pink">PRISMA PREPARED</Badeg>
          <h4 className="mt-4">Prisma ORM Integration</h4>
          <p className="mt-2">
            Prisma ORM API Data queries mirror Prisma client APIs. Swap mock
            files for generated database clients easily.
          </p>
        </Card>
      </div>
    </div>
  );
};
export default Home;

import { getTags } from '@/actions/noteAction';
import DashboardLayout from './DashboardLayout';
import { getCurrentUser } from '@/actions/auth';
import { Suspense } from 'react';

// this is e
const DashboardPage = async () => {
  const tags = await getTags();

  const currentUser = await getCurrentUser();

  return (
    <>
      <section className="w-full mx-auto  flex flex-col lg:flex-row gap-5  ">
        <Suspense fallback={<div>Loading...</div>}>
          <DashboardLayout tags={tags} currentUser={currentUser} />
        </Suspense>
      </section>
    </>
  );
};

export default DashboardPage;

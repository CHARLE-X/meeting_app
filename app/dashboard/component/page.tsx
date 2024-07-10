import React, { Suspense } from 'react';
import MeetingDetails from '@/app/dashboard/viewmeetings/page';

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MeetingDetails />
    </Suspense>
  );
};

export default Page;

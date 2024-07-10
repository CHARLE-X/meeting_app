'use client';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the MeetingDetails component with suspense support
const MeetingDetails = dynamic(() => import('@/app/dashboard/viewmeetings/page'), {
  suspense: true,
});

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MeetingDetails />
    </Suspense>
  );
};

export default Page;

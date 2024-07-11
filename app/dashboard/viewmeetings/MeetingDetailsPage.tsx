import React from 'react';
import SuspenseBoundaryWrapper from '@/app/dashboard/component/SuspenseBoundaryWrapper.tsx';
import MeetingDetails from '@/app/dashboard/viewmeetings/page';

const MeetingDetailsPage: React.FC = () => {
  return (
    <SuspenseBoundaryWrapper>
      <MeetingDetails />
    </SuspenseBoundaryWrapper>
  );
};

export default MeetingDetailsPage;

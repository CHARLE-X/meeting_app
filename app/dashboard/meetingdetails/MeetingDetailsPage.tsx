import React from 'react';
import SuspenseBoundaryWrapper from '@/app/dashboard/components/SuspenseBoundaryWrapper';
import MeetingDetails from '@/app/dashboard/meetingdetails/page';

const MeetingDetailsPage: React.FC = () => {
  return (
    <SuspenseBoundaryWrapper>
      <MeetingDetails />
    </SuspenseBoundaryWrapper>
  );
};

export default MeetingDetailsPage;

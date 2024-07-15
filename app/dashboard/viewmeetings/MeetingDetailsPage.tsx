// import React from 'react';
// import SuspenseBoundaryWrapper from '@/app/dashboard/component/SuspenseBoundaryWrapper';
// import MeetingDetails from '@/app/dashboard/viewmeetings/page';

// const MeetingDetailsPage: React.FC = () => {
//   return (
//     <SuspenseBoundaryWrapper>
//       <MeetingDetails />
//     </SuspenseBoundaryWrapper>
//   );
// };

// export default MeetingDetailsPage;
import React from 'react';
import SuspenseBoundaryWrapper from '@/app/dashboard/component/SuspenseBoundaryWrapper';
import MeetingDetails from '@/app/dashboard/viewmeetings/MeetingDetails';

const MeetingDetailsPage: React.FC = () => {
  return (
    <SuspenseBoundaryWrapper>
      <MeetingDetails />
    </SuspenseBoundaryWrapper>
  );
};

export default MeetingDetailsPage;

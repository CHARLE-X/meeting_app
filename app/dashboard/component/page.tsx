import React, { Suspense } from 'react';

const SuspenseBoundaryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
};

export default SuspenseBoundaryWrapper;

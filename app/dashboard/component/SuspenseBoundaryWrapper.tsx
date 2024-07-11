import React, { Suspense, ReactNode } from 'react';

interface SuspenseBoundaryWrapperProps {
  children: ReactNode;
}

const SuspenseBoundaryWrapper: React.FC<SuspenseBoundaryWrapperProps> = ({ children }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
};

export default SuspenseBoundaryWrapper;

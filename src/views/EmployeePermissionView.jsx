import React from 'react';
import RequestPermissionView from './RequestPermissionView';
import RequestApprovalView from './RequestApprovalView';

export const EmployeePermissionView = ({ onBack, user, initialMode = 'REQUEST' }) => {
  if (initialMode === 'APPROVAL') {
    return <RequestApprovalView onBack={onBack} user={user} />;
  }
  return <RequestPermissionView onBack={onBack} user={user} />;
};

export default EmployeePermissionView;

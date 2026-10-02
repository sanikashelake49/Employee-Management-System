import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div
      className="d-flex align-items-center justify-content-center gap-2 py-4"
      role="status"
      aria-live="polite"
    >
      <div className="spinner-border spinner-border-sm text-primary" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};

export default Loading;

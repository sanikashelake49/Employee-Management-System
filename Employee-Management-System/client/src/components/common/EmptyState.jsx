import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  title = 'No employees found.',
  description,
  actionTo,
  actionLabel,
}) => {
  return (
    <div className="text-center py-5" data-testid="empty-state">
      <h5 className="mb-2">{title}</h5>
      {description && <p className="text-muted mb-3">{description}</p>}
      {actionTo && actionLabel && (
        <Link to={actionTo} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;

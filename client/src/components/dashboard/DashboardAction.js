import React from 'react';
import { Link } from 'react-router-dom';

const DashboardAction = () => {
  return (
    <div className='dash-buttons'>
      <Link className='btn btn-light' to='/edit-profile'>
        <i className='fas fa-user-circle text-primary'></i> Edit Profile
      </Link>
      <Link className='btn btn-light' to='/add-experience'>
        <i className='fab fa-black-tie text-primary'></i> Add Experience
      </Link>
      <Link>
        <i className='fas fa-graduation-cap text-primary'></i> Add Education
      </Link>
    </div>
  );
};

export default DashboardAction;

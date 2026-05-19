import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-secondary mb-2">Page not found</p>
      <p className="text-secondary mb-8">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium flex items-center gap-2"
      >
        <FiHome size={18} /> Go Home
      </Link>
    </div>
  );
};

export default NotFound;

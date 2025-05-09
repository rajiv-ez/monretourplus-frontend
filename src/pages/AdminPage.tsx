import React from 'react';
import Dashboard from '../components/admin/Dashboard';

const AdminPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-50">
        <Dashboard />
      </main>
    </div>
  );
};

export default AdminPage;
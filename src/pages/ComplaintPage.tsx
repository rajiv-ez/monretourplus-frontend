import React from 'react';
import ComplaintForm from '../components/complaint/ComplaintForm';

const ComplaintPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-50">
        <ComplaintForm />
      </main>
    </div>
  );
};

export default ComplaintPage;
import React from 'react';
import FeedbackForm from '../components/feedback/FeedbackForm';

const FeedbackPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-50">
        <FeedbackForm />
      </main>
    </div>
  );
};

export default FeedbackPage;
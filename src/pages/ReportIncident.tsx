
import React from 'react';
import Navbar from '@/components/Navbar';
import ReportForm from '@/components/ReportForm';

const ReportIncident = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />
      <main className="container px-4 py-6 md:py-12 flex flex-col items-center">
        <ReportForm />
      </main>
    </div>
  );
};

export default ReportIncident;


import React from 'react';
import Navbar from '@/components/Navbar';
import SafetyTipCard from '@/components/SafetyTipCard';
import { useData } from '@/context/DataContext';

const SafetyTips = () => {
  const { safetyTips } = useData();
  
  // Group safety tips by category
  const tipsByCategory: Record<string, typeof safetyTips> = {};
  safetyTips.forEach(tip => {
    if (!tipsByCategory[tip.category]) {
      tipsByCategory[tip.category] = [];
    }
    tipsByCategory[tip.category].push(tip);
  });
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />
      <main className="container px-4 py-6 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Safety Tips & Alerts</h1>
          <p className="text-gray-600">
            Stay informed with these safety recommendations from local authorities.
          </p>
        </div>
        
        {Object.keys(tipsByCategory).map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tipsByCategory[category].map(tip => (
                <SafetyTipCard key={tip.id} tip={tip} />
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default SafetyTips;

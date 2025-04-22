
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, MapPin, Shield, CheckSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SafetyTipCard from '@/components/SafetyTipCard';
import { useData } from '@/context/DataContext';

const Home = () => {
  const navigate = useNavigate();
  const { safetyTips } = useData();
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />
      
      <main className="container px-4 pt-6 md:pt-24 pb-20">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="bg-safezone-purple/10 p-4 rounded-full mb-4">
            <Shield className="h-16 w-16 text-safezone-purple" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Welcome to SafeZone</h1>
          <p className="text-lg text-gray-600 max-w-xl mb-8">
            An anonymous platform for reporting suspicious activities and incidents to help keep our community safe.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            <Button
              className="h-auto py-6 bg-safezone-purple hover:bg-safezone-darkPurple"
              onClick={() => navigate('/report')}
            >
              <div className="flex flex-col items-center">
                <MapPin className="h-8 w-8 mb-2" />
                <span className="text-lg font-medium">Report Incident</span>
              </div>
            </Button>
            
            <Button
              variant="destructive"
              className="h-auto py-6"
              onClick={() => navigate('/emergency')}
            >
              <div className="flex flex-col items-center">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <span className="text-lg font-medium">Emergency SOS</span>
              </div>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Statistics cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Shield className="h-5 w-5 text-safezone-purple mr-2" />
                Community Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">184</div>
              <p className="text-sm text-gray-500">Reports submitted this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CheckSquare className="h-5 w-5 text-green-500 mr-2" />
                Resolution Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">78%</div>
              <p className="text-sm text-gray-500">Of reports successfully resolved</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">14 min</div>
              <p className="text-sm text-gray-500">Average emergency response</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Latest Safety Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safetyTips.slice(0, 2).map(tip => (
              <SafetyTipCard key={tip.id} tip={tip} />
            ))}
          </div>
          {safetyTips.length > 2 && (
            <div className="text-center mt-4">
              <Button variant="outline" onClick={() => navigate('/safety-tips')}>
                View All Safety Tips
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;

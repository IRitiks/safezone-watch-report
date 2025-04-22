
import React from 'react';
import Navbar from '@/components/Navbar';
import EmergencySOSButton from '@/components/EmergencySOSButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Phone } from 'lucide-react';

const EmergencySOS = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />
      <main className="container px-4 py-6 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-red-500 mb-4 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 mr-2" />
              Emergency SOS
            </h1>
            <p className="text-gray-600">
              Use this feature only in genuine emergency situations that require immediate assistance.
            </p>
          </div>
          
          <Card className="mb-8 border-red-200">
            <CardHeader className="bg-red-50 border-b border-red-100">
              <CardTitle>Emergency Help</CardTitle>
              <CardDescription>
                Activating SOS will alert authorities with your current location
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <EmergencySOSButton fullScreen />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-safezone-purple" />
                Emergency Contact Numbers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-medium">General Emergency</div>
                    <div className="text-sm text-gray-500">Police, Fire, Ambulance</div>
                  </div>
                  <div className="text-xl font-bold text-red-500">911</div>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-medium">Police Non-Emergency</div>
                    <div className="text-sm text-gray-500">For reporting non-urgent matters</div>
                  </div>
                  <div className="text-lg font-bold text-safezone-purple">311</div>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-medium">Crisis Hotline</div>
                    <div className="text-sm text-gray-500">Mental health crisis support</div>
                  </div>
                  <div className="text-lg font-bold text-safezone-purple">988</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EmergencySOS;

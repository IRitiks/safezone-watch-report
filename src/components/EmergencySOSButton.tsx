
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Siren, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/context/DataContext';

interface EmergencySOSButtonProps {
  fullScreen?: boolean;
}

const EmergencySOSButton: React.FC<EmergencySOSButtonProps> = ({ fullScreen = false }) => {
  const [active, setActive] = useState(false);
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const { toast } = useToast();
  const { addReport } = useData();
  
  const activateSOS = () => {
    if (active) return;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          
          setCountdown(3);
          const interval = setInterval(() => {
            setCountdown((prev) => {
              if (prev === null || prev <= 1) {
                clearInterval(interval);
                sendEmergencyAlert(position.coords.latitude, position.coords.longitude);
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        },
        (error) => {
          console.error("Error getting location for SOS:", error);
          toast({
            title: "Location error",
            description: "Unable to get your location. Emergency alert will still be sent.",
            variant: "destructive"
          });
          
          sendEmergencyAlert(40.7128, -74.0060);
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Emergency alert will still be sent.",
        variant: "destructive"
      });
      
      sendEmergencyAlert(40.7128, -74.0060);
    }
  };
  
  const sendEmergencyAlert = async (latitude: number, longitude: number) => {
    try {
      await addReport({
        description: "EMERGENCY SOS ALERT: Immediate assistance required.",
        location: { latitude, longitude },
        emergency: true,
        category: "Emergency SOS"
      });
      
      setActive(true);
      
      toast({
        title: "Emergency Alert Sent",
        description: "Your emergency alert has been dispatched to local authorities.",
        variant: "destructive"
      });
      
    } catch (error) {
      console.error("Error sending emergency alert:", error);
      toast({
        title: "Alert error",
        description: "Failed to send emergency alert. Please try again or call emergency services directly.",
        variant: "destructive"
      });
    }
  };
  
  const cancelSOS = () => {
    setActive(false);
    setCountdown(null);
    
    toast({
      title: "Emergency Alert Cancelled",
      description: "Your emergency alert has been cancelled.",
    });
  };
  
  if (fullScreen) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center p-6">
        {active ? (
          <div className="text-center">
            <div className="w-36 h-36 rounded-full bg-red-500 flex items-center justify-center mb-6 animate-pulse-emergency mx-auto">
              <Siren className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-red-500 mb-2">Emergency Alert Active</h2>
            <p className="text-gray-600 mb-6">
              Authorities have been notified of your emergency and location. Stay on this screen.
            </p>
            <Button 
              variant="outline" 
              className="border-red-500 text-red-500 hover:bg-red-50"
              onClick={cancelSOS}
            >
              Cancel Emergency
            </Button>
          </div>
        ) : countdown !== null ? (
          <div className="text-center">
            <div className="w-36 h-36 rounded-full bg-red-500 flex items-center justify-center mb-6 animate-pulse-emergency mx-auto">
              <span className="text-5xl font-bold text-white">{countdown}</span>
            </div>
            <h2 className="text-2xl font-bold text-red-500 mb-2">Sending Alert in {countdown}...</h2>
            <p className="text-gray-600 mb-6">
              Press cancel if this was an accident
            </p>
            <Button 
              variant="outline" 
              className="border-red-500 text-red-500 hover:bg-red-50"
              onClick={cancelSOS}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Button 
              className="w-36 h-36 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center mb-6"
              onClick={activateSOS}
            >
              <Siren className="w-16 h-16" />
            </Button>
            <h2 className="text-2xl font-bold mb-2">Emergency SOS</h2>
            <p className="text-gray-600 mb-2">
              Press the button to alert authorities of an emergency situation
            </p>
            <div className="flex items-center justify-center text-sm text-red-500">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Only use in genuine emergencies
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <Button 
      variant="destructive" 
      size="lg" 
      className={`${active ? 'animate-pulse-emergency' : ''}`}
      onClick={active ? cancelSOS : activateSOS}
    >
      <Siren className="mr-2 h-5 w-5" />
      {active ? 'Cancel Emergency Alert' : 'Activate Emergency SOS'}
    </Button>
  );
};

export default EmergencySOSButton;

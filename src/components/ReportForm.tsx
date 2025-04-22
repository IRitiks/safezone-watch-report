
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Camera, MapPin, Mic } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/hooks/use-toast';

const ReportForm: React.FC = () => {
  const navigate = useNavigate();
  const { addReport, loading } = useData();
  const { toast } = useToast();
  
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [emergency, setEmergency] = useState(false);
  const [location, setLocation] = useState<{latitude: number, longitude: number, address?: string} | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const [mediaType, setMediaType] = useState<'none' | 'photo' | 'audio'>('none');
  const [media, setMedia] = useState<File | null>(null);
  
  // Get current location when component mounts
  useEffect(() => {
    getLocation();
  }, []);
  
  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive"
      });
      return;
    }
    
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        // In a real app, we would use a reverse geocoding service to get the address
        // For demo, we'll just use the coordinates
        setLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Location error",
          description: "Unable to retrieve your location. Please enter it manually.",
          variant: "destructive"
        });
        setLoadingLocation(false);
      }
    );
  };
  
  const handlePhotoCapture = () => {
    // For demo purposes only - in real app would use device camera APIs or file input
    toast({
      title: "Photo capture",
      description: "Camera access would be requested here in a complete implementation."
    });
    setMediaType('photo');
  };
  
  const handleAudioCapture = () => {
    // For demo purposes only - in real app would use device microphone APIs
    toast({
      title: "Audio recording",
      description: "Microphone access would be requested here in a complete implementation."
    });
    setMediaType('audio');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description) {
      toast({
        title: "Description required",
        description: "Please provide a description of the incident.",
        variant: "destructive"
      });
      return;
    }
    
    if (!location && !manualLocation) {
      toast({
        title: "Location required",
        description: "Please allow location access or enter your location manually.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Use provided location or fallback to a default for demo
      const reportLocation = location || {
        latitude: 40.7128, 
        longitude: -74.0060,
        address: manualLocation || 'Location manually entered'
      };
      
      await addReport({
        description,
        location: reportLocation,
        emergency,
        category: category || undefined,
        // In a real app, we would upload media and get URLs
        mediaUrls: media ? ['https://example.com/mockurl'] : undefined
      });
      
      // Navigate back to home after submission
      navigate('/');
      
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Submission error",
        description: "Failed to submit your report. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Report an Incident</CardTitle>
        <CardDescription>
          Your report will be anonymous. No personal information is collected.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Emergency toggle */}
          <div className="flex items-center space-x-2 bg-red-50 p-3 rounded-md">
            <Switch 
              id="emergency-mode" 
              checked={emergency}
              onCheckedChange={setEmergency}
            />
            <div className="flex items-center">
              <AlertTriangle className={`h-5 w-5 mr-2 ${emergency ? 'text-red-500' : 'text-gray-500'}`} />
              <Label htmlFor="emergency-mode" className={emergency ? 'text-red-500 font-medium' : ''}>
                This is an emergency situation
              </Label>
            </div>
          </div>
          
          {/* Category selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Incident Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Suspicious Activity">Suspicious Activity</SelectItem>
                <SelectItem value="Theft">Theft or Robbery</SelectItem>
                <SelectItem value="Vandalism">Vandalism</SelectItem>
                <SelectItem value="Traffic Incident">Traffic Incident</SelectItem>
                <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
                <SelectItem value="Missing Person">Missing Person</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Incident Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe what you witnessed..." 
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          {/* Location */}
          <div className="space-y-2">
            <Label className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Location
            </Label>
            
            <div className="flex items-center space-x-2">
              <RadioGroup defaultValue="auto" className="flex space-x-4">
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="auto" id="location-auto" 
                    onClick={getLocation}
                  />
                  <Label htmlFor="location-auto">Use my location</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="manual" id="location-manual" 
                    onClick={() => setLocation(null)}
                  />
                  <Label htmlFor="location-manual">Enter manually</Label>
                </div>
              </RadioGroup>
            </div>
            
            {loadingLocation ? (
              <div className="text-sm text-gray-500">Detecting your location...</div>
            ) : location ? (
              <div className="text-sm bg-gray-100 p-2 rounded">
                {location.address || `Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`}
              </div>
            ) : (
              <Input 
                placeholder="Enter address or description of location" 
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
              />
            )}
          </div>
          
          {/* Media Capture */}
          <div className="space-y-2">
            <Label>Add Media (Optional)</Label>
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant={mediaType === 'photo' ? 'default' : 'outline'} 
                className="flex-1"
                onClick={handlePhotoCapture}
              >
                <Camera className="h-4 w-4 mr-2" />
                Photo
              </Button>
              <Button 
                type="button" 
                variant={mediaType === 'audio' ? 'default' : 'outline'} 
                className="flex-1"
                onClick={handleAudioCapture}
              >
                <Mic className="h-4 w-4 mr-2" />
                Audio
              </Button>
            </div>
            {mediaType !== 'none' && (
              <div className="text-sm text-gray-500 italic">
                Media capture functionality would be implemented here in a complete application.
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReportForm;

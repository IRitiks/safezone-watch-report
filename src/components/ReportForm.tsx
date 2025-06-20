import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Camera, MapPin, Mic, MicOff, Play, Square, X, Upload } from 'lucide-react';
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
  
  // Media states
  const [photos, setPhotos] = useState<File[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Media refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get current location when component mounts
  useEffect(() => {
    getLocation();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
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
    fileInputRef.current?.click();
  };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files).filter(file => file.type.startsWith('image/'));
      if (newPhotos.length + photos.length > 5) {
        toast({
          title: "Too many photos",
          description: "You can only upload up to 5 photos.",
          variant: "destructive"
        });
        return;
      }
      setPhotos(prev => [...prev, ...newPhotos]);
      toast({
        title: "Photos added",
        description: `${newPhotos.length} photo(s) added successfully.`,
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Recording started",
        description: "Recording audio... Tap stop when finished.",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      toast({
        title: "Recording stopped",
        description: "Audio recorded successfully.",
      });
    }
  };

  const playAudio = () => {
    if (audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const removeAudio = () => {
    setAudioBlob(null);
    setRecordingTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
      const reportLocation = location || {
        latitude: 23.2599, 
        longitude: 77.4126,
        address: manualLocation || 'Location manually entered'
      };
      
      // Create media URLs array for submission
      const mediaUrls: string[] = [];
      
      // In a real app, you would upload files to a storage service and get URLs
      // For demo purposes, we'll create object URLs
      if (photos.length > 0) {
        photos.forEach((photo, index) => {
          const photoUrl = URL.createObjectURL(photo);
          mediaUrls.push(photoUrl);
          console.log(`Photo ${index + 1} ready for upload:`, photo.name, photo.size);
        });
      }
      
      if (audioBlob) {
        const audioUrl = URL.createObjectURL(audioBlob);
        mediaUrls.push(audioUrl);
        console.log('Audio ready for upload:', audioBlob.size, 'bytes');
      }
      
      await addReport({
        description,
        location: reportLocation,
        emergency,
        category: category || undefined,
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined
      });
      
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
          
          {/* Photo Capture */}
          <div className="space-y-3">
            <Label>Add Photos (Optional)</Label>
            <div className="space-y-3">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handlePhotoCapture}
              >
                <Camera className="h-4 w-4 mr-2" />
                Add Photos ({photos.length}/5)
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoSelect}
              />
              
              {photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Audio Recording */}
          <div className="space-y-3">
            <Label>Add Audio Recording (Optional)</Label>
            <div className="space-y-3">
              {!audioBlob ? (
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant={isRecording ? "destructive" : "outline"}
                    onClick={isRecording ? stopRecording : startRecording}
                    className="flex-1"
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="h-4 w-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                  {isRecording && (
                    <div className="text-sm font-mono text-red-500">
                      {formatTime(recordingTime)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 p-3 rounded border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={isPlaying ? stopAudio : playAudio}
                      >
                        {isPlaying ? (
                          <Square className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                      <span className="text-sm">
                        Audio Recording ({formatTime(recordingTime)})
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeAudio}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
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


import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

export interface Report {
  id: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timestamp: number;
  mediaUrls?: string[];
  status: 'new' | 'reviewing' | 'resolved';
  emergency: boolean;
  category?: string;
  anonymousId?: string;
}

export interface SafetyTip {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  category: string;
}

interface DataContextType {
  reports: Report[];
  safetyTips: SafetyTip[];
  addReport: (report: Omit<Report, 'id' | 'timestamp' | 'status'>) => Promise<void>;
  updateReportStatus: (id: string, status: Report['status']) => Promise<void>;
  addSafetyTip: (tip: Omit<SafetyTip, 'id' | 'timestamp'>) => Promise<void>;
  getReportsByLocation: (lat: number, lng: number, radiusKm: number) => Report[];
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Mock data for development
const mockReports: Report[] = [
  {
    id: '1',
    description: 'Suspicious activity near the park entrance. Person in dark clothing looking into parked cars.',
    location: {
      latitude: 23.2599,
      longitude: 77.4126,
      address: 'Upper Lake, Bhopal, Madhya Pradesh'
    },
    timestamp: Date.now() - 3600000 * 2, // 2 hours ago
    status: 'new',
    emergency: false,
    category: 'Suspicious Activity'
  },
  {
    id: '2',
    description: 'Hit and run accident involving a silver sedan. License plate partially visible: MP09**',
    location: {
      latitude: 23.2315,
      longitude: 77.4219,
      address: 'DB City Mall, Bhopal, Madhya Pradesh'
    },
    timestamp: Date.now() - 3600000 * 5, // 5 hours ago
    status: 'reviewing',
    emergency: true,
    category: 'Traffic Incident'
  },
  {
    id: '3',
    description: 'Graffiti on public building wall, appears to be gang-related symbols.',
    location: {
      latitude: 23.2640,
      longitude: 77.4060,
      address: 'Collectorate Complex, Bhopal, Madhya Pradesh'
    },
    timestamp: Date.now() - 86400000, // 1 day ago
    status: 'resolved',
    emergency: false,
    category: 'Vandalism'
  },
  {
    id: '4',
    description: 'Emergency: Person collapsed on sidewalk, appears unresponsive.',
    location: {
      latitude: 23.2470,
      longitude: 77.4030,
      address: 'New Market Area, Bhopal, Madhya Pradesh'
    },
    timestamp: Date.now() - 1800000, // 30 minutes ago
    status: 'new',
    emergency: true,
    category: 'Medical Emergency'
  },
  {
    id: '5',
    description: 'Lost child, approximately 6 years old, wearing red jacket and blue jeans.',
    location: {
      latitude: 23.2340,
      longitude: 77.4200,
      address: 'Phoenix Citadel Mall, Bhopal, Madhya Pradesh'
    },
    timestamp: Date.now() - 7200000, // 2 hours ago
    status: 'reviewing',
    emergency: true,
    category: 'Missing Person'
  }
];

const mockSafetyTips: SafetyTip[] = [
  {
    id: '1',
    title: 'Stay Safe After Dark',
    content: 'When walking at night, stick to well-lit areas and main streets. Consider using ride-sharing services for late night transportation.',
    timestamp: Date.now() - 604800000, // 1 week ago
    category: 'Personal Safety'
  },
  {
    id: '2',
    title: 'Secure Your Home While Away',
    content: 'Going on vacation? Ask a trusted neighbor to collect mail and use timer lights to give the appearance someone is home.',
    timestamp: Date.now() - 1209600000, // 2 weeks ago
    category: 'Home Security'
  },
  {
    id: '3',
    title: 'Online Meeting Safety',
    content: 'When meeting someone from online, always meet in a public place during daylight hours and let a friend know your plans.',
    timestamp: Date.now() - 259200000, // 3 days ago
    category: 'Digital Safety'
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [safetyTips, setSafetyTips] = useState<SafetyTip[]>(mockSafetyTips);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Simulate fetching data from Firebase
  useEffect(() => {
    setLoading(true);
    
    // Simulate network delay
    const timer = setTimeout(() => {
      // In a real app, would fetch from Firestore
      setReports(mockReports);
      setSafetyTips(mockSafetyTips);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const addReport = async (reportData: Omit<Report, 'id' | 'timestamp' | 'status'>) => {
    try {
      setLoading(true);
      
      const newReport: Report = {
        ...reportData,
        id: uuidv4(),
        timestamp: Date.now(),
        status: 'new'
      };
      
      // Update local state
      setReports(prev => [newReport, ...prev]);
      
      // In a real app, would add to Firestore
      // const reportRef = await addDoc(collection(firestore, 'reports'), newReport);
      
      toast({
        title: reportData.emergency ? 'Emergency Report Sent!' : 'Report Submitted',
        description: reportData.emergency ? 
          'Authorities have been notified of your emergency.' : 
          'Thank you for helping keep the community safe.',
      });
      
    } catch (error) {
      console.error('Error adding report:', error);
      toast({
        title: 'Failed to submit report',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (id: string, status: Report['status']) => {
    try {
      setLoading(true);
      
      // Update local state
      setReports(prev => 
        prev.map(report => 
          report.id === id ? { ...report, status } : report
        )
      );
      
      // In a real app, would update in Firestore
      // await updateDoc(doc(firestore, 'reports', id), { status });
      
      toast({
        title: 'Report Updated',
        description: `Report status changed to ${status}`,
      });
      
    } catch (error) {
      console.error('Error updating report:', error);
      toast({
        title: 'Failed to update report',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addSafetyTip = async (tipData: Omit<SafetyTip, 'id' | 'timestamp'>) => {
    try {
      setLoading(true);
      
      const newTip: SafetyTip = {
        ...tipData,
        id: uuidv4(),
        timestamp: Date.now(),
      };
      
      // Update local state
      setSafetyTips(prev => [newTip, ...prev]);
      
      // In a real app, would add to Firestore
      // const tipRef = await addDoc(collection(firestore, 'safetyTips'), newTip);
      
      toast({
        title: 'Safety Tip Published',
        description: 'The safety tip has been published to all users.',
      });
      
    } catch (error) {
      console.error('Error adding safety tip:', error);
      toast({
        title: 'Failed to publish safety tip',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getReportsByLocation = (lat: number, lng: number, radiusKm: number): Report[] => {
    // Simple implementation that returns reports within a radius
    // In a real app, would use geospatial queries from Firestore
    
    // Calculate distance between two coordinates using Haversine formula
    const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Radius of the earth in km
      const dLat = deg2rad(lat2-lat1);
      const dLon = deg2rad(lon2-lon1); 
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const d = R * c; // Distance in km
      return d;
    };
    
    const deg2rad = (deg: number) => {
      return deg * (Math.PI/180);
    };
    
    return reports.filter(report => {
      const distance = getDistanceFromLatLonInKm(
        lat, 
        lng, 
        report.location.latitude,
        report.location.longitude
      );
      return distance <= radiusKm;
    });
  };

  const value = {
    reports,
    safetyTips,
    addReport,
    updateReportStatus,
    addSafetyTip,
    getReportsByLocation,
    loading
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

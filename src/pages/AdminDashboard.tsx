
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckSquare, Clock, MapPin, TrendingUp, TrendingDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminNavbar from '@/components/AdminNavbar';
import IncidentCard from '@/components/IncidentCard';
import LocationMap from '@/components/LocationMap';
import { useData, Report } from '@/context/DataContext';

const AdminDashboard = () => {
  const { reports } = useData();
  const [timeFrame, setTimeFrame] = useState('today');
  
  // Filter reports based on timeframe
  const getFilteredReports = (timeframe: string): Report[] => {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    const weekInMs = 7 * dayInMs;
    const monthInMs = 30 * dayInMs;
    
    switch (timeframe) {
      case 'today':
        return reports.filter(report => (now - report.timestamp) < dayInMs);
      case 'week':
        return reports.filter(report => (now - report.timestamp) < weekInMs);
      case 'month':
        return reports.filter(report => (now - report.timestamp) < monthInMs);
      default:
        return reports;
    }
  };
  
  const filteredReports = getFilteredReports(timeFrame);
  const emergencyReports = filteredReports.filter(r => r.emergency);
  const newReports = filteredReports.filter(r => r.status === 'new');
  const reviewingReports = filteredReports.filter(r => r.status === 'reviewing');
  const resolvedReports = filteredReports.filter(r => r.status === 'resolved');
  
  // Calculate stats and metrics
  const totalReports = filteredReports.length;
  const resolvedPercentage = totalReports > 0 ? Math.round((resolvedReports.length / totalReports) * 100) : 0;
  
  // Categories counts for summary
  const categories: Record<string, number> = {};
  filteredReports.forEach(report => {
    const category = report.category || 'Uncategorized';
    categories[category] = (categories[category] || 0) + 1;
  });
  
  // Sort categories by count
  const sortedCategories = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5 categories
  
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Overview of incident reports and safety metrics
          </p>
        </div>
        
        <div className="mb-6">
          <Tabs value={timeFrame} onValueChange={setTimeFrame}>
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
              <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Stat cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Emergency Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{emergencyReports.length}</div>
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">+12%</span>
                <span className="text-gray-500 ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                New Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{newReports.length}</div>
              <div className="flex items-center text-sm">
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-red-500">-5%</span>
                <span className="text-gray-500 ml-1">from last period</span>
              </div>
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
              <div className="text-3xl font-bold">{resolvedPercentage}%</div>
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">+8%</span>
                <span className="text-gray-500 ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <MapPin className="h-5 w-5 text-safezone-purple mr-2" />
                Total Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalReports}</div>
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">+15%</span>
                <span className="text-gray-500 ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent incidents */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Incidents</CardTitle>
                <CardDescription>
                  Latest reports requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredReports.slice(0, 3).map(report => (
                    <IncidentCard key={report.id} report={report} />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Incident Map</CardTitle>
                <CardDescription>
                  Geographic distribution of reported incidents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LocationMap 
                  latitude={40.7128} 
                  longitude={-74.0060}
                  zoom={12}
                  markers={filteredReports.map(report => ({
                    latitude: report.location.latitude,
                    longitude: report.location.longitude,
                    title: report.category || 'Incident',
                    type: report.emergency ? 'emergency' : 'normal'
                  }))}
                  height="300px"
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Right sidebar with stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">New</span>
                      <span className="text-sm">{newReports.length} reports</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${totalReports ? (newReports.length / totalReports) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Reviewing</span>
                      <span className="text-sm">{reviewingReports.length} reports</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${totalReports ? (reviewingReports.length / totalReports) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Resolved</span>
                      <span className="text-sm">{resolvedReports.length} reports</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${totalReports ? (resolvedReports.length / totalReports) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedCategories.map(([category, count]) => (
                    <div key={category}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{category}</span>
                        <span className="text-sm">{count} reports</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-safezone-purple h-2 rounded-full" 
                          style={{ width: `${totalReports ? (count / totalReports) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

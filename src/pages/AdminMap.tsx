
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, AlertTriangle } from 'lucide-react';
import AdminNavbar from '@/components/AdminNavbar';
import LocationMap from '@/components/LocationMap';
import { useData, Report } from '@/context/DataContext';

const AdminMap = () => {
  const { reports } = useData();
  const [timeRange, setTimeRange] = useState('week');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewType, setViewType] = useState<'standard' | 'heatmap'>('standard');
  const [showEmergency, setShowEmergency] = useState(true);
  const [showNonEmergency, setShowNonEmergency] = useState(true);
  
  // Get unique categories from reports
  const categories = ['all', ...Array.from(new Set(reports.map(r => r.category || 'Uncategorized')))];
  
  // Filter reports based on filters
  const getFilteredReports = (): Report[] => {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    const weekInMs = 7 * dayInMs;
    const monthInMs = 30 * dayInMs;
    
    let filteredByTime: Report[];
    
    // Apply time filter
    switch (timeRange) {
      case 'day':
        filteredByTime = reports.filter(report => (now - report.timestamp) < dayInMs);
        break;
      case 'week':
        filteredByTime = reports.filter(report => (now - report.timestamp) < weekInMs);
        break;
      case 'month':
        filteredByTime = reports.filter(report => (now - report.timestamp) < monthInMs);
        break;
      case 'all':
        filteredByTime = reports;
        break;
      default:
        filteredByTime = reports;
    }
    
    // Apply category filter
    const filteredByCategory = categoryFilter === 'all' 
      ? filteredByTime 
      : filteredByTime.filter(report => 
          report.category === categoryFilter || 
          (!report.category && categoryFilter === 'Uncategorized')
        );
    
    // Apply emergency filter
    return filteredByCategory.filter(report => 
      (report.emergency && showEmergency) || (!report.emergency && showNonEmergency)
    );
  };
  
  const filteredReports = getFilteredReports();
  
  // Group by category for the list view
  const reportsByCategory: Record<string, Report[]> = {};
  filteredReports.forEach(report => {
    const category = report.category || 'Uncategorized';
    if (!reportsByCategory[category]) {
      reportsByCategory[category] = [];
    }
    reportsByCategory[category].push(report);
  });
  
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Incident Map</h1>
          <p className="text-gray-600">
            Visualize incident reports by location
          </p>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Map Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="time-range" className="block mb-2">Time Range</Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger id="time-range">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Past 24 Hours</SelectItem>
                    <SelectItem value="week">Past Week</SelectItem>
                    <SelectItem value="month">Past Month</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category" className="block mb-2">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="view-type" className="block mb-2">View Type</Label>
                <Tabs value={viewType} onValueChange={(v) => setViewType(v as 'standard' | 'heatmap')}>
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="standard">Standard</TabsTrigger>
                    <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div>
                <Label className="block mb-2">Incident Types</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="show-emergency" 
                      checked={showEmergency}
                      onCheckedChange={setShowEmergency}
                    />
                    <Label htmlFor="show-emergency" className="cursor-pointer flex items-center">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                      Emergency Reports
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="show-non-emergency" 
                      checked={showNonEmergency}
                      onCheckedChange={setShowNonEmergency}
                    />
                    <Label htmlFor="show-non-emergency" className="cursor-pointer flex items-center">
                      <MapPin className="h-4 w-4 text-blue-500 mr-1" />
                      Non-Emergency Reports
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Incident Map</span>
                  <Badge variant="outline" className="ml-2">
                    {filteredReports.length} Incidents
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {viewType === 'standard' ? 'Showing individual incident markers' : 'Showing incident density heatmap'}
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
                  height="600px"
                />
                <div className="mt-4 text-sm text-gray-500">
                  In a complete implementation, this would be an interactive Leaflet.js map with proper markers and heatmap visualization.
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Incidents by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(reportsByCategory).map(([category, reports]) => (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{category}</h3>
                        <Badge>{reports.length}</Badge>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {reports.slice(0, 3).map(report => (
                          <div key={report.id} className="bg-gray-50 p-2 rounded text-sm">
                            <div className="flex items-start">
                              {report.emergency && <AlertTriangle className="h-4 w-4 text-red-500 mr-1 mt-0.5" />}
                              <div className="truncate">{report.description.substring(0, 50)}...</div>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {report.location.address || `${report.location.latitude.toFixed(3)}, ${report.location.longitude.toFixed(3)}`}
                            </div>
                          </div>
                        ))}
                        {reports.length > 3 && (
                          <div className="text-xs text-center text-gray-500">
                            +{reports.length - 3} more incidents
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {Object.keys(reportsByCategory).length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No incidents match your current filters
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMap;

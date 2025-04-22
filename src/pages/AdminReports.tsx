
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Clock, AlertTriangle, CheckSquare, Clock2 } from 'lucide-react';
import AdminNavbar from '@/components/AdminNavbar';
import LocationMap from '@/components/LocationMap';
import { useData, Report } from '@/context/DataContext';
import { formatDistanceToNow } from 'date-fns';

const AdminReports = () => {
  const { reports, updateReportStatus } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [emergencyFilter, setEmergencyFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Get unique categories from reports
  const categories = ['all', ...Array.from(new Set(reports.map(r => r.category || 'Uncategorized')))];
  
  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    // Search term filter
    const matchesSearch = !searchTerm || 
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.category && report.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.location.address && report.location.address.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || 
      report.category === categoryFilter || 
      (!report.category && categoryFilter === 'Uncategorized');
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    // Emergency filter
    const matchesEmergency = emergencyFilter === 'all' || 
      (emergencyFilter === 'emergency' && report.emergency) ||
      (emergencyFilter === 'non-emergency' && !report.emergency);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesEmergency;
  });
  
  const handleStatusChange = async (reportId: string, newStatus: Report['status']) => {
    await updateReportStatus(reportId, newStatus);
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({...selectedReport, status: newStatus});
    }
  };
  
  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500';
      case 'reviewing':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Incident Reports</h1>
          <p className="text-gray-600">
            View and manage all submitted reports
          </p>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search reports..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={emergencyFilter} onValueChange={setEmergencyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Emergency Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="emergency">Emergency Only</SelectItem>
                  <SelectItem value="non-emergency">Non-Emergency Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 bg-gray-50 border-b">
                  <th className="py-3 px-4 font-medium">ID</th>
                  <th className="py-3 px-4 font-medium">Category</th>
                  <th className="py-3 px-4 font-medium">Description</th>
                  <th className="py-3 px-4 font-medium">Location</th>
                  <th className="py-3 px-4 font-medium">Time</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredReports.map(report => (
                  <tr key={report.id} className={report.emergency ? 'bg-red-50' : ''}>
                    <td className="py-3 px-4 text-sm">{report.id.substring(0, 8)}...</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {report.emergency && <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />}
                        <span>{report.category || 'Uncategorized'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-xs truncate" title={report.description}>
                        {report.description.substring(0, 60)}...
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="truncate max-w-[150px]">
                          {report.location.address || `${report.location.latitude.toFixed(3)}, ${report.location.longitude.toFixed(3)}`}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setSelectedReport(report)}
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            {selectedReport && (
                              <>
                                <DialogHeader>
                                  <DialogTitle className="flex items-center">
                                    {selectedReport.emergency && <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />}
                                    {selectedReport.category || 'Uncategorized'} Report
                                  </DialogTitle>
                                  <DialogDescription className="flex items-center">
                                    <Clock2 className="h-4 w-4 mr-1" />
                                    Reported {formatDistanceToNow(new Date(selectedReport.timestamp), { addSuffix: true })}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Description</h4>
                                    <p className="text-gray-700 mb-4">{selectedReport.description}</p>
                                    
                                    {selectedReport.mediaUrls && selectedReport.mediaUrls.length > 0 && (
                                      <div className="mb-4">
                                        <h4 className="font-medium mb-2">Attached Media</h4>
                                        <p className="text-sm text-gray-500 italic">
                                          Media attachments would be displayed here in a real implementation.
                                        </p>
                                      </div>
                                    )}
                                    
                                    <h4 className="font-medium mb-2">Current Status</h4>
                                    <div className="flex space-x-2">
                                      <Button 
                                        variant={selectedReport.status === 'new' ? 'default' : 'outline'} 
                                        size="sm"
                                        onClick={() => handleStatusChange(selectedReport.id, 'new')}
                                        className={selectedReport.status === 'new' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                                      >
                                        New
                                      </Button>
                                      <Button 
                                        variant={selectedReport.status === 'reviewing' ? 'default' : 'outline'} 
                                        size="sm"
                                        onClick={() => handleStatusChange(selectedReport.id, 'reviewing')}
                                        className={selectedReport.status === 'reviewing' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                                      >
                                        Reviewing
                                      </Button>
                                      <Button 
                                        variant={selectedReport.status === 'resolved' ? 'default' : 'outline'} 
                                        size="sm"
                                        onClick={() => handleStatusChange(selectedReport.id, 'resolved')}
                                        className={selectedReport.status === 'resolved' ? 'bg-green-500 hover:bg-green-600' : ''}
                                      >
                                        Resolved
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">Location</h4>
                                    <LocationMap 
                                      latitude={selectedReport.location.latitude} 
                                      longitude={selectedReport.location.longitude}
                                      zoom={15}
                                      markers={[
                                        {
                                          latitude: selectedReport.location.latitude,
                                          longitude: selectedReport.location.longitude,
                                          type: selectedReport.emergency ? 'emergency' : 'normal'
                                        }
                                      ]}
                                      height="200px"
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                      {selectedReport.location.address || `Lat: ${selectedReport.location.latitude.toFixed(6)}, Lng: ${selectedReport.location.longitude.toFixed(6)}`}
                                    </p>
                                  </div>
                                </div>
                                
                                <DialogFooter>
                                  {selectedReport.status !== 'resolved' && (
                                    <Button 
                                      className="bg-green-500 hover:bg-green-600" 
                                      onClick={() => handleStatusChange(selectedReport.id, 'resolved')}
                                    >
                                      <CheckSquare className="h-4 w-4 mr-2" />
                                      Mark as Resolved
                                    </Button>
                                  )}
                                </DialogFooter>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No reports match your current filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminReports;

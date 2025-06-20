import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import IncidentCard from '@/components/IncidentCard';
import LocationMap from '@/components/LocationMap';
import { useData, Report } from '@/context/DataContext';

const ViewIncidents = () => {
  const { reports } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState<'list' | 'map'>('list');
  
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
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />
      <main className="container px-4 py-6 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Recent Incidents</h1>
          
          <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'map')} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-2 md:w-[200px]">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search incidents..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 md:flex">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
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
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Tabs value={view} className="w-full">
          <TabsContent value="list" className="mt-0">
            {filteredReports.length > 0 ? (
              <div className="space-y-4">
                {filteredReports.map(report => (
                  <IncidentCard key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
                  <MapPin className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No incidents found</h3>
                <p className="text-gray-500">Adjust your filters to see more results</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="map" className="mt-0">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <LocationMap 
                latitude={23.2599} 
                longitude={77.4126}
                zoom={12}
                markers={filteredReports.map(report => ({
                  latitude: report.location.latitude,
                  longitude: report.location.longitude,
                  title: report.category || 'Incident',
                  type: report.emergency ? 'emergency' : 'normal'
                }))}
                height="500px"
              />
              <div className="mt-4 text-sm text-gray-500 text-center">
                Map showing {filteredReports.length} incidents in the area
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ViewIncidents;

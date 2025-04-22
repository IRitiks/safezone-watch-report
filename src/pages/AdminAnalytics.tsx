
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "recharts";
import { BarChart as BarChartIcon, LineChart as LineIcon, PieChart as PieChartIcon, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import AdminNavbar from '@/components/AdminNavbar';
import { useData, Report } from '@/context/DataContext';

// This is a placeholder component to simulate Recharts
// In a real implementation, we would use the actual Recharts components
const RechartsPlaceholder: React.FC<{
  type: 'bar' | 'line' | 'pie';
  title: string;
  height?: number;
}> = ({ type, title, height = 300 }) => (
  <div 
    className="border border-gray-200 rounded-md flex flex-col items-center justify-center bg-gray-50"
    style={{ height }}
  >
    <div className="text-gray-400 mb-2">
      {type === 'bar' && <BarChartIcon size={24} />}
      {type === 'line' && <LineIcon size={24} />}
      {type === 'pie' && <PieChartIcon size={24} />}
    </div>
    <div className="text-sm text-gray-500">{title} Chart Placeholder</div>
    <div className="text-xs text-gray-400 mt-1">(Recharts would render here)</div>
  </div>
);

const AdminAnalytics = () => {
  const { reports } = useData();
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState<'daily' | 'category' | 'status'>('daily');
  
  // Prepare data for visualization
  const getAnalyticsData = () => {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    const weekInMs = 7 * dayInMs;
    const monthInMs = 30 * dayInMs;
    
    let filteredReports: Report[];
    
    // Filter by time range
    switch (timeRange) {
      case 'week':
        filteredReports = reports.filter(report => (now - report.timestamp) < weekInMs);
        break;
      case 'month':
        filteredReports = reports.filter(report => (now - report.timestamp) < monthInMs);
        break;
      case 'year':
        filteredReports = reports.filter(report => (now - report.timestamp) < 12 * monthInMs);
        break;
      case 'all':
        filteredReports = reports;
        break;
      default:
        filteredReports = reports;
    }
    
    // Count by category
    const categoryData: Record<string, number> = {};
    filteredReports.forEach(report => {
      const category = report.category || 'Uncategorized';
      categoryData[category] = (categoryData[category] || 0) + 1;
    });
    
    // Count by status
    const statusData: Record<string, number> = {
      new: 0,
      reviewing: 0,
      resolved: 0
    };
    filteredReports.forEach(report => {
      statusData[report.status] = (statusData[report.status] || 0) + 1;
    });
    
    // Count by day (for daily trend)
    const dailyData: Record<string, number> = {};
    // Initialize with all days in the period
    const daysToShow = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(now - (i * dayInMs));
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyData[dateStr] = 0;
    }
    
    // Fill in actual counts
    filteredReports.forEach(report => {
      const date = new Date(report.timestamp);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyData[dateStr] !== undefined) {
        dailyData[dateStr] = (dailyData[dateStr] || 0) + 1;
      }
    });
    
    // Calculate emergency percentage
    const emergencyCount = filteredReports.filter(r => r.emergency).length;
    const emergencyPercentage = filteredReports.length > 0 
      ? Math.round((emergencyCount / filteredReports.length) * 100)
      : 0;
    
    // Calculate resolution rate
    const resolvedCount = filteredReports.filter(r => r.status === 'resolved').length;
    const resolutionRate = filteredReports.length > 0
      ? Math.round((resolvedCount / filteredReports.length) * 100)
      : 0;
    
    return {
      categoryData,
      statusData,
      dailyData,
      totalReports: filteredReports.length,
      emergencyPercentage,
      resolutionRate
    };
  };
  
  const analyticsData = getAnalyticsData();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Analyze incident reports and track community safety metrics
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                Total Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analyticsData.totalReports}</div>
              <div className="text-sm text-gray-500">in selected time period</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                Emergency Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analyticsData.emergencyPercentage}%</div>
              <div className="text-sm text-gray-500">of total incidents</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 text-green-500 mr-2" />
                Resolution Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analyticsData.resolutionRate}%</div>
              <div className="text-sm text-gray-500">incidents resolved</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
          <Card className="flex-grow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Incident Analytics</CardTitle>
                
                <div className="flex space-x-2">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Past Week</SelectItem>
                      <SelectItem value="month">Past Month</SelectItem>
                      <SelectItem value="year">Past Year</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Tabs value={chartType} onValueChange={(v) => setChartType(v as 'daily' | 'category' | 'status')} className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="daily">Daily Trend</TabsTrigger>
                  <TabsTrigger value="category">By Category</TabsTrigger>
                  <TabsTrigger value="status">By Status</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="daily" className="mt-0">
                <RechartsPlaceholder type="line" title="Daily Incident" height={400} />
              </TabsContent>
              
              <TabsContent value="category" className="mt-0">
                <RechartsPlaceholder type="bar" title="Incidents by Category" height={400} />
              </TabsContent>
              
              <TabsContent value="status" className="mt-0">
                <RechartsPlaceholder type="pie" title="Incidents by Status" height={400} />
              </TabsContent>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Incident Categories</CardTitle>
              <CardDescription>Most frequently reported incident types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analyticsData.categoryData)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([category, count]) => (
                    <div key={category}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{category}</span>
                        <span className="text-sm">{count} reports</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-safezone-purple h-2 rounded-full" 
                          style={{ width: `${analyticsData.totalReports ? (count / analyticsData.totalReports) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                }
                
                {Object.keys(analyticsData.categoryData).length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No data available for the selected period
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Incident Resolution</CardTitle>
              <CardDescription>Current status of reported incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <RechartsPlaceholder type="pie" title="Resolution Status" height={250} />
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-blue-50 p-3 rounded-md text-center">
                  <div className="text-xl font-bold text-blue-500">{analyticsData.statusData.new}</div>
                  <div className="text-sm text-gray-600">New</div>
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-md text-center">
                  <div className="text-xl font-bold text-yellow-500">{analyticsData.statusData.reviewing}</div>
                  <div className="text-sm text-gray-600">Reviewing</div>
                </div>
                
                <div className="bg-green-50 p-3 rounded-md text-center">
                  <div className="text-xl font-bold text-green-500">{analyticsData.statusData.resolved}</div>
                  <div className="text-sm text-gray-600">Resolved</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;

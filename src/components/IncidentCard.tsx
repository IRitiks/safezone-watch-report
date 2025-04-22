
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, MapPin } from 'lucide-react';
import { Report } from '@/context/DataContext';
import { formatDistanceToNow } from 'date-fns';

interface IncidentCardProps {
  report: Report;
}

const IncidentCard: React.FC<IncidentCardProps> = ({ report }) => {
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
    <Card className={`mb-4 ${report.emergency ? 'border-red-500 border-2' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg md:text-xl flex items-center">
            {report.emergency && <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />}
            {report.category || 'General Report'}
          </CardTitle>
          <Badge className={getStatusColor(report.status)}>
            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </Badge>
        </div>
        <CardDescription className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          {formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm md:text-base">{report.description}</p>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-gray-500 flex items-center">
        <MapPin className="h-4 w-4 mr-1" />
        {report.location.address || `${report.location.latitude.toFixed(6)}, ${report.location.longitude.toFixed(6)}`}
      </CardFooter>
    </Card>
  );
};

export default IncidentCard;

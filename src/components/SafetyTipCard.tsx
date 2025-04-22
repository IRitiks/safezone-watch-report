
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from 'lucide-react';
import { SafetyTip } from '@/context/DataContext';
import { formatDistanceToNow } from 'date-fns';

interface SafetyTipCardProps {
  tip: SafetyTip;
}

const SafetyTipCard: React.FC<SafetyTipCardProps> = ({ tip }) => {
  return (
    <Card className="mb-4 border-l-4 border-l-safezone-purple hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{tip.title}</CardTitle>
          <Badge variant="outline" className="bg-safezone-purple/10 text-safezone-purple border-safezone-purple/30">
            {tip.category}
          </Badge>
        </div>
        <CardDescription className="flex items-center text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          {formatDistanceToNow(new Date(tip.timestamp), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{tip.content}</p>
      </CardContent>
    </Card>
  );
};

export default SafetyTipCard;

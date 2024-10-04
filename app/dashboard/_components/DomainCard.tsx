import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DomainCardProps {
  domain: string;
  projectName: string;
  isLoading: boolean;
}

export const DomainCard: React.FC<DomainCardProps> = ({ domain, projectName, isLoading }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(domain);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800 truncate" title={domain}>
                  {domain}
                </h3>
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Visit website</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <p className="text-sm text-gray-600">Project: {projectName}</p>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

/*import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton"; // {{ edit_1 }}

interface DomainCardProps {
  domain: string;
  projectName: string;
  isLoading: boolean; // {{ edit_2 }}
}

export const DomainCard: React.FC<DomainCardProps> = ({ domain, projectName, isLoading }) => { // {{ edit_3 }}
  return (
    <Card className="shadow-lg border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl p-4">
      <CardHeader>
        {isLoading ? ( // {{ edit_4 }}
          <Skeleton className="h-6 w-1/2" />
        ) : (
          <CardTitle className="text-xl font-bold text-gray-800">{domain}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? ( // {{ edit_5 }}
          <Skeleton className="h-4 w-3/4" />
        ) : (
          <p className="text-gray-600">Project: {projectName}</p>
        )}
      </CardContent>
    </Card>
  );
};
*/
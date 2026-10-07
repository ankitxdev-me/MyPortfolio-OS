import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Download, Printer, Mail, MapPin, Briefcase } from 'lucide-react';

export const ResumeHeader: React.FC = () => {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6 border-b border-border/80 pb-8">
      {/* Top Badge & Action Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">Interactive Resume</Badge>
          <Badge variant="success" size="md">Available for Senior Roles</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Print Resume
          </Button>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Download PDF
            </Button>
          </a>
        </div>
      </div>

      {/* Main Candidate Overview */}
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Ankit <span className="orange-gradient-text">Gupta</span>
        </h1>
        <p className="text-lg font-bold text-primary flex items-center gap-2">
          <Briefcase className="w-5 h-5" /> Senior Full Stack & AI Systems Engineer
        </p>

        <div className="flex flex-wrap gap-4 text-xs font-mono text-muted-foreground pt-1">
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" /> San Francisco, CA / Remote</span>
          <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-primary" /> ankit@example.com</span>
          <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-primary" /> 3+ Years Experience</span>
        </div>
      </div>
    </div>
  );
};

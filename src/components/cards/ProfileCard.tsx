import React from 'react';
import { Card } from './Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Mail } from 'lucide-react';

export interface ProfileCardProps {
  name: string;
  role: string;
  avatar?: string;
  location?: string;
  status?: string;
  email?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  avatar,
  location = 'India',
  status = 'Open for projects',
  email,
}) => {
  return (
    <Card variant="glass" padding="lg" className="text-center flex flex-col items-center space-y-4">
      <Avatar src={avatar} fallback={name.substring(0, 2)} size="xl" status="online" />
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-foreground">{name}</h3>
        <p className="text-sm text-primary font-medium">{role}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {location}</span>
        {status && <Badge variant="success" size="sm">{status}</Badge>}
      </div>

      {email && (
        <a
          href={`mailto:${email}`}
          className="w-full py-2 px-4 rounded-lg bg-surface border border-border text-xs font-medium text-foreground hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
        >
          <Mail className="w-3.5 h-3.5 text-primary" /> {email}
        </a>
      )}
    </Card>
  );
};

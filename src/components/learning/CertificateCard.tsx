import React from 'react';
import { Card } from '@/components/cards/Card';
import { Award, ExternalLink, ShieldCheck } from 'lucide-react';

export interface CertificateCardProps {
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  url: string;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  title,
  issuer,
  issueDate,
  credentialId,
  url,
}) => {
  return (
    <Card variant="glass" padding="md" className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">{title}</h4>
            <p className="text-xs text-primary font-semibold">{issuer}</p>
          </div>
        </div>

        <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Verify Certificate">
          <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
        </a>
      </div>

      <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ID: {credentialId}
        </span>
        <span>Issued: {issueDate}</span>
      </div>
    </Card>
  );
};

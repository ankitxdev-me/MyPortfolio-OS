import React from 'react';
import { Card } from '@/components/cards/Card';
import { AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react';

export interface ChallengeCardProps {
  title: string;
  problem: string;
  solution: string;
  outcome: string;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title,
  problem,
  solution,
  outcome,
}) => {
  return (
    <Card variant="glass" padding="md" className="space-y-4">
      <h4 className="font-bold text-foreground text-base flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" /> {title}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
          <span className="font-mono text-rose-400 font-semibold uppercase flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Problem
          </span>
          <p className="text-muted-foreground">{problem}</p>
        </div>

        <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
          <span className="font-mono text-primary font-semibold uppercase flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5" /> Solution
          </span>
          <p className="text-muted-foreground">{solution}</p>
        </div>

        <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
          <span className="font-mono text-emerald-400 font-semibold uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Outcome
          </span>
          <p className="text-muted-foreground">{outcome}</p>
        </div>
      </div>
    </Card>
  );
};

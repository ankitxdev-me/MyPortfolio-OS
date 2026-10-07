import React from 'react';
import { Card } from '@/components/cards/Card';
import { HardDrive } from 'lucide-react';

export interface StorageWidgetProps {
  usedStorageMb: number;
  totalStorageMb: number;
}

export const StorageWidget: React.FC<StorageWidgetProps> = ({ usedStorageMb, totalStorageMb }) => {
  const percentage = Math.round((usedStorageMb / totalStorageMb) * 100);
  const usedGb = (usedStorageMb / 1024).toFixed(1);
  const totalGb = (totalStorageMb / 1024).toFixed(1);

  return (
    <Card variant="glass" padding="md" className="space-y-4 border-primary/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold text-foreground">Storage Allocation</h3>
        </div>
        <span className="text-xs font-mono font-bold text-primary">{percentage}% Used</span>
      </div>

      <div className="space-y-1.5">
        <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
          <div style={{ width: `${percentage}%` }} className="h-full bg-primary transition-all duration-500" />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
          <span>{usedGb} GB Used</span>
          <span>{totalGb} GB Total Capacity</span>
        </div>
      </div>

      {/* Progress Tiers */}
      <div className="space-y-1.5 pt-2 border-t border-border/60">
        {[
          { label: 'Images & Media', sizeGb: ((usedStorageMb * 0.65) / 1024).toFixed(2), color: 'bg-primary' },
          { label: 'Documents & PDFs', sizeGb: ((usedStorageMb * 0.20) / 1024).toFixed(2), color: 'bg-emerald-500' },
          { label: 'Diagrams & Exports', sizeGb: ((usedStorageMb * 0.15) / 1024).toFixed(2), color: 'bg-violet-500' },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
            <span className="font-mono text-foreground">{item.sizeGb} GB</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

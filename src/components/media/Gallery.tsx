import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface GalleryImage {
  src: string;
  alt?: string;
  caption?: string;
}

export interface GalleryProps {
  images: GalleryImage[];
  className?: string;
}

export const Gallery: React.FC<GalleryProps> = ({ images, className }) => {
  const [selected, setSelected] = React.useState<number | null>(null);

  return (
    <>
      <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4', className)}>
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setSelected(idx)}
            className="group relative h-40 rounded-xl overflow-hidden bg-surface border border-border cursor-pointer"
          >
            <img src={img.src} alt={img.alt || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-semibold text-foreground">
              View
            </div>
          </div>
        ))}
      </div>

      {selected !== null && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4">
          <button type="button" onClick={() => setSelected(null)} className="absolute top-4 right-4 text-foreground p-2 rounded-full bg-surface border border-border">
            ✕
          </button>
          <img src={images[selected].src} alt="" className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl border border-border" />
        </div>
      )}
    </>
  );
};

export interface CarouselProps {
  items: React.ReactNode[];
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ items, className }) => {
  const [index, setIndex] = React.useState(0);

  const prev = () => setIndex((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === items.length - 1 ? 0 : i + 1));

  return (
    <div className={cn('relative w-full overflow-hidden rounded-xl bg-surface border border-border p-4', className)}>
      <div className="transition-all duration-300">{items[index]}</div>
      {items.length > 1 && (
        <div className="flex items-center justify-between mt-4 border-t border-border/50 pt-3">
          <button type="button" onClick={prev} className="p-1.5 rounded-lg bg-surface border border-border text-foreground hover:border-primary/50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-muted-foreground">
            {index + 1} / {items.length}
          </span>
          <button type="button" onClick={next} className="p-1.5 rounded-lg bg-surface border border-border text-foreground hover:border-primary/50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

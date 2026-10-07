import React from 'react';
import { cn } from '@/lib/utils';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  caption?: string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt = '',
  aspectRatio = 'auto',
  caption,
  className,
  ...props
}) => {
  const aspects = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: 'aspect-auto',
  };

  return (
    <figure className="w-full">
      <div className={cn('relative overflow-hidden rounded-xl bg-surface border border-border', aspects[aspectRatio])}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={cn('w-full h-full object-cover transition-opacity duration-300', className)}
          {...props}
        />
      </div>
      {caption && <figcaption className="mt-2 text-center text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
};

export const OptimizedImage = Image;

import React from 'react';
import { cn } from '@/lib/utils';

export interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, className, ...props }) => {
  return (
    <div className={cn('relative w-full rounded-xl overflow-hidden bg-black border border-border aspect-video', className)}>
      <video
        src={src}
        poster={poster}
        controls
        className="w-full h-full object-cover"
        {...props}
      />
    </div>
  );
};

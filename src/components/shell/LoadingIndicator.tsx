import React, { useEffect, useState } from 'react';

export const LoadingIndicator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleStart = () => {
      setLoading(true);
      setProgress(20);

      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(timer);
            return 90;
          }
          return prev + 15;
        });
      }, 100);
    };

    const handleComplete = () => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    };

    window.addEventListener('beforeunload', handleStart);
    window.addEventListener('DOMContentLoaded', handleComplete);

    return () => {
      clearInterval(timer);
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('DOMContentLoaded', handleComplete);
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent pointer-events-none">
      <div
        className="h-full bg-primary shadow-[0_0_10px_var(--color-primary)] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

import React from 'react';
import { Button, type ButtonProps } from './Button';

export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, 'aria-label': ariaLabel, ...props }, ref) => {
    return (
      <Button ref={ref} variant="icon" aria-label={ariaLabel} {...props}>
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Island Error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Card variant="glass" padding="md" className="border-rose-500/30 space-y-4 text-center my-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              {this.props.fallbackTitle || 'Component Encountered an Error'}
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              {this.state.error?.message || 'An unexpected rendering error occurred in this interactive island.'}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={this.handleReset}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="mx-auto"
          >
            Try Reloading Component
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}

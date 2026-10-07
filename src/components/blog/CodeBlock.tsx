import React from 'react';
import { Check, Copy, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CodeBlockProps {
  filename?: string;
  language?: string;
  code: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  filename,
  language = 'typescript',
  code,
  className,
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('rounded-xl border border-border bg-[#0D0D11] overflow-hidden my-6 shadow-card', className)}>
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-border/80 text-xs font-mono">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Code2 className="w-3.5 h-3.5 text-primary" />
          <span>{filename || `snippet.${language}`}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground uppercase">{language}</span>
          <button
            type="button"
            onClick={copyCode}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
            aria-label="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code Area */}
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-foreground/90 leading-relaxed no-scrollbar">
        <code>{code}</code>
      </pre>
    </div>
  );
};

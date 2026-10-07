import React from 'react';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { Mail, ArrowRight, Check } from 'lucide-react';

export const ContactCTA: React.FC = () => {
  const [copied, setCopied] = React.useState(false);
  const email = 'ankitgupta72724@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-t border-border/80 relative overflow-hidden">
      {/* Background Subtle Accent Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12">
        <Card variant="glass" padding="lg" className="text-center space-y-6 py-12 md:py-16 relative border-primary/20">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-semibold text-primary uppercase tracking-widest">
              Available For Engineering Roles & Projects
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Let's Build Something <span className="orange-gradient-text">Exceptional</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Have a product idea, technical project, or software engineering position? I'm open to discussing new opportunities.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a href="/contact">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Get In Touch
              </Button>
            </a>

            <Button
              variant="outline"
              size="lg"
              onClick={copyEmail}
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Mail className="w-4 h-4 text-primary" />}
            >
              {copied ? 'Email Copied!' : email}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

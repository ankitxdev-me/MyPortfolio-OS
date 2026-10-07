import React, { useState } from 'react';
import type { ContactFAQItem } from '@/data/contactData';
import { Card } from '@/components/cards/Card';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface ContactFAQProps {
  faqs: ContactFAQItem[];
}

export const ContactFAQ: React.FC<ContactFAQProps> = ({ faqs }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <HelpCircle className="w-6 h-6 text-primary" /> Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <Card
              key={faq.id}
              variant="glass"
              padding="md"
              className="cursor-pointer border-border/80 hover:border-primary/40 transition-colors"
              onClick={() => toggle(faq.id)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">[{faq.category}]</span> {faq.question}
                </h3>
                <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </div>

              {isOpen && (
                <div className="pt-3 mt-3 border-t border-border/60 text-xs text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Briefcase,
  Wrench,
  Users,
  MessageSquare,
} from 'lucide-react';

export type InquiryType = 'freelance' | 'job' | 'network' | 'general';

interface InquiryOption {
  id: InquiryType;
  label: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const INQUIRY_OPTIONS: InquiryOption[] = [
  {
    id: 'freelance',
    label: 'Freelance & Tasks',
    badge: 'Quick Tasks or Full Builds',
    icon: Wrench,
    description: 'Quick bug fixes, MVP development, custom features, or web applications',
  },
  {
    id: 'job',
    label: 'Job Opportunity',
    badge: 'Full-time / Contract',
    icon: Briefcase,
    description: 'Full-time roles, contract engineering, internships, or technical consulting',
  },
  {
    id: 'network',
    label: 'Network & Collab',
    badge: 'Tech & Open Source',
    icon: Users,
    description: 'Coffee chat, open source collaboration, or brainstorming technical ideas',
  },
  {
    id: 'general',
    label: 'Say Hello',
    badge: 'Quick Question',
    icon: MessageSquare,
    description: 'General questions, feedback on projects, or just dropping in to say hi',
  },
];

export const ContactForm: React.FC = () => {
  const [inquiryType, setInquiryType] = useState<InquiryType>('freelance');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    company: '',
    projectScope: 'Small Task / Quick Fix',
    budget: 'Flexible / Open to Discussion',
    timeline: 'Flexible',
    roleType: 'Full-time Software Engineer',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const currentOption = INQUIRY_OPTIONS.find((opt) => opt.id === inquiryType)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMsg('Please provide your name, email address, and message.');
      return;
    }

    setSubmitting(true);
    setStatus('idle');

    // Build rich subject and metadata based on intent
    let finalSubject = formData.subject.trim();
    let metaHeader = `[Type: ${currentOption.label}]`;

    if (inquiryType === 'freelance') {
      if (!finalSubject) finalSubject = `Project Inquiry: ${formData.projectScope}`;
      metaHeader += ` [Scope: ${formData.projectScope} | Budget: ${formData.budget} | Timeline: ${formData.timeline}]`;
    } else if (inquiryType === 'job') {
      if (!finalSubject) finalSubject = `Opportunity: ${formData.roleType}${formData.company ? ` @ ${formData.company}` : ''}`;
      metaHeader += ` [Role: ${formData.roleType}${formData.company ? ` | Company: ${formData.company}` : ''}]`;
    } else if (inquiryType === 'network') {
      if (!finalSubject) finalSubject = 'Networking / Tech Discussion';
    } else {
      if (!finalSubject) finalSubject = 'General Portfolio Message';
    }

    const payloadMessage = `${metaHeader}\n\n${formData.message.trim()}`;

    try {
      const res = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: finalSubject,
          message: payloadMessage,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || 'Failed to submit contact message.');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        company: '',
        projectScope: 'Small Task / Quick Fix',
        budget: 'Flexible / Open to Discussion',
        timeline: 'Flexible',
        roleType: 'Full-time Software Engineer',
        message: '',
      });
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err?.message || 'Failed to submit contact message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getMessagePlaceholder = () => {
    switch (inquiryType) {
      case 'freelance':
        return 'Tell me about what you need built (e.g. "I need a quick API bug fix", "Looking to build an MVP landing page", "Need a full-stack dashboard"). Any details help!';
      case 'job':
        return 'Share details about the role, team, technology stack, and what you are looking for...';
      case 'network':
        return 'What are you working on or interested in chatting about? Excited to connect and exchange ideas!';
      case 'general':
      default:
        return 'Drop your thoughts, feedback, questions, or just say hello!';
    }
  };

  return (
    <div className="space-y-6">
      {/* Friendly Encouragement Banner */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <p className="font-semibold text-foreground">All Inquiries & Tasks Are Welcome!</p>
          <p className="text-muted-foreground leading-relaxed">
            Whether you have a <strong>1-hour quick bug fix</strong>, an <strong>MVP build</strong>, or a <strong>job opportunity</strong> — feel free to reach out. I respond to every message within 24 hours.
          </p>
        </div>
      </div>

      {/* Interactive Intent Chips */}
      <div className="space-y-2">
        <label className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block">
          What would you like to connect about?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {INQUIRY_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = inquiryType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setInquiryType(opt.id);
                  setStatus('idle');
                }}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary/15 border-primary text-foreground shadow-glow-sm scale-[1.02]'
                    : 'bg-surface/60 border-border text-muted-foreground hover:border-border-hover hover:text-foreground hover:bg-surface'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                </div>
                <div>
                  <div className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {opt.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono leading-tight mt-0.5">
                    {opt.badge}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {status === 'success' ? (
        <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-3 text-center animate-fade-in">
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
          <h3 className="text-xl font-bold text-foreground">Message Sent Successfully!</h3>
          <p className="text-sm text-emerald-300 max-w-md mx-auto leading-relaxed">
            Thank you for reaching out, <strong>{formData.name || 'friend'}</strong>. I've received your note and will get back to you at <strong>{formData.email}</strong> shortly.
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatus('idle')}
              className="border-emerald-500/40 hover:bg-emerald-500/20"
            >
              Send Another Note
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === 'error' && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase flex items-center justify-between">
                <span>Your Name *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Rivera"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase flex items-center justify-between">
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. alex@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Contextual Fields: Freelance / Tasks */}
          {inquiryType === 'freelance' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl bg-surface/40 border border-border/70 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Task / Project Scope</label>
                <select
                  value={formData.projectScope}
                  onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none"
                >
                  <option>Small Task / Quick Fix</option>
                  <option>Feature Addition / API</option>
                  <option>Full MVP Development</option>
                  <option>Complete Web Application</option>
                  <option>AI Agent / Automation</option>
                  <option>Code Review / Audit</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Budget Range</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none"
                >
                  <option>Flexible / Open to Discussion</option>
                  <option>Small Task (&lt; $250)</option>
                  <option>$250 - $1,000 (Feature/Bug)</option>
                  <option>$1,000 - $3,000 (MVP Build)</option>
                  <option>$3,000 - $10,000 (Full Project)</option>
                  <option>$10,000+ (Enterprise / Scaled)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Target Timeline</label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none"
                >
                  <option>Flexible / No Rush</option>
                  <option>Urgent (&lt; 3-5 Days)</option>
                  <option>1-2 Weeks</option>
                  <option>1 Month</option>
                  <option>2+ Months</option>
                </select>
              </div>
            </div>
          )}

          {/* Contextual Fields: Job / Role */}
          {inquiryType === 'job' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl bg-surface/40 border border-border/70 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Role / Contract Type</label>
                <select
                  value={formData.roleType}
                  onChange={(e) => setFormData({ ...formData, roleType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none"
                >
                  <option>Full-time Software Engineer</option>
                  <option>Contract / Freelance Engineer</option>
                  <option>Internship / New Grad Role</option>
                  <option>AI / Full-Stack Consultant</option>
                  <option>Advisory / Part-time</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Company / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp / Stealth Startup"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Subject Field (Optional / Auto-filled) */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase flex items-center justify-between">
              <span>Subject (Optional)</span>
            </label>
            <input
              type="text"
              placeholder={
                inquiryType === 'freelance'
                  ? 'e.g. Help needed with Next.js & Stripe integration'
                  : inquiryType === 'job'
                  ? 'e.g. Full-Stack Engineer role at [Company]'
                  : inquiryType === 'network'
                  ? 'e.g. Let’s connect on AI workflows / agents'
                  : 'e.g. Hello Ankit!'
              }
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Message Area */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase flex items-center justify-between">
              <span>Message *</span>
              <span className="text-[10px] text-muted-foreground font-normal lowercase">Markdown supported</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder={getMessagePlaceholder()}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-base font-bold shadow-glow-sm"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending Message...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" /> Send Message
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
};

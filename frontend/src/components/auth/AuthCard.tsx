import { ReactNode } from 'react';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

const AuthCard = ({ children, title, subtitle, className }: AuthCardProps) => {
  return (
    <div className={cn(
      "w-full max-w-md mx-auto",
      className
    )}>
      {/* Logo */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="relative">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-primary/20 animate-ping opacity-50" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">
          <span className="text-foreground">Med</span>
          <span className="text-primary">Vision</span>
          <span className="text-muted-foreground font-normal ml-2">AI</span>
        </h1>
      </div>

      {/* Card */}
      <div className="relative animate-fade-in-up delay-100">
        {/* Gradient border effect */}
        <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-primary/50 via-primary/20 to-accent/30 opacity-50" />
        
        <div className="relative bg-card rounded-xl p-8 border border-border/50 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>

          {/* Content */}
          {children}
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground mt-6 animate-fade-in delay-300">
        Secure medical platform • HIPAA-aware design
      </p>
    </div>
  );
};

export default AuthCard;

import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface Requirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'One number', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  const passedCount = requirements.filter((req) => req.test(password)).length;
  
  if (passedCount === 0 || password.length === 0) {
    return { score: 0, label: '', color: '' };
  }
  if (passedCount <= 2) {
    return { score: 1, label: 'Weak', color: 'bg-destructive' };
  }
  if (passedCount <= 4) {
    return { score: 2, label: 'Medium', color: 'bg-yellow-500' };
  }
  return { score: 3, label: 'Strong', color: 'bg-green-500' };
};

export const isPasswordValid = (password: string): boolean => {
  return requirements.every((req) => req.test(password));
};

const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const strength = getPasswordStrength(password);
  
  if (!password) return null;

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Strength bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password strength</span>
          <span className={cn(
            "font-medium",
            strength.score === 1 && "text-destructive",
            strength.score === 2 && "text-yellow-500",
            strength.score === 3 && "text-green-500"
          )}>
            {strength.label}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={cn(
                "h-1 flex-1 rounded-full transition-all duration-300",
                level <= strength.score ? strength.color : "bg-border"
              )}
            />
          ))}
        </div>
      </div>

      {/* Requirements list */}
      <div className="grid grid-cols-1 gap-1.5">
        {requirements.map((req, index) => {
          const passed = req.test(password);
          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors duration-200",
                passed ? "text-green-500" : "text-muted-foreground"
              )}
            >
              {passed ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <X className="w-3.5 h-3.5" />
              )}
              <span>{req.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;

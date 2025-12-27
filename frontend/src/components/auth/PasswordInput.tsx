import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
}

const PasswordInput = ({
  id,
  value,
  onChange,
  placeholder = "Enter password",
  error = false,
  disabled = false,
  className,
  autoComplete = "current-password",
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={cn(
          "bg-secondary border-border pr-10 transition-all duration-200",
          "focus:ring-2 focus:ring-primary/20 focus:border-primary",
          error && "border-destructive focus:ring-destructive/20 focus:border-destructive",
          className
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
        onClick={() => setShowPassword(!showPassword)}
        tabIndex={-1}
        disabled={disabled}
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export default PasswordInput;

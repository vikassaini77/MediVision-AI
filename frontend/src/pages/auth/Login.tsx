import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedMedicalBackground from '@/components/auth/AnimatedMedicalBackground';
import AuthCard from '@/components/auth/AuthCard';
import PasswordInput from '@/components/auth/PasswordInput';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter your email and password.');
      triggerShake();
      return;
    }

    const result = await signIn(email, password, rememberMe);
    
    if (result.error) {
      setError(result.error);
      triggerShake();
    } else {
      navigate(from, { replace: true });
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedMedicalBackground />
      
      <div className="relative z-10 w-full">
        <AuthCard
          title="Welcome Back"
          subtitle="Secure access to MedVision AI"
          className={cn(shake && "animate-shake")}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@hospital.org"
                disabled={isLoading}
                autoComplete="email"
                className={cn(
                  "bg-secondary border-border transition-all duration-200",
                  "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                  error && !email && "border-destructive"
                )}
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={setPassword}
                placeholder="Enter your password"
                disabled={isLoading}
                error={!!error && !password}
              />
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link
                to="/auth/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="medical"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Sign up link */}
            <p className="text-center text-sm text-muted-foreground">
              New to MedVision AI?{' '}
              <Link
                to="/auth/signup"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Create an account
              </Link>
            </p>
          </form>
        </AuthCard>
      </div>
    </div>
  );
};

export default Login;

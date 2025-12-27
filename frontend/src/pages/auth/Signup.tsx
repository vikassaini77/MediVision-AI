import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import AnimatedMedicalBackground from '@/components/auth/AnimatedMedicalBackground';
import AuthCard from '@/components/auth/AuthCard';
import PasswordInput from '@/components/auth/PasswordInput';
import PasswordStrengthIndicator, { isPasswordValid } from '@/components/auth/PasswordStrengthIndicator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const roles: { value: UserRole; label: string }[] = [
  { value: 'radiologist', label: 'Radiologist' },
  { value: 'physician', label: 'Physician' },
  { value: 'researcher', label: 'Medical Researcher' },
  { value: 'admin', label: 'Hospital Admin' },
];

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, isLoading } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('radiologist');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const isFormValid = fullName && email && isPasswordValid(password) && passwordsMatch && acceptTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email) {
      setError('Please fill in all required fields.');
      triggerShake();
      return;
    }

    if (!isPasswordValid(password)) {
      setError('Please ensure your password meets all requirements.');
      triggerShake();
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.');
      triggerShake();
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the Terms of Service and Privacy Policy.');
      triggerShake();
      return;
    }

    const result = await signUp(email, password, fullName, role);
    
    if (result.error) {
      setError(result.error);
      triggerShake();
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedMedicalBackground />
      
      <div className="relative z-10 w-full py-8">
        <AuthCard
          title="Create Account"
          subtitle="Join MedVision AI platform"
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

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. John Smith"
                disabled={isLoading}
                autoComplete="name"
                className="bg-secondary border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Email */}
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
                className="bg-secondary border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)} disabled={isLoading}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={setPassword}
                placeholder="Create a secure password"
                disabled={isLoading}
                autoComplete="new-password"
              />
              <PasswordStrengthIndicator password={password} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Confirm your password"
                disabled={isLoading}
                error={confirmPassword.length > 0 && !passwordsMatch}
                autoComplete="new-password"
              />
              {confirmPassword && (
                <div className={cn(
                  "flex items-center gap-2 text-xs transition-colors",
                  passwordsMatch ? "text-green-500" : "text-destructive"
                )}>
                  {passwordsMatch ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Terms acceptance */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                disabled={isLoading}
                className="mt-0.5"
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:text-primary/80 transition-colors">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="medical"
              className="w-full h-11"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            {/* Sign in link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Sign In
              </Link>
            </p>
          </form>
        </AuthCard>
      </div>
    </div>
  );
};

export default Signup;

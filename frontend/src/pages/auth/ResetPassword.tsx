import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedMedicalBackground from '../../components/auth/AnimatedMedicalBackground';
import AuthCard from '../../components/auth/AuthCard';
import PasswordInput from '../../components/auth/PasswordInput';
import PasswordStrengthIndicator, { isPasswordValid } from '../../components/auth/PasswordStrengthIndicator';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updatePassword } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const token = searchParams.get('token');
  const passwordsMatch = password === confirmPassword;
  const isFormValid = isPasswordValid(password) && passwordsMatch;

  useEffect(() => {
    // Redirect to forgot password if no token
    if (!token) {
      // For demo, we'll allow access without token
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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

    setIsLoading(true);
    // Note: ensure your updatePassword function handles the logic correctly
    const result = await updatePassword(password);
    setIsLoading(false);

    if (result && result.error) {
      setError(result.error);
      triggerShake();
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/auth/login', { replace: true });
      }, 3000);
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
          title={isSuccess ? "Password Reset Complete" : "Set New Password"}
          subtitle={isSuccess ? undefined : "Create a secure password for your account"}
          className={cn(shake && "animate-shake")}
        >
          {isSuccess ? (
            <div className="space-y-6 animate-fade-in">
              {/* Success icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="p-4 rounded-full bg-green-500/10 border border-green-500/20">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                </div>
              </div>

              {/* Success message */}
              <div className="text-center space-y-2">
                <p className="text-foreground">
                  Your password has been successfully reset.
                </p>
                <p className="text-sm text-muted-foreground">
                  You will be redirected to the login page shortly.
                </p>
              </div>

              {/* Progress indicator */}
              <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-[progress_3s_linear]" />
              </div>

              {/* Manual redirect link */}
              <Link to="/auth/login">
                <Button variant="outline" className="w-full">
                  Continue to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error message */}
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-fade-in">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Enter new password"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <PasswordStrengthIndicator password={password} />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <PasswordInput
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Confirm new password"
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

              {/* Submit button */}
              <Button
                type="submit"
                variant="default" // Changed from 'medical' to 'default' to be safe, revert if you have a custom variant
                className="w-full h-11"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>

              {/* Back to login */}
              <Link to="/auth/login" className="block">
                <Button variant="ghost" className="w-full text-muted-foreground">
                  Cancel and return to Sign In
                </Button>
              </Link>
            </form>
          )}
        </AuthCard>
      </div>
    </div>
  );
};

export default ResetPassword;
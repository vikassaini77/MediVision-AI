import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import AnimatedMedicalBackground from '../../components/auth/AnimatedMedicalBackground';
import AuthCard from '../../components/auth/AuthCard';

import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';

import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Mail,
} from 'lucide-react';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError(null);
    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedMedicalBackground />

      <div className="relative z-10 w-full max-w-md">
        <AuthCard
          title={isSubmitted ? 'Check Your Email' : 'Reset Password'}
          subtitle={
            isSubmitted
              ? undefined
              : 'Enter your email to receive a reset link'
          }
        >
          {isSubmitted ? (
            <div className="space-y-6 animate-fade-in">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
              </div>

              {/* Success Message */}
              <div className="text-center space-y-2">
                <p className="text-foreground">
                  If an account exists for{' '}
                  <span className="font-medium text-primary">
                    {email}
                  </span>
                  , you will receive a password reset link shortly.
                </p>
                <p className="text-sm text-muted-foreground">
                  Please check your inbox and spam folder.
                </p>
              </div>

              {/* Email Hint */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>Check your inbox</span>
                </div>
              </div>

              {/* Back to Login */}
              <Link to="/auth/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
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
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the email associated with your account.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default" // Changed 'medical' to 'default' to ensure it displays correctly. Change back if 'medical' exists.
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              {/* Back to Login */}
              <Link to="/auth/login" className="block">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-muted-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </form>
          )}
        </AuthCard>
      </div>
    </div>
  );
};

export default ForgotPassword;
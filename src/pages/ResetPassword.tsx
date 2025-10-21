import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/navigation/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsEmailSent(true);
      
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error: unknown) {
      console.error('Password reset error:', error);
      
      // Handle specific Firebase errors
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string };
        
        if (firebaseError.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email address';
        } else if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address';
        } else if (firebaseError.code === 'auth/too-many-requests') {
          errorMessage = 'Too many requests. Please try again later';
        } else if (firebaseError.code === 'auth/network-request-failed') {
          errorMessage = 'Network error. Please check your connection';
        }
      }
      
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      await resetPassword(email);
      toast({
        title: "Email Resent",
        description: "Password reset email has been sent again",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-6 sm:pb-8">
        <div className="max-w-md mx-auto px-3 sm:px-0">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className="mb-6 p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>

          <Card className="shadow-craft-soft">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-heading">Reset Password</CardTitle>
              <CardDescription>
                {isEmailSent 
                  ? "We've sent you a password reset link"
                  : "Enter your email to receive a password reset link"
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {!isEmailSent ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending Reset Email...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Reset Email
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Check Your Email</h3>
                    <p className="text-sm text-muted-foreground">
                      We've sent a password reset link to:
                    </p>
                    <p className="font-medium text-sm">{email}</p>
                  </div>

                  <Alert>
                    <Mail className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Next Steps:</strong>
                      <br />
                      1. Check your email inbox (and spam folder)
                      <br />
                      2. Click the reset link in the email
                      <br />
                      3. Create a new password
                      <br />
                      4. Return to login with your new password
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={handleResendEmail}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Resending...
                        </>
                      ) : (
                        'Resend Email'
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      onClick={() => navigate('/login')}
                      className="w-full"
                    >
                      Back to Login
                    </Button>
                  </div>
                </div>
              )}

              {/* Additional Help */}
              <div className="mt-6 pt-4 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  Remember your password?{' '}
                  <Link 
                    to="/login" 
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Help Information */}
          <Card className="mt-6 shadow-craft-soft">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p><strong>Email not arriving?</strong></p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                  <li>Check your spam/junk folder</li>
                  <li>Make sure you entered the correct email</li>
                  <li>Wait a few minutes for delivery</li>
                  <li>Try resending the email</li>
                </ul>
              </div>
              
              <div className="text-sm space-y-2">
                <p><strong>Still having trouble?</strong></p>
                <p className="text-muted-foreground">
                  Contact support or try creating a new account if you no longer have access to your email.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

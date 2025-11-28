import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { authService } from '../../services/auth';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const magicLinkSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type MagicLinkFormData = z.infer<typeof magicLinkSchema>;

const MagicLinkPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Supabase sends token_hash and type as query params
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
  });

  useEffect(() => {
    // Check if we have token_hash and type from Supabase redirect (for magic links)
    if (tokenHash && type === 'email') {
      handleVerifyToken(tokenHash);
      return;
    }

    // Handle OAuth callback (Google, etc.)
    // Supabase OAuth redirects will have code or error in URL
    if (error) {
      showToast(errorDescription || 'Authentication failed. Please try again.', 'error');
      navigate('/auth/login');
      return;
    }

    // If we have a code, Supabase is handling the OAuth flow
    // The session will be created automatically by Supabase
    // We just need to wait a moment and check for the session
    if (code) {
      handleOAuthCallback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenHash, type, code, error, errorDescription]);

  const handleVerifyToken = async (tokenHash: string) => {
    setIsLoading(true);
    try {
      // Verify the magic link - this will automatically create a session
      await authService.verifyMagicLink(tokenHash);
      showToast('Successfully signed in!', 'success');
      
      // Get the current user to determine redirect
      const currentUser = await authService.getCurrentUser();
      if (currentUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      showToast(error.message || 'Invalid or expired magic link', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthCallback = async () => {
    setIsLoading(true);
    try {
      // Supabase with detectSessionInUrl: true will automatically process the OAuth callback
      // We need to wait a bit for it to complete, then check for the session
      // Poll for session up to 5 seconds
      let currentUser = null;
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        currentUser = await authService.getCurrentUser();
        if (currentUser) {
          break;
        }
      }
      
      if (currentUser) {
        showToast('Successfully signed in!', 'success');
        
        // Redirect based on user role
        if (currentUser.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        // If no user after OAuth, something went wrong
        showToast('Authentication failed. Please try again.', 'error');
        navigate('/auth/login');
      }
    } catch (error: any) {
      showToast(error.message || 'Authentication failed. Please try again.', 'error');
      navigate('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: MagicLinkFormData) => {
    setIsLoading(true);
    try {
      await authService.sendMagicLink(data.email);
      setIsSubmitted(true);
      showToast('Magic link sent to your email', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to send magic link. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="p-8 shadow-xl text-center">
        <div className="mb-6">
          <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-gold-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
          <p className="text-gray-600">
            We've sent a magic link to your email address. Click the link to sign in instantly.
          </p>
        </div>
        <Link to="/auth/login">
          <Button variant="ghost" className="w-full">
            Back to Sign In
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-8 shadow-xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Sign In with Magic Link</h1>
        <p className="text-gray-600">
          Enter your email and we'll send you a secure link to sign in without a password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail size={20} />}
          error={errors.email?.message}
          {...register('email')}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Send Magic Link
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/auth/login"
          className="text-sm text-gold-600 hover:text-gold-700 font-medium"
        >
          Back to Sign In
        </Link>
      </div>
    </Card>
  );
};

export default MagicLinkPage;


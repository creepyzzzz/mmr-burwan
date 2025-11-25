import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { authService } from '../../services/auth';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // Supabase sends token_hash and type as URL hash fragments or query params
  const tokenHash = searchParams.get('token_hash') || new URLSearchParams(window.location.hash.substring(1)).get('token_hash');
  const type = searchParams.get('type') || new URLSearchParams(window.location.hash.substring(1)).get('type');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    // If no token_hash or wrong type, redirect to forgot password
    if (!tokenHash || type !== 'recovery') {
      showToast('Invalid or missing reset token', 'error');
      navigate('/auth/forgot-password');
    }
  }, [tokenHash, type, navigate, showToast]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!tokenHash) return;

    setIsLoading(true);
    try {
      await authService.resetPassword(tokenHash, data.password);
      setIsSuccess(true);
      showToast('Password reset successfully!', 'success');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (error: any) {
      showToast(error.message || 'Failed to reset password. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="p-8 shadow-xl text-center">
        <div className="mb-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h1>
          <p className="text-gray-600">
            Your password has been successfully reset. Redirecting to login...
          </p>
        </div>
        <Link to="/auth/login">
          <Button variant="primary" className="w-full">
            Go to Sign In
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </Link>
      </Card>
    );
  }

  if (!tokenHash) {
    return null; // Will redirect in useEffect
  }

  return (
    <Card className="p-8 shadow-xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-gray-600">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          leftIcon={<Lock size={20} />}
          error={errors.password?.message}
          showPasswordToggle={true}
          {...register('password')}
          required
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Confirm new password"
          leftIcon={<Lock size={20} />}
          error={errors.confirmPassword?.message}
          showPasswordToggle={true}
          {...register('confirmPassword')}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Reset Password
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

export default ResetPasswordPage;


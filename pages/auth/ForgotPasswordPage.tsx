import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { authService } from '../../services/auth';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: React.FC = () => {
  const { showToast } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setIsSubmitted(true);
      showToast('Password reset link sent to your email', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to send reset link. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="p-8 shadow-xl text-center">
        <div className="mb-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
          <p className="text-gray-600">
            We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
          </p>
        </div>
        <Link to="/auth/login">
          <Button variant="primary" className="w-full">
            Back to Sign In
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-8 shadow-xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
        <p className="text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
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
          Send Reset Link
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

export default ForgotPasswordPage;


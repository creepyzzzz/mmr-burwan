import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PhoneInput from '../../components/ui/PhoneInput';
import Card from '../../components/ui/Card';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, signInWithGoogle } = useAuth();
  const { showToast } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const [registeredPassword, setRegisteredPassword] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phone: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    // CRITICAL: Show confirmation screen FIRST, before any async operations
    // This must happen synchronously to prevent component unmounting
    setRegisteredEmail(data.email);
    setRegisteredPassword(data.password);
    setShowConfirmation(true);
    
    // Now handle registration in the background
    // Don't set isLoading here - it causes AuthLayout to unmount this component
    registerUser(data.email, data.password, data.name, data.phone)
      .then(() => {
        // No toast needed - confirmation screen already shows the message
      })
      .catch((error: any) => {
        // If registration fails, go back to form
        setShowConfirmation(false);
        showToast(error.message || 'Registration failed. Please try again.', 'error');
      });
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Note: signInWithGoogle will redirect to Google, so we don't need to handle navigation here
    } catch (error: any) {
      showToast(error.message || 'Google sign-in failed. Please try again.', 'error');
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      {/* Confirmation Screen */}
      <div className={showConfirmation ? 'block' : 'hidden'}>
        <Card className="p-8 shadow-xl">
          <div className="mb-6">
            <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-gold-600" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2 text-center">Check Your Email</h1>
            <p className="text-gray-600 text-center mb-2">
              We've sent a confirmation email to <strong>{registeredEmail}</strong>
            </p>
            <p className="text-sm text-gray-500 text-center">
              Please click the confirmation link in the email to activate your account. Once confirmed, you can sign in.
            </p>
          </div>
          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                sessionStorage.setItem('pendingLoginEmail', registeredEmail);
                sessionStorage.setItem('pendingLoginPassword', registeredPassword);
                navigate('/auth/login');
              }}
            >
              Go to Sign In
              <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setShowConfirmation(false);
                setRegisteredEmail('');
              }}
            >
              Back to Registration
            </Button>
          </div>
        </Card>
      </div>

      {/* Registration Form */}
      <div className={showConfirmation ? 'hidden' : 'block'}>
        <Card className="p-8 shadow-xl">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Get started with your marriage registration</p>
          </div>

          <form id="register-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="on">
            <Input
              label="Full Name"
              type="text"
              placeholder="Ahmed Hassan"
              leftIcon={<User size={20} />}
              error={errors.name?.message}
              autoComplete="name"
              {...register('name')}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={20} />}
              error={errors.email?.message}
              {...register('email', {
                required: true,
              })}
              autoComplete="username"
              required
            />

            <PhoneInput
              label="Phone Number (Optional)"
              leftIcon={<Phone size={20} />}
              error={errors.phone?.message}
              autoComplete="tel"
              value={(watch('phone') || '').replace(/^\+91/, '').trim()}
              onChange={(value) => {
                setValue('phone', value ? `+91${value}` : '', { shouldValidate: false });
              }}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              leftIcon={<Lock size={20} />}
              error={errors.password?.message}
              showPasswordToggle={true}
              {...register('password', {
                required: true,
              })}
              autoComplete="new-password"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              leftIcon={<Lock size={20} />}
              error={errors.confirmPassword?.message}
              showPasswordToggle={true}
              {...register('confirmPassword', {
                required: true,
              })}
              autoComplete="new-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Create Account
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              isLoading={isGoogleLoading}
              onClick={handleGoogleSignIn}
              className="w-full mt-4 border-gray-300 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-gold-600 hover:text-gold-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default RegisterPage;


'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { registerSchema, type RegisterFormData } from '@/lib/validation/auth';
import { Input } from './input';
import { PasswordInput } from './password-input';
import { SubmitButton } from './submit-button';

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (_data: RegisterFormData) => {
    try {
      // TODO: Use authService.register when backend is ready
      // const response = await authService.register(data);
      // await login({ email: data.email, password: data.password });
      // router.push('/reports');
      setError('root', {
        type: 'manual',
        message: 'Authentication service not connected to backend yet',
      });
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        id="fullName"
        label="Full Name"
        placeholder="John Doe"
        error={errors.fullName?.message}
        required
        {...register('fullName')}
      />

      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        required
        {...register('email')}
      />

      <Input
        id="phone"
        label="Phone Number"
        type="tel"
        placeholder="+977 98XXXXXXXX"
        error={errors.phone?.message}
        required
        {...register('phone')}
      />

      <PasswordInput
        id="password"
        label="Password"
        placeholder="Create a password"
        error={errors.password?.message}
        required
        {...register('password')}
      />

      <PasswordInput
        id="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm your password"
        error={errors.confirmPassword?.message}
        required
        {...register('confirmPassword')}
      />

      {errors.root && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {errors.root.message}
        </div>
      )}

      <SubmitButton isLoading={isSubmitting} loadingText="Creating account...">
        Create Account
      </SubmitButton>

      <div className="text-center text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">
          Already have an account?{' '}
        </span>
        <Link
          href="/login"
          className="font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}

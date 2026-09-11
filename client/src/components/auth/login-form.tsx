'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { loginSchema, type LoginFormData } from '@/lib/validation/auth';
import { Input } from './input';
import { PasswordInput } from './password-input';
import { SubmitButton } from './submit-button';
import { useAuth } from '@/providers/auth-provider';

export function LoginForm() {
  const { login } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      // TODO: Redirect to appropriate page after successful login
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        required
        {...register('email')}
      />

      <PasswordInput
        id="password"
        label="Password"
        placeholder="Enter your password"
        error={errors.password?.message}
        required
        {...register('password')}
      />

      {errors.root && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {errors.root.message}
        </div>
      )}

      <SubmitButton isLoading={isSubmitting} loadingText="Signing in...">
        Sign In
      </SubmitButton>

      <div className="text-center text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">
          Don&apos;t have an account?{' '}
        </span>
        <Link
          href="/register"
          className="font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
        >
          Create account
        </Link>
      </div>
    </form>
  );
}

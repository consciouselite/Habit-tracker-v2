import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { TextField } from '../components/forms/TextField';
import { supabase } from '../lib/supabase';
import { SignUpInput, signUpSchema } from '../lib/validations/auth';
import { useState } from 'react';

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema)
  });

  const onSubmit = async (data: SignUpInput) => {
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signUpError) throw signUpError;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: (await supabase.auth.getUser()).data.user?.id,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
        });

      if (profileError) throw profileError;

      navigate('/onboarding');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <AuthLayout 
      title="Create your account" 
      subtitle="Start your journey to better habits"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        <div className="space-y-4">
          <TextField
            label="First Name"
            {...register('firstName')}
            error={errors.firstName?.message}
          />
          <TextField
            label="Last Name"
            {...register('lastName')}
            error={errors.lastName?.message}
          />
          <TextField
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </button>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Log in
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}

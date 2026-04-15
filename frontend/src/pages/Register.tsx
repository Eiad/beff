import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Leaf } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import axios from 'axios';

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      const res = await api.post<{ token: string; user: { id: string; name: string; email: string; createdAt: string } }>(
        '/auth/register',
        { name: data.name, email: data.email, password: data.password },
      );
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          setServerError('An account with this email already exists.');
        } else {
          setServerError('Something went wrong. Please try again.');
        }
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-serif text-2xl text-gray-900">
            <Leaf className="text-primary-brand" size={24} />
            B-eff
          </Link>
        </div>

        <Card>
          <CardHeader>
            <h1 className="text-xl font-medium leading-snug">Create your account</h1>
            <CardDescription>Join the waitlist and get early access.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
              {/* Server error */}
              {serverError && (
                <div role="alert" aria-live="polite" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {serverError}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" type="text" autoComplete="name" {...register('name')} />
                {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" autoComplete="email" {...register('email')} />
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
                <p className="text-xs text-gray-400">Minimum 8 characters</p>
                {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input id="confirmPassword" type="password" autoComplete="new-password" {...register('confirmPassword')} />
                {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-brand hover:bg-primary-brand-dark text-white mt-2"
              >
                {isSubmitting ? 'Creating account…' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-brand underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

'use client';

import React, { startTransition, useActionState, useEffect } from 'react';
import Input from './ui/input';
import Button from './ui/button';
import { LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginUser } from '@/actions/auth';

import { handleActionAlert } from '@/lib/handleAlart';
import { useRouter } from 'next/navigation';
import loginSchema from '@/zod/loginSchema';

const LoginForm = () => {
  const route = useRouter();
  const [state, formAction, pending] = useActionState(loginUser, null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = data => {
    const formData = new FormData();

    formData.append('email', data.email);
    formData.append('password', data.password);

    startTransition(() => {
      formAction(formData);
    });
  };
  useEffect(() => {
    if (!state) return;
    handleActionAlert(state.success, state.message);
    if (state.success) {
      reset();
      route.refresh();
      route.push('/dashboard');
    }
  }, [reset, route, state]);

  return (
    <>
      <form
        action=""
        className="w-full space-y-3 mt-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label={'Email'}
          placeholder="Enter your email"
          error={errors?.email}
          {...register('email')}
        />
        <Input
          label={'Password'}
          type="password"
          placeholder="Enter your password"
          error={errors?.password}
          {...register('password')}
        />
        <Button
          disabled={pending}
          loading={pending}
          className={'w-full mt-5'}
          size={'lg'}
        >
          <LogIn size={16} />
          LOGin
        </Button>
        <p>
          “Don’t have an account?{' '}
          <a href="/register" className="text-neo-blue">
            Sign up free
          </a>
        </p>
      </form>
    </>
  );
};

export default LoginForm;

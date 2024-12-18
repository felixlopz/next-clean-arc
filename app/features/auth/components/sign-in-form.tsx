'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';

import { userSchema } from '@/src/entities/models/user';
import { loginAction } from '@/app/features/auth/actions';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
const formSchema = userSchema.pick({ email: true, password: true });

export default function SignInForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;

    setIsLoading(true);
    const res = await loginAction(email, password);

    if (res.error) {
      setErrorMessage(res.error);
    }

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-12 rounded-md border border-input p-8"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl">Sign In</h3>
          <span className="text-[0.8rem]">
            Not Registred?{' '}
            <Link href="/sign-up" className="underline">
              Sign Up
            </Link>
          </span>
        </div>
<div className="flex flex-col space-y-4">
<FormField
control={form.control}
name="email"
render={({ field }) => (
<FormItem>
<FormLabel>Email</FormLabel>
<FormControl>
<Input
  className={cn([
    form.formState.errors.email ? 'border-destructive' : '',
  ])}
  type="email"
  placeholder="johndoe@email.com"
  {...field}
/>
</FormControl>
<FormMessage />
</FormItem>
)}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className={cn([
                      form.formState.errors.password
                        ? 'border-destructive'
                        : '',
                    ])}
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <span className="text-[0.8rem] font-medium text-destructive">
            {errorMessage}
          </span>

          <Button
            variant="secondary"
            type="submit"
            className="mt-4 self-center"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

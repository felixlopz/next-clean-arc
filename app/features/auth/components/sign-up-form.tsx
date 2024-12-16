'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { createUserSchema } from '@/src/entities/models/user';
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
import { signUp } from '@/app/features/auth/actions';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';
import { useState } from 'react';

import { Loader2 } from 'lucide-react';

const formSchema = createUserSchema.omit({ id: true });

export default function SignUpForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, email, password } = values;
    setIsLoading(true);
    const res = await signUp(name, email, password);

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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl">Sign Up</h3>
          <span className="text-[0.8rem]">
            Already Registred?{' '}
            <Link href="/sign-in" className="underline">
              Sign In
            </Link>
          </span>
        </div>
        <div className="space-y-4 flex flex-col">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    className={cn([
                      form.formState.errors.name ? 'border-destructive' : '',
                    ])}
                    type="name"
                    placeholder="John Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

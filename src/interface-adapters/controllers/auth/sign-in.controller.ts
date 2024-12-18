import { z } from 'zod';

import { ISignInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';
import { InputParseError } from '@/src/entities/errors/common';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

const inputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(31),
});

export type ISignInController = ReturnType<typeof signInController>;

export const signInController =
  (
    instrumentationService: IInstrumentationService,
    signInUseCase: ISignInUseCase
  ) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>
  ): Promise<ReturnType<typeof signInUseCase>> => {
    return await instrumentationService.startSpan(
      { name: 'signIn Controller' },
      async () => {
        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
          throw new InputParseError('Invalid data', { cause: inputParseError });
        }

        return await signInUseCase(data);
      }
    );
  };

import { z } from 'zod';

import { InputParseError } from '@/src/entities/errors/common';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { ISignUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

const inputSchema = z.object({
  name: z.string().min(3).max(31),
  email: z.string().min(3).max(31).email(),
  password: z.string().min(6).max(31),
  // confirm_password: z.string().min(6).max(31),
});
// .superRefine(({ password, confirm_password }, ctx) => {
//   if (confirm_password !== password) {
//     ctx.addIssue({
//       code: 'custom',
//       message: 'The passwords did not match',
//       path: ['password'],
//     });
//     ctx.addIssue({
//       code: 'custom',
//       message: 'The passwords did not match',
//       path: ['confirmPassword'],
//     });
//   }
// });

export type ISignUpController = ReturnType<typeof signUpController>;

export const signUpController =
  (
    instrumentationService: IInstrumentationService,
    signUpUseCase: ISignUpUseCase,
    authenticationService: IAuthenticationService
  ) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>
  ): Promise<ReturnType<typeof signUpUseCase>> => {
    return await instrumentationService.startSpan(
      { name: 'signUp Controller' },
      async () => {
        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
          throw new InputParseError('Invalid data', { cause: inputParseError });
        }

        const { cookie, session, user } = await signUpUseCase(data);

        await authenticationService.createAndSendVerificationEmailRequest(
          user.id,
          data.email
        );

        return { cookie, session, user };
      }
    );
  };

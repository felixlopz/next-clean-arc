import { z } from 'zod';

import { InputParseError } from '@/src/entities/errors/common';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { ISignUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';
import { IVerifyEmailRequestRepository } from '@/src/application/repositories/verify-email-request.repository.interface';
import { IEmailService } from '@/src/application/services/email.service.interface';

const inputSchema = z.object({
  name: z.string().min(3).max(31),
  email: z.string().min(3).max(31),
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
    verifyEmailRequestRepository: IVerifyEmailRequestRepository,
    emailService: IEmailService
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

        await instrumentationService.startSpan(
          {
            name: 'SignUp Controller SideEffect > createEmailVerificationRequest',
          },
          async () => {
            const { code } =
              await verifyEmailRequestRepository.createEmailVerificationRequest(
                user.id,
                data.email
              );

            await emailService.sendVerificationEmail(data.email, code);
          }
        );

        return { cookie, session, user };
      }
    );
  };

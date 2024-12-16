import { db } from '@/drizzle';
import { emailVerificationRequests } from '@/drizzle/schema';
import { IVerifyEmailRequestRepository } from '@/src/application/repositories/verify-email-request.repository.interface';
import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { DatabaseOperationError } from '@/src/entities/errors/common';
import { EmailVerificationRequest } from '@/src/entities/models/email-verification-request';
import { User } from '@/src/entities/models/user';
import { generateRandomOTP } from '@/src/utils';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';

export class VerifyEmailRequestRepository
  implements IVerifyEmailRequestRepository
{
  constructor(
    private readonly instrumentationService: IInstrumentationService,
    private readonly crashReporterService: ICrashReporterService
  ) {}

  async createEmailVerificationRequest(
    userId: User['id'],
    email: string
  ): Promise<EmailVerificationRequest> {
    return await this.instrumentationService.startSpan(
      { name: 'VerifyEmailRequestRepository > createEmailVerificationRequest' },
      async () => {
        try {
          const id = createId();
          const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
          const code = this.instrumentationService.startSpan(
            { name: 'generate random otp', op: 'function' },
            () => generateRandomOTP()
          );

          const query = db
            .insert(emailVerificationRequests)
            .values({
              id,
              email,
              code,
              userId,
              expiresAt: Math.floor(expiresAt.getTime() / 1000),
            })
            .returning();

          const [createdRequest] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'pg' },
            },
            () => query.execute()
          );
          if (createdRequest) {
            return { ...createdRequest, expiresAt };
          } else {
            throw new DatabaseOperationError(
              'Cannot create email verification request.'
            );
          }
        } catch (error) {
          this.crashReporterService.report(error);
          throw error; // TODO: convert to Entities error
        }
      }
    );
  }

  async getUserEmailVerificationRequest(
    userId: User['id']
  ): Promise<EmailVerificationRequest | undefined> {
    return await this.instrumentationService.startSpan(
      {
        name: 'VerifyEmailRequestRepository > getUserEmailVerificationRequest',
      },
      async () => {
        try {
          const query = db.query.emailVerificationRequests.findFirst({
            where: eq(emailVerificationRequests.userId, userId),
          });

          const request = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'pg' },
            },
            () => query.execute()
          );

          if (request == null) {
            return undefined;
          }

          return { ...request, expiresAt: new Date(request.expiresAt * 1000) };
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }

  async deleteUserEmailVerificationRequest(userId: User['id']): Promise<void> {
    return await this.instrumentationService.startSpan(
      {
        name: 'VerifyEmailRequestRepository > deleteUserEmailVerificationRequest',
      },
      async () => {
        try {
          await db
            .delete(emailVerificationRequests)
            .where(eq(emailVerificationRequests.userId, userId));
        } catch (error) {
          this.crashReporterService.report(error);
          throw error; // TODO: convert to Entities error
        }
      }
    );
  }
}

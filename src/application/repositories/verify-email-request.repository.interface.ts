import { EmailVerificationRequest } from '@/src/entities/models/email-verification-request';
import { User } from '@/src/entities/models/user';

export interface IVerifyEmailRequestRepository {
  createEmailVerificationRequest(
    userId: User['id'],
    email: string
  ): Promise<EmailVerificationRequest>;
  deleteUserEmailVerificationRequest(userId: User['id']): Promise<void>;
  getUserEmailVerificationRequest(
    userId: User['id']
  ): Promise<EmailVerificationRequest | undefined>;
}

import { IVerifyEmailRequestRepository } from '@/src/application/repositories/verify-email-request.repository.interface';
import { EmailVerificationRequest } from '@/src/entities/models/email-verification-request';
import { User } from '@/src/entities/models/user';

export class MockVerifyEmailRequestRepository
  implements IVerifyEmailRequestRepository
{
  private _verifyEmailRequests: EmailVerificationRequest[];

  constructor() {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
    const expiredAt = new Date(Date.now() - 1000 * 60 * 20);

    this._verifyEmailRequests = [
      // Valid Code
      {
        code: '443901AA',
        email: 'one@mail.com',
        expiresAt,
        id: 'request-1',
        userId: '1',
      },
      // Expired Code
      {
        code: '443902AA',
        email: 'two@mail.com',
        expiresAt: expiredAt,
        id: 'request-2',
        userId: '2',
      },
    ];
  }

  async createEmailVerificationRequest(
    userId: User['id'],
    email: string
  ): Promise<EmailVerificationRequest> {
    this.deleteUserEmailVerificationRequest(userId);

    const newUser: EmailVerificationRequest = {
      code: '443903AB',
      email,
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
      id: 'request-new',
      userId: 'new',
    };

    return newUser;
  }

  async getUserEmailVerificationRequest(
    userId: User['id']
  ): Promise<EmailVerificationRequest | undefined> {
    return this._verifyEmailRequests.find((r) => r.userId === userId);
  }

  async deleteUserEmailVerificationRequest(userId: User['id']): Promise<void> {
    this._verifyEmailRequests.filter((r) => r.userId === userId);
  }
}

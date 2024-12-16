import { IEmailService } from '@/src/application/services/email.service.interface';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

export class MockEmailService implements IEmailService {
  constructor(
    private readonly _instrumentationService: IInstrumentationService
  ) {}

  async sendVerificationEmail(email: string, code: string): Promise<void> {
    console.log(`To ${email}: Your verification code is ${code}`);
  }
}

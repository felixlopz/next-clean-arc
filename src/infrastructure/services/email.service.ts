import { IEmailService } from '@/src/application/services/email.service.interface';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

export class EmailService implements IEmailService {
  constructor(
    private readonly _instrumentationService: IInstrumentationService
  ) {}

  async sendVerificationEmail(email: string, code: string): Promise<void> {
    console.log(`your for verify email: ${email} is ${code}`);
  }
}

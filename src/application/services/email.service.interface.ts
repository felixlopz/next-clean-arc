export interface IEmailService {
  sendVerificationEmail(email: string, code: string): Promise<void>;
}

export class VerificationCodeExpired extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class VerificationCodeInvalid extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

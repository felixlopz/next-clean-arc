import { ICommonService } from '@/src/application/services/common.service.interface';
import { encodeBase32UpperCaseNoPadding } from '@oslojs/encoding';

export class CommonService implements ICommonService {
  generateRandomOTP(): string {
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);
    const code = encodeBase32UpperCaseNoPadding(bytes);
    return code;
  }

  generateRandomRecoveryCode(): string {
    const recoveryCodeBytes = new Uint8Array(10);
    crypto.getRandomValues(recoveryCodeBytes);
    const recoveryCode = encodeBase32UpperCaseNoPadding(recoveryCodeBytes);
    return recoveryCode;
  }
}
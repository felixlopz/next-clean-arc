import * as Sentry from '@sentry/nextjs';

import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';

export class CrashReporterService implements ICrashReporterService {
  report(error: unknown): string {
    return Sentry.captureException(error);
  }
}

import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';

export class MockCrashReporterService implements ICrashReporterService {
  report(_: unknown): string {
    return 'errorId';
  }
}

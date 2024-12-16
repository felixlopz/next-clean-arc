import { ISessionsRepository } from '@/src/application/repositories/session.repository.interface';
import {
  SessionFlags,
  Session,
  SessionValidationResult,
} from '@/src/entities/models/session';

export class MockSessionsRepository implements ISessionsRepository {
  async createSession(
    token: string,
    userId: string,
    flags: SessionFlags
  ): Promise<Session> {
    return { expiresAt: new Date(), id: '', userId: '1' };
  }

  async generateSessionToken(): Promise<string> {
    return '';
  }

  async invalidateSession(sessionId: string): Promise<void> {}

  async getCurrentSession(
    sessionToken: string | undefined
  ): Promise<SessionValidationResult> {
    return { session: null, user: null };
  }

  async getCurrentSessionByUserId(
    userId: string
  ): Promise<SessionValidationResult> {
    return { session: null, user: null };
  }

  async validateSessionToken(token: string): Promise<SessionValidationResult> {
    return { session: null, user: null };
  }

  async invalidateUserSession(userId: string): Promise<void> {}
}

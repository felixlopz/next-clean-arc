import { ISessionsRepository } from '@/src/application/repositories/session.repository.interface';
import {
  Session,
  SessionValidationResult,
} from '@/src/entities/models/session';

export class MockSessionsRepository implements ISessionsRepository {
  async createSession(): // token: string,
  // userId: string,
  // flags: SessionFlags
  Promise<Session> {
    return { expiresAt: new Date(), id: 'random_session_id', userId: '1' };
  }

  async generateSessionToken(): Promise<string> {
    return '';
  }

  async invalidateSession(): Promise<void> {}

  async getCurrentSession(): Promise<SessionValidationResult> {
    return { session: null, user: null };
  }

  async getCurrentSessionByUserId(): Promise<SessionValidationResult> {
    return { session: null, user: null };
  }

  async validateSessionToken(): Promise<SessionValidationResult> {
    return { session: null, user: null };
  }

  async invalidateUserSession(): Promise<void> {}
}

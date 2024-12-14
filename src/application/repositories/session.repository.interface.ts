import {
  Session,
  SessionFlags,
  SessionValidationResult,
} from '@/src/entities/models/session';

export interface ISessionsRepository {
  generateSessionToken(): Promise<string>;
  createSession(
    token: string,
    userId: string,
    flags: SessionFlags
  ): Promise<Session>;
  validateSessionToken(token: string): Promise<SessionValidationResult>;
  getCurrentSession(
    sessionToken: string | null
  ): Promise<SessionValidationResult>;
  invalidateUserSession(userId: string): Promise<void>;
}

import {
  Session,
  SessionFlags,
  SessionValidationResult,
} from '@/src/entities/models/session';

export interface ISessionRepository {
  generateSessionToken(): Promise<string>;
  createSession(
    token: string,
    userId: string,
    flags: SessionFlags
  ): Promise<Session>;
  validateSessionToken(token: string): Promise<SessionValidationResult>;
  // getCurrentSession(): Promise<SessionValidationResult>;
  // invalidateUserSession(userId: string): Promise<void>;
}

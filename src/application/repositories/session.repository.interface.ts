import {
  Session,
  SessionFlags,
  SessionValidationResult,
} from '@/src/entities/models/session';
import { User } from '@/src/entities/models/user';

export interface ISessionsRepository {
  createSession(
    token: string,
    userId: string,
    flags: SessionFlags
  ): Promise<Session>;
  validateSessionToken(token: string): Promise<SessionValidationResult>;
  invalidateUserSession(userId: string): Promise<void>;
  invalidateSession(sessionId: string): Promise<void>;
  generateSessionToken(): Promise<string>;
  getCurrentSession(
    sessionToken: string | undefined
  ): Promise<SessionValidationResult>;
}

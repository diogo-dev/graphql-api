import type { Request as ExpressRequest } from "express";
import type { Request } from "graphql-http";
import type { RequestContext } from "graphql-http/lib/use/express";
import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth";
import { UserRole } from "../entities/User";

export type AuthUser = { id: string; role: UserRole };

export type GraphQLContext = { user: AuthUser | null };

type AccessTokenPayload = { sub: string; role: UserRole };

export function verifyAccessToken(token: string): AuthUser | null {
  try {
    const payload = jwt.verify(token, authConfig.accessTokenSecret) as AccessTokenPayload;
    return { id: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

export function buildContext(req: Request<ExpressRequest, RequestContext>): GraphQLContext {
  const header = req.raw.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return { user: null };
  }
  return { user: verifyAccessToken(header.slice("Bearer ".length)) };
}

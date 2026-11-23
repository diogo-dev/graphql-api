import { UserRole } from "../entities/User";
import type { AuthUser, GraphQLContext } from "./context";
import { ForbiddenError, UnauthenticatedError } from "./errors";

export function requireAuth(ctx: GraphQLContext): AuthUser {
  if (!ctx.user) {
    throw new UnauthenticatedError();
  }
  return ctx.user;
}

export function requireRole(ctx: GraphQLContext, role: UserRole): AuthUser {
  const user = requireAuth(ctx);
  if (user.role !== role) {
    throw new ForbiddenError();
  }
  return user;
}

export function isOwnerOrAdmin(user: AuthUser | null, ownerId: string | undefined): boolean {
  return !!user && (user.role === UserRole.ADMIN || user.id === ownerId);
}

export function requireOwnerOrAdmin(ctx: GraphQLContext, ownerId: string | undefined): AuthUser {
  const user = requireAuth(ctx);
  if (!isOwnerOrAdmin(user, ownerId)) {
    throw new ForbiddenError();
  }
  return user;
}

import { GraphQLError } from "graphql";

export class UnauthenticatedError extends GraphQLError {
  constructor(message = "You must be logged in") {
    super(message, { extensions: { code: "UNAUTHENTICATED" } });
  }
}

export class ForbiddenError extends GraphQLError {
  constructor(message = "You are not allowed to perform this action") {
    super(message, { extensions: { code: "FORBIDDEN" } });
  }
}

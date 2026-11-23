import { UserType } from "../types/UserType";
import { getUserService } from "../services";
import type { GraphQLContext } from "../context";

export const authQueries = {
  me: {
    type: UserType,
    resolve(_: unknown, _args: unknown, ctx: GraphQLContext) {
      return ctx.user ? getUserService().getUserById(ctx.user.id) : null;
    }
  },
};

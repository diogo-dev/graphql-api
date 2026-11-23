import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UserType } from "./UserType";

export const AuthPayloadType = new GraphQLObjectType({
  name: "AuthPayload",
  fields: () => ({
    accessToken: { type: new GraphQLNonNull(GraphQLString) },
    refreshToken: { type: new GraphQLNonNull(GraphQLString) },
    user: { type: new GraphQLNonNull(UserType) },
  }),
});

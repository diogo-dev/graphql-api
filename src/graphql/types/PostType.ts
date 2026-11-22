import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Post } from "../../entities/Post";
import { CommentType } from "./CommentType";
import { UserType } from "./UserType";
import { isoDateField } from "./scalars";
import { getCommentService, getPostService } from "../services";

export const PostType: GraphQLObjectType = new GraphQLObjectType<Post>({
  name: "Post",
  description: "A blog post created by a user",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: isoDateField<Post>("createdAt"),
    updatedAt: isoDateField<Post>("updatedAt"),

    author: {
      type: UserType,
      resolve(parent) {
        // Use the relation when it was loaded in full; otherwise fetch it.
        if (parent.user?.email) return parent.user;
        return getPostService().getPostAuthor(parent.id);
      }
    },

    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent) {
        return getCommentService().getCommentsByPostId(parent.id);
      }
    }
  }),
});

import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Comment } from "../../entities/Comment";
import { PostType } from "./PostType";
import { UserType } from "./UserType";
import { isoDateField } from "./scalars";
import { getCommentService } from "../services";

export const CommentType: GraphQLObjectType = new GraphQLObjectType<Comment>({
  name: "Comment",
  description: "A comment made by a user in a post",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: isoDateField<Comment>("createdAt"),

    author: {
      type: UserType,
      resolve(parent) {
        if (parent.user?.email) return parent.user;
        return getCommentService().getCommentAuthor(parent.id);
      }
    },

    post: {
      type: PostType,
      resolve(parent) {
        if (parent.post?.title) return parent.post;
        return getCommentService().getCommentPost(parent.id);
      }
    }
  })
});

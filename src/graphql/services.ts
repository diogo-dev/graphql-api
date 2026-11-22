import dataSource from "../config/data-source";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";
import { UserService } from "../services/UserService";
import { PostService } from "../services/PostService";
import { CommentService } from "../services/CommentService";

// Lazily created so repositories are only requested after the DataSource is initialized.
let userService: UserService | null = null;
let postService: PostService | null = null;
let commentService: CommentService | null = null;

export const getUserService = (): UserService =>
  (userService ??= new UserService(dataSource.getRepository(User)));

export const getPostService = (): PostService =>
  (postService ??= new PostService(dataSource.getRepository(Post)));

export const getCommentService = (): CommentService =>
  (commentService ??= new CommentService(dataSource.getRepository(Comment)));

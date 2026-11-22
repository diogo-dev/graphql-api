import { Repository } from "typeorm";
import { Comment } from "../entities/Comment";
import { CreateCommentDTO } from "../dto/CreateCommentDTO";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { validateDto } from "../utils/validate";

export class CommentService {
  constructor(
    private commentRepository: Repository<Comment>
  ) {}

  async createComment(commentData: CreateCommentDTO): Promise<Comment> {
    await validateDto(CreateCommentDTO, commentData);

    const comment = this.commentRepository.create({
      content: commentData.content,
      post: { id: commentData.postId } as Post,
      user: { id: commentData.userId } as User,
    });

    try {
      return await this.commentRepository.save(comment);
    } catch (error: any) {
      if (error.code === '23503') {
        throw new Error("Post or user not found");
      }
      throw error;
    }
  }

  async getAllComments(): Promise<Comment[]> {
    return await this.commentRepository.find();
  }

  async getCommentById(id: string): Promise<Comment | null> {
    return await this.commentRepository.findOne({ where: { id } });
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.post_id = :postId', { postId })
      .getMany();
  }

  async getCommentAuthor(commentId: string): Promise<User | null> {
    const comment = await this.commentRepository.findOne({ where: { id: commentId }, relations: ['user'] });
    return comment?.user ?? null;
  }

  async getCommentPost(commentId: string): Promise<Post | null> {
    const comment = await this.commentRepository.findOne({ where: { id: commentId }, relations: ['post'] });
    return comment?.post ?? null;
  }

  async updateComment(id: string, updateData: Partial<Pick<Comment, 'content'>>): Promise<Comment | null> {
    await validateDto(CreateCommentDTO, updateData, { partial: true });

    const comment = await this.commentRepository.findOneBy({ id });
    if (!comment) {
      return null;
    }

    return await this.commentRepository.save({ ...comment, ...updateData });
  }

  async deleteComment(id: string): Promise<Comment | null> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      return null;
    }

    return await this.commentRepository.remove(comment);
  }
}
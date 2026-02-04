import { Repository } from "typeorm";
import { Comment } from "../entities/Comment";
import { CreateCommentDTO } from "../dto/CreateCommentDTO";
import { Post } from "../entities/Post";

export class CommentService {
  constructor(
    private commentRepository: Repository<Comment>
  ) {}

  async createComment(commentData: CreateCommentDTO): Promise<Comment | null> {
    const comment = this.commentRepository.create({
      content: commentData.content,
      post: { id: commentData.postId } as Post
    });

    try {
      return await this.commentRepository.save(comment);
    } catch (error: any) {
      if (error.code === '23503') {
        throw new Error("Post not found");
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

  async updateComment(id: string, updateData: Partial<Comment>): Promise<Comment | null> {
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
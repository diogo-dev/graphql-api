import { Repository } from "typeorm";
import { Post } from "../entities/Post";
import { CreatePostDTO } from "../dto/CreatePostDTO";
import { User } from "../entities/User";
import { validateDto } from "../utils/validate";

export class PostService {
  constructor(
    private postRepository: Repository<Post>
  ) {}

  async createPost(postData: CreatePostDTO): Promise<Post> {
    await validateDto(CreatePostDTO, postData);

    const post = this.postRepository.create({
      title: postData.title,
      content: postData.content,
      user: { id: postData.userId } as User 
    });

    try {
      return await this.postRepository.save(post);
    } catch (error: any) {
      if (error.code === '23503') {
        throw new Error("User not found");
      }
      throw error;
    }
  }

  async getPostById(id: string): Promise<Post | null> {
    return await this.postRepository.findOne({ where: { id }, relations: ['comments'] });
  }

  async getAllPosts(): Promise<Post[]> {
    return await this.postRepository.find({ relations: ['comments'] });
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    return await this.postRepository
      .createQueryBuilder('post')
      .where('post.user_id = :userId', { userId })
      .getMany();
  }

  async getPostAuthor(postId: string): Promise<User | null> {
    const post = await this.postRepository.findOne({ where: { id: postId }, relations: ['user'] });
    return post?.user ?? null;
  }

  async updatePost(id: string, updateData: Partial<Pick<Post, 'title' | 'content'>>): Promise<Post | null> {
    await validateDto(CreatePostDTO, updateData, { partial: true });

    const post = await this.getPostById(id);
    if (!post) {
      return null;
    }

    return await this.postRepository.save({ ...post, ...updateData });
  }

  async deletePost(id: string): Promise<Post | null> {
    const post = await this.getPostById(id);
    if (!post) {
      return null;
    }

    return await this.postRepository.remove(post);
  }

}
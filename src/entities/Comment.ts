import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post";

@Entity()
export class Comment {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text'})
  content: string;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Post, post => post.comments, { nullable: true })
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
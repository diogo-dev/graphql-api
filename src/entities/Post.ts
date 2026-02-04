import { Entity, ManyToOne, Column, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany, JoinColumn } from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity()
export class Post {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar', length: 255})
  title: string;

  @Column({type: 'text'})
  content: string;

  @Column({name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.posts, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];
}
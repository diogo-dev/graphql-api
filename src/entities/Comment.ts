import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Comment {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text'})
  content: string;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, user => user.comments)
  user: User;
}
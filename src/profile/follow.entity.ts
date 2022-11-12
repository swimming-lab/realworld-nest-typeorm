import { User } from "../user/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity('follows')
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  followId: number;

  @ManyToOne(() => User, (user) => user.follows)
  @JoinColumn({ name: 'userId' })
  public user!: User

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
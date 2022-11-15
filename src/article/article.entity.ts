import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../user/user.entity";
import slug = require("slug");
import { Tag } from "./tag.entity";

@Entity('articles')
export class Article {
	@PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

	@Column()
  title: string;

	@Column()
  description: string;

	@Column()
  body: string;

	@ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User

	@ManyToMany(() => Tag)
  @JoinTable({ name: 'article_tag' })
  tags!: Tag[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

	@BeforeInsert()
  hashPassword() {
    this.slug = slug(this.title) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
  }

	async toJSONFor(user: User) {
		return {
      slug: this.slug,
      title: this.title,
      description: this.description,
      body: this.body,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      // tagList: tags.map(tag => tag.name),
      // favorited,
      // favoritesCount,
      // author,
    };
	}
}

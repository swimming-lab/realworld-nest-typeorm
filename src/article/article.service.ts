import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { In, Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Tag } from './tag.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

  async create(auth: User, createArticleDto: CreateArticleDto) {
    const article = new Article();
    article.title = createArticleDto.title;
    article.description = createArticleDto.description;
    article.body = createArticleDto.body;
    article.user = auth;

    const tags = await this.setArticleTags(createArticleDto);
    article.tags = tags;

    const savedArticle = await this.articleRepository.save(article);
    return { article: await savedArticle.toJSONFor(auth) };
  }

  findAll() {
    return `This action returns all article`;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }

  async setArticleTags(createArticleDto: CreateArticleDto): Promise<Tag[]> {
    let tagList: Array<string>;
    const findTags = await this.tagRepository.findBy({ name: In(createArticleDto.tagList) });
    if (!findTags) {
      tagList = findTags.map(tag => tag.name);
    } else {
      const tagNames = findTags.map(tag => tag.name);
      tagList = createArticleDto.tagList.filter(name => !tagNames.includes(name));
    }
    await this.tagRepository.save(tagList.map((tag) => { return new Tag(tag) }));

    // repository.upsert 왜 안되는지 못찾음...
    // const result = await this.tagRepository.upsert(
    //   createArticleDto.tagList.map((tag) => { return new Tag(tag) }),
    //   ["name"]
    // );
    return await this.tagRepository.findBy({ name: In(createArticleDto.tagList) });
  }
}

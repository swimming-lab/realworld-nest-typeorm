import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { User } from '../user/user.entity';
import { AuthMiddleware } from '../user/auth.middleware';
import { Tag } from './tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Tag])],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticleModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'articles', method: RequestMethod.POST },
        { path: 'articles/:article', method: RequestMethod.ALL }
      );
  }
}
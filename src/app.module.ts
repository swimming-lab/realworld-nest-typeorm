import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'my-secret-pw',
      database: 'nestjs_realworld',
      entities: [__dirname + '/**/**.entity{.ts,.js}'],
      synchronize: true,
      logging: ['query']
    }),
    UserModule,
    ProfileModule,
    ArticleModule,
  ],
})
export class AppModule {}

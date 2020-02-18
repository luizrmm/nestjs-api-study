import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaModule } from './idea/idea.module';
import { HttpErrorFilter } from './shared/http-error.filter';
import { UserModule } from './user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(), IdeaModule, UserModule],
  controllers: [],
  providers: [{
    provide: APP_FILTER,
    useClass: HttpErrorFilter
  }],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';


@Module({
  imports: [AppModule, UserModule, BookmarkModule],
  
})
export class AppModule {}

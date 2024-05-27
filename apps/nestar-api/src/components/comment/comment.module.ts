import { Module } from '@nestjs/common';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import CommentSchema from '../../schemas/Comment.model';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Comment", schema: CommentSchema }]),
    AuthModule,
    ViewModule
  ],
  providers: [CommentResolver, CommentService],
  exports: [CommentService]
})
export class CommentModule { }

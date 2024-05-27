import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CommentService } from './comment.service';
import { CommentInput, CommentsInquiry } from '../../libs/dto/comment/comment.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Comment, Comments } from '../../libs/dto/comment/comment';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { WithoutGuard } from '../auth/guards/without.guard';

@Resolver()
export class CommentResolver {
    constructor(private readonly commentService: CommentService) { }

    @UseGuards(AuthGuard)
    @Mutation((returns) => Comment)
    public async createComment(
        @Args("input") input: CommentInput,
        @AuthMember("_id") membeId: ObjectId
    ): Promise<Comment> {
        console.log("Mutation: createComment")
        input.commentRefId = shapeIntoMongoObjectId(input.commentRefId)
        return await this.commentService.createComment(membeId, input)
    }

    @UseGuards(AuthGuard)
    @Mutation((returns) => Comment)
    public async updateComment(
        @Args("input") input: CommentUpdate,
        @AuthMember("_id") memberId: ObjectId
    ): Promise<Comment> {
        console.log("Mutation: updateComment");
        return await this.commentService.updateComment(memberId, input)
    }

    @UseGuards(WithoutGuard)
    @Query((returns) => Comments)
    public async getComments(
        @Args("input") input: CommentsInquiry,
        @AuthMember("_id") memberId: ObjectId
    ): Promise<Comments> {
        console.log("Query: getComments")
        input.search.commentRefId = shapeIntoMongoObjectId(input.search.commentRefId)
        return await this.commentService.getComments(memberId, input)
    }
}

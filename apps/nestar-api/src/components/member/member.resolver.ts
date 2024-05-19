import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class MemberResolver {
    constructor(private readonly memberService: MemberService) { };

    @Mutation(() => Member)
    public async signup(@Args("input") input: MemberInput): Promise<Member> {
        console.log("Mutation: signup");
        return this.memberService.signup(input);
    }

    @Mutation(() => Member)
    public async login(@Args("input") input: LoginInput): Promise<Member> {
        console.log("Mutation: login");
        return this.memberService.login(input)
    }

    @Query(() => Member)
    public async getMember(@Args("memberId") memberId:string): Promise<Member> {
        console.log("Query: getMember")
        const  targetId = shapeIntoMongoObjectId(memberId)
        return this.memberService.getMember(targetId)
    }

    //Authenticated
    @UseGuards(AuthGuard)
    @Mutation(() => Member)
    public async updateMember(
        @Args("input") input: MemberUpdate,
        @AuthMember("_id") memberId: ObjectId
    ): Promise<Member> {
        console.log("Mutation: updateMember")
        delete input._id
        return await this.memberService.updateMember(memberId, input)
    }

    @UseGuards(AuthGuard)
    @Query(() => String)
    public async checkAuth(@AuthMember("memberNick") memberNick: string): Promise<string> {
        console.log("Query: checkAuth")
        console.log("MemberNick:", memberNick)
        return `Hi ${memberNick}`
    }

    @Roles(MemberType.USER, MemberType.AGENT)
    @UseGuards(RolesGuard)
    @Query(() => String)
    public async checkAuthRoles(@AuthMember() authMember: Member): Promise<string> {
        console.log("Query: checkAuthRoles");
        return `Hi ${authMember.memberNick}, you are ${authMember.memberType} (memberId: ${authMember._id})`
    }

    /* ADMIN */

    //Authorization Admin
    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => String)
    public async getAllMembersByAdmin(@AuthMember() authMember: Member): Promise<string> {
        console.log("AuthMember Type=>", authMember.memberType)
        return this.memberService.getAllMembersByAdmin()
    }

    //Authorization Admin
    @Mutation(() => String)
    public async updateMemberByAdmin(): Promise<string> {
        return this.memberService.updateMemberByAdmin()
    }
}

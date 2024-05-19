import { Field, InputType, Int } from "@nestjs/graphql";
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from "class-validator";
import { MemberStatus, MemberType, MemeberAuthType } from "../../enums/member.enum";
import { availableAgentsSorts, availableMemberSorts } from "../../config";
import { Direction } from "../../enums/common.enum";

@InputType()
export class MemberInput {
    @IsNotEmpty()
    @Length(3, 12)
    @Field(() => String)
    memberNick: string;


    @IsNotEmpty()
    @Length(5, 12)
    @Field(() => String)
    memberPassword: string;

    @IsNotEmpty()
    @Field(() => String)
    memberPhone: string

    @IsOptional()
    @Field(() => MemberType, { nullable: true })
    memberType?: MemberType

    @IsOptional()
    @Field(() => MemeberAuthType, { nullable: true })
    memberAuthType?: MemeberAuthType
}

@InputType()
export class LoginInput {
    @IsNotEmpty()
    @Length(3, 12)
    @Field(() => String)
    memberNick: string;

    @IsNotEmpty()
    @Length(5, 12)
    @Field(() => String)
    memberPassword: string;
}

@InputType()
export class AISearch {
    @IsNotEmpty()
    @Field(() => String, { nullable: true })
    text?: string
}

@InputType()
export class AgentsInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number

    @IsOptional()
    @IsIn(availableAgentsSorts)
    @Field(() => String, { nullable: true })
    sort?: string

    @IsOptional()
    @Field(() => Direction, { nullable: true })
    direction?: Direction

    @IsNotEmpty()
    @Field(() => AISearch)
    search: AISearch
}
@InputType()
export class MISearch {
    @IsOptional()
    @Field(() => MemberStatus, { nullable: true })
    memberStatus?: MemberStatus

    @IsOptional()
    @Field(() => MemberType, { nullable: true })
    memberType?: MemberType

    @IsOptional()
    @Field(() => String, { nullable: true })
    text?: string
}
@InputType()
export class MembersInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number

    @IsOptional()
    @IsIn(availableMemberSorts)
    @Field(() => String, { nullable: true })
    sort?: string

    @IsOptional()
    @Field(() => Direction, { nullable: true })
    direction?: Direction

    @IsNotEmpty()
    @Field(() => MISearch)
    search: MISearch
}
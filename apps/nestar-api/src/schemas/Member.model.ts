import { Schema } from "mongoose";
import { MemberStatus, MemberType, MemeberAuthType } from "../libs/enums/member.enum";

const MemberSchema = new Schema({
    memberType: {
        type: String,
        enum: MemberType,
        default: MemberType.USER
    },
    memberStatus: {
        type: String,
        enum: MemberStatus,
        default: MemberStatus.ACTIVE
    },
    memberAuthType: {
        type: String,
        enum: MemeberAuthType,
        default: MemeberAuthType.PHONE
    },
    memberPhone: {
        type: String,
        unique: true,
        required: true
    },
    memberNick: {
        type: String,
        unique: true,
        required: true
    },
    memberPassword: {
        type: String,
        select: false,
        required: true,
    },
    memberFullName: {
        type: String,
    },
    memberImage: {
        type: String,
        default: ""
    },
    memberAddress: {
        type: String,
    },
    memberDesc: {
        type: String,
    },
    memberProperties: {
        type: Number,
        default: 0
    },
    memberArticles: {
        type: Number,
        default: 0
    },
    memberFollowers: {
        type: Number,
        default: 0
    },
    memberFollowings: {
        type: Number,
        default: 0
    },
    memberPoints: {
        type: Number,
        default: 0
    },
    memberLikes: {
        type: Number,
        default: 0
    },
    memberViews: {
        type: Number,
        default: 0
    },
    memberComments: {
        type: Number,
        default: 0
    },
    memberRank: {
        type: Number,
        default: 0
    },
    memberWarnings: {
        type: Number,
        default: 0
    },
    memberBlocks: {
        type: Number,
        default: 0
    },
    deletedAt: {
        type: Date,
    }
}, { timestamps: true, collection: "members" });

export default MemberSchema;

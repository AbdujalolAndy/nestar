import { ObjectId } from "bson";

export const availableAgentsSorts = [
    "createdAt",
    "updatedAt",
    "memberLikes",
    "memberViews",
    "memberRank"
]
export const availableMemberSorts = [
    "createdAt",
    "updatedAt",
    "memberLikes",
    "memberViews",
]
export const availableOptions = [
    "propertyBarter",
    "propertyRent"
];
export const availablePropertySort = [
    "createdAt",
    "updatedAt",
    "propertyLikes",
    "propertyViwes",
    "propertyRank",
    "propertyPrice"
]
export const availableBoardArticleSort = [
    "createdAt",
    "updatedAt",
    "articleLikes",
    "articleViews"
]
export const availableCommentSorts = [
    "createdAt",
    "updatedAt"
]

// IMAGE CONFIGURATION (config.js)
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { pipeline } from "stream";
import { T } from "./types/common";

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
    const ext = path.parse(filename).ext;
    return uuidv4() + ext;
};

export function shapeIntoMongoObjectId(target: any) {
    return typeof target === "string" ? new ObjectId(target) : target
}

export const lookUpMember = {
    $lookup: {
        from: "members",
        localField: "memberId",
        foreignField: "_id",
        as: "memberData"
    }
}

export const lookupFollowingData = {
    $lookup: {
        from: "members",
        localField: "followingId",
        foreignField: "_id",
        as: "followingData"
    }
}

export const lookupFollowerData = {
    $lookup: {
        from: "members",
        localField: "followerId",
        foreignField: "_id",
        as: "followerData"
    }
}

export const lookupAuthMemberLiked = (memberId: T, targetRefId: string = "$_id",) => {
    return {
        $lookup: {
            from: "likes",
            let: {
                localMemberId: memberId,
                localLikeRefId: targetRefId,
                localMyFavorite: true
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{ $eq: ["$memberId", "$$localMemberId"] }, { $eq: ["$likeRefId", "$$localLikeRefId"] }]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        memberId: 1,
                        likeRefId: 1,
                        myFavorite: "$$localMyFavorite"
                    }
                }
            ],
            as: "meLiked"
        }
    }
}
interface LookupAuthMemberFollowed {
    followerId: T,
    followingId: string
}

export const lookupAuthMemberFollowed = (input: LookupAuthMemberFollowed) => {
    const { followerId, followingId } = input
    return {
        $lookup: {
            from: "follows",
            let: {
                localFollowerId: followerId,
                localFollowingId: followingId,
                localMyFollowing: true
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{ $eq: ["$followingId", "$$localFollowingId"] }, { $eq: ["$followerId", "$$localFollowerId"] }]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        followerId: 1,
                        followingId: 1,
                        myFollowing: "$$localMyFollowing"
                    }
                }
            ],
            as: "meFollowed"
        }
    }
}


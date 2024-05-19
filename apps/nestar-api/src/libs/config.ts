import { ObjectId } from "bson";

export const availableAgentsSorts = [
    "createdAt",
    "updatedAt",
    "memberLikes",
    "memberViews",
    "memberRank"
]

export function shapeIntoMongoObjectId(target: any) {
    return typeof target === "string" ? new ObjectId(target) : target
}
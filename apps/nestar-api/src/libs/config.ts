import { ObjectId } from "bson";

export function shapeIntoMongoObjectId(target: any) {
    return typeof target === "string" ? new ObjectId(target) : target
}
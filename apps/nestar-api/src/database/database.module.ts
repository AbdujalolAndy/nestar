import { Module } from '@nestjs/common';
import { InjectConnection, MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose"

@Module({
    imports: [MongooseModule.forRootAsync({
        useFactory: () => ({
            uri: process.env.NODE_ENV === "production" ? process.env.MONGODB_PROD : process.env.MONGODB_DEV
        })
    })],
    exports: [MongooseModule],
})
export class DatabaseModule {
    constructor(@InjectConnection() private readonly connection: Connection) {
        if (connection.readyState === 1) {
            console.log(`MONGODB is connected into ${process.env.NODE_ENV === "production" ? "production db" : "development db"}`)
        } else {
            console.log("DB is not connected!")
        }
    }


}

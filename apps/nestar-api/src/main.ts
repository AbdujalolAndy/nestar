import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingIntercepter } from './libs/interceptor/Logging.intercepter';
import { graphqlUploadExpress } from "graphql-upload"
import * as express from "express"

async function bootstrap() {
  //NESTJS BACKEND SERVER
  const app = await NestFactory.create(AppModule);

  //Global Integration
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingIntercepter());

  //Cors config 
  app.enableCors({ origin: true, credentials: true })

  //limit the size of data that entring to the server
  app.use(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 10 }))

  //Static file
  app.use("/uploads", express.static("./uploads"))

  //PORT
  await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
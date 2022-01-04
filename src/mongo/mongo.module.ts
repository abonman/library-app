import { MongoService } from './mongo.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [MongooseModule.forRootAsync({
    useFactory: async (config: ConfigService) => ({
      uri: config.get('MONGO_URI'),
      dbName: config.get('MONGO_DBNAME'),
      useNewUrlParser: true,
    }),
    inject: [ConfigService],
  })],
  controllers: [],
  providers: [MongoService],
})
export class MongoModule { }

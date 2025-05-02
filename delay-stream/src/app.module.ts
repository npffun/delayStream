import { Module } from '@nestjs/common';
import { StreamService } from './stream/stream.service';
import { StreamController } from './stream/stream.controller';

@Module({
  imports: [],
  controllers: [StreamController],
  providers: [StreamService],
})
export class AppModule {}

import { Controller, Get } from '@nestjs/common';
import { StreamService } from './stream.service';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Get('url')
  getStreamUrl() {
    return { url: this.streamService.getStreamUrl() };
  }
}

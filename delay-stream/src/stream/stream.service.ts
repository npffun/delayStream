/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegPath from '@ffmpeg-installer/ffmpeg';
import * as NodeMediaServer from 'node-media-server';

@Injectable()
export class StreamService {
  private nms: any;

  constructor() {
    ffmpeg.setFfmpegPath(ffmpegPath.path);
    this.setupStreamServer();
    this.startStreamProcessing();
  }

  private setupStreamServer() {
    this.nms = new NodeMediaServer({
      rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60,
      },
      http: {
        port: 8000,
        allow_origin: '*',
      },
    });

    this.nms.run();
  }

  private startStreamProcessing() {
    const inputStream = 'rtsp://10.5.2.230:7447/lPZu2p7Jpfp4NKOy';
    const outputStream = 'rtmp://localhost:1935/live/delayed';

    ffmpeg(inputStream)
      .inputOption('-re') // Read input at native frame rate
      .videoCodec('copy') // No re-encoding (for efficiency)
      .audioCodec('copy')
      .outputOptions([
        '-f flv', // Output format
        '-delay 20', // 20-second delay
      ])
      .output(outputStream)
      .on('start', (cmd: string) => console.log(`Started FFmpeg: ${cmd}`))
      .on('error', (err) => console.error('FFmpeg error:', err))
      .on('end', () => console.log('Stream ended'))
      .run();
  }

  getStreamUrl(): string {
    return 'http://localhost:8000/live/delayed.flv';
  }
}

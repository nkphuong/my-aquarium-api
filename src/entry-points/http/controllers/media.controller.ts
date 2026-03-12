import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import * as fs from 'fs';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  @Post('upload')
  async upload(@Body() body: any) {
    const file = body.file;
    const fileName = file.originalname;
    const fileExtension = file.originalname.split('.').pop();
    const filePath = `${fileName}.${fileExtension}`;
    const fileBuffer = file.buffer;
    const fileStream = fs.createWriteStream(filePath);
    fileStream.write(fileBuffer);
    fileStream.end();

    return body;
  }
}

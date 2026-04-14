import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Inject,
  Res,
  Header,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { SkipTransform } from '../decorators/skip-transform.decorator';
import { SendMessageDto } from '@subsystems/chat/dtos/send-message.dto';
import type { IChatManager } from '@subsystems/chat/contracts/chat.manager.interface';
import { CHAT_MANAGER } from '@subsystems/chat/contracts/chat.manager.interface';
import type { IInsightManager } from '@subsystems/chat/contracts/insight.manager.interface';
import { INSIGHT_MANAGER } from '@subsystems/chat/contracts/insight.manager.interface';
import type { AIInsight } from '@subsystems/chat/types/context.types';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    @Inject(CHAT_MANAGER) private readonly chatManager: IChatManager,
    @Inject(INSIGHT_MANAGER) private readonly insightManager: IInsightManager,
  ) {}

  @Post('message')
  @SkipTransform()
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache')
  @Header('Connection', 'keep-alive')
  async sendMessage(
    @CurrentUser() user: { userId: number },
    @Body() dto: SendMessageDto,
    @Res() res: Response,
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
      const stream = this.chatManager.sendMessage(user.userId, dto.message);

      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      }

      res.write('data: [DONE]\n\n');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    } finally {
      res.end();
    }
  }

  @Post('clear')
  async clearSession(
    @CurrentUser() user: { userId: number },
  ): Promise<{ cleared: boolean }> {
    this.chatManager.clearSession(user.userId);
    return { cleared: true };
  }

  @Get('insights')
  async getInsights(
    @CurrentUser() user: { userId: number },
  ): Promise<AIInsight[]> {
    return this.insightManager.getInsights(user.userId);
  }
}

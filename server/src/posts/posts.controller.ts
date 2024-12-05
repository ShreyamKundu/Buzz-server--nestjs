import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts() {
    return this.postsService.getPosts();
  }

  @Post('create')
  async createPost(@Req() req: Request, @Body('content') content: string) {
    const userId = req.cookies.userId;
    return this.postsService.createPost(userId, content);
  }

  @Post('like/:postId')
  async addLike(
    @Req() req: Request,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    const userId = req.cookies.userId;
    return this.postsService.addLike(postId, userId);
  }

  @Post('comment/:postId')
  async addComment(
    @Req() req: Request,
    @Param('postId', ParseIntPipe) postId: number,
    @Body('content') content: string,
  ) {
    const userId = req.cookies.userId;
    return this.postsService.addComment(postId, userId, content);
  }

  @Get('aimessage')
  async groqMessage(){
    return this.postsService.groqMessage();
  }
}

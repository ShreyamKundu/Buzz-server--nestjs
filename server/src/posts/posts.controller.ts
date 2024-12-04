import { Body, Controller, Get, Post, Req } from '@nestjs/common';
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
      const userId = req.cookies.userId; // Get userId from cookies
      return this.postsService.createPost(userId, content);
    }
}

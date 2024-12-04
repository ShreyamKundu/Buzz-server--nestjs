import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { analyzeComment } from 'src/perspective.config';

@Injectable()
export class PostsService {
    constructor(private readonly databaseService: DatabaseService) {}
    
    async getPosts() {
        return this.databaseService.post.findMany();
    }

    async createPost(userId: string, content: string) {
        // Analyze content for toxicity
        const scores = await analyzeComment(content);
    
        if (
          scores.toxicityScore > 0.5 ||
          scores.severeToxicityScore > 0.3 ||
          scores.insultScore > 0.4 ||
          scores.threatScore > 0.1 ||
          scores.profanityScore > 0.4
        ) {
          throw new BadRequestException('Your post is considered inappropriate.');
        }
    
        // Create post in database
        return this.databaseService.post.create({
          data: { content, userId, comments: [], likes: [] },
        });
      }
}

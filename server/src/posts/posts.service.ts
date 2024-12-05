import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { analyzeComment } from 'src/perspective.config';

@Injectable()
export class PostsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getPosts() {
    return this.databaseService.post.findMany({
      include: {
        comments: true, // Fetch related comments
        likes: true, // Fetch related likes
      },
    });
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
      data: {
        content, // Post content
        userId, // User who created the post
        comments: {
          // Initialize an empty array of comments
          create: [],
        },
        likes: {
          // Initialize an empty array of likes
          create: [],
        },
      },
      include: {
        comments: true, // Fetch related comments after creation
        likes: true, // Fetch related likes after creation
      },
    });
  }

  // Add or remove a like from a post
  async addLike(postId: number, userId: string) {
    // Check if the user has already liked the post
    const existingLike = await this.databaseService.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingLike) {
      // Unlike: If the like already exists, remove it
      await this.databaseService.like.delete({
        where: { id: existingLike.id },
      });
      return { message: 'Post unliked successfully.' };
    } else {
      // Like: If no like exists, create one
      await this.databaseService.like.create({
        data: {
          userId, // User who liked the post
          postId, // Post that is liked
        },
      });
      return { message: 'Post liked successfully.' };
    }
  }

  // Add a comment to a post
  async addComment(postId: number, userId: string, content: string) {
    // Analyze the comment for toxicity
    const scores = await analyzeComment(content);

    if (
      scores.toxicityScore > 0.5 ||
      scores.severeToxicityScore > 0.3 ||
      scores.insultScore > 0.4 ||
      scores.threatScore > 0.1 ||
      scores.profanityScore > 0.4
    ) {
      throw new BadRequestException(
        'Your comment is considered inappropriate.',
      );
    }

    // Create the comment and link it to the post
    return this.databaseService.comment.create({
      data: {
        content, // Comment content
        userId, // User who created the comment
        postId, // Post the comment is related to
      },
    });
  }
}

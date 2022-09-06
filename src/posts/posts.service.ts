import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Post from './post.entity';
import { Repository } from 'typeorm';
import { PostNotFoundException } from './exception/postNotFound.exception';

@Injectable()
export default class PostsService {
  constructor(@InjectRepository(Post) private repo: Repository<Post>) {}

  getAllPosts() {
    return this.repo.find();
  }

  getPostById(id: number) {
    const post = this.repo.findOne({
      where: {
        id,
      },
    });
    if (!post) {
      throw new PostNotFoundException(id);
    }
    return post;
  }

  async replacePost(id: number, post: UpdatePostDto) {
    const updatedPost = this.repo.findOne({
      where: {
        id,
      },
    });
    if (!updatedPost) {
      throw new PostNotFoundException(id);
    }
    await this.repo.update(id, post);
    return updatedPost;
  }

  async createPost(post: CreatePostDto) {
    const newPost = this.repo.create(post);
    await this.repo.save(newPost);
    return newPost;
  }

  async deletePost(id: number) {
    const post = await this.repo.delete(id);
    if (!post) {
      throw new PostNotFoundException(id);
    }
    return post;
  }
}

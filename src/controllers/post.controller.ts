import { Request, Response, NextFunction } from "express";
import postService from "../services/post.service";

class PostController {
  async createPost(req: Request, res: Response, next: NextFunction) {
    return postService.createPost(req, res, next);
  }
  async addCommentToPost(req: Request, res: Response, next: NextFunction) {
    return postService.addCommentToPost(req, res, next);
  }
  async getPost(req: Request, res: Response, next: NextFunction) {
    return postService.getPost(req, res, next);
  }
  async getPosts(req: Request, res: Response, next: NextFunction) {
    return postService.getPosts(req, res, next);
  }
  async updatePost(req: Request, res: Response, next: NextFunction) {
    return postService.updatePost(req, res, next);
  }
  async deletePost(req: Request, res: Response, next: NextFunction) {
    return postService.deletePost(req, res, next);
  }
}

export default new PostController();

import { Request, Response, NextFunction } from "express";
import {
  createPost,
  addCommentToPost,
  getPostWithComments,
  getPost,
  getPosts,
  updatePost,
  deletePost,
} from "../services/post.service";

class PostController {
  async createPost(req: Request, res: Response, next: NextFunction) {
    return createPost(req, res, next);
  }
  async addCommentToPost(req: Request, res: Response, next: NextFunction) {
    return addCommentToPost(req, res, next);
  }
  async getPostWithComments(req: Request, res: Response, next: NextFunction) {
    return getPostWithComments(req, res, next);
  }
  async getPost(req: Request, res: Response, next: NextFunction) {
    return getPost(req, res, next);
  }
  async getPosts(req: Request, res: Response, next: NextFunction) {
    return getPosts(req, res, next);
  }
  async updatePost(req: Request, res: Response, next: NextFunction) {
    return updatePost(req, res, next);
  }
  async deletePost(req: Request, res: Response, next: NextFunction) {
    return deletePost(req, res, next);
  }
}

export default new PostController();

import { Request, Response, NextFunction } from "express";
import { db } from "../config/database";
// import Functions from "../utils/functions";

class PostService {
  async createPost(req: Request, res: Response, _next: NextFunction) {
    // Extract necessary data from the request body
    const { title, content, authorId } = req.body;

    // Create a new post object
    const newPost = {
      title,
      content,
      authorId,
    };

    // Insert the new post into the database
    const [postId] = await db("posts").insert(newPost);

    // Retrieve the newly created post from the database
    const createdPost = await db("posts").where({ id: postId }).first();

    if (!createdPost) {
      return res.status(403).json({ message: "Creating problem" });
    }

    return res.status(201).json(createdPost);
  }

  async addCommentToPost(req: Request, res: Response, _next: NextFunction) {
    const { postId, parentCommentId, content } = req.body;

    // Check if the post exists
    const post = await db("posts").where({ id: postId }).first();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create a new comment object
    const newComment = {
      postId,
      parentCommentId,
      content,
    };

    // Insert the new comment into the database
    const [commentId] = await db("comments").insert(newComment);

    // Retrieve the newly created comment from the database
    const createdComment = await db("comments")
      .where({ id: commentId })
      .first();

    return res.status(201).json(createdComment);
  }

  async getPosts(_req: Request, res: Response, _next: NextFunction) {
    // Retrieve all posts from the database
    const posts = await db("posts").select();

    return res.json(posts);
  }

  async getPost(req: Request, res: Response, _next: NextFunction) {
    const { id } = req.params;

    // Retrieve the post from the database based on the given ID
    const post = await db("posts").where({ id }).first();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json(post);
  }

  async updatePost(req: Request, res: Response, _next: NextFunction) {
    const { id } = req.params;
    const { title, content } = req.body;

    // Retrieve the post from the database based on the given ID
    const post = await db("posts").where({ id }).first();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create an object to hold the updated post fields
    const updatedPost: any = {};

    if (title) {
      updatedPost.title = title;
    }

    if (content) {
      updatedPost.content = content;
    }

    if (Object.keys(updatedPost).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Update the post in the database
    await db("posts").where({ id }).update(updatedPost);

    // Retrieve the updated post from the database
    const updatedPostData = await db("posts").where({ id }).first();

    return res.json(updatedPostData);
  }

  async deletePost(req: Request, res: Response, _next: NextFunction) {
    const { id } = req.params;

    // Retrieve the post from the database based on the given ID
    const deletedPost = await db("posts").where({ id }).first();

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete the post from the database
    await db("posts").where({ id }).del();

    return res.status(204).json(deletedPost);
  }
}

export default new PostService();

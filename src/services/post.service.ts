import { redisClient } from "./../config/redis";
import { messages } from "./../utils/error.messages";
import { Request, Response, NextFunction } from "express";
import { db } from "../config/database";

export const createPost = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Extract necessary data from the request body
  const { title, content, authorId } = req.body;

  // Create a new post object
  const newPost = {
    title,
    content,
    authorId,
  };

  // Insert the new post into the database
  const [id] = await db("posts").insert(newPost);

  // Retrieve the newly created post from the database
  const createdPost = await db("posts").where({ id }).first();

  if (!createdPost) {
    return res.status(403).json({ message: messages.creatingProblem });
  }

  // Store the created post in Redis
  await redisClient.set(`post:${id}`, JSON.stringify(createdPost));
  await redisClient.expire(`post:${id}`, 24 * 3600); // 1 day

  return res.status(201).json(createdPost);
};

export const addCommentToPost = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { id, parentCommentId, content } = req.body;

  // Check if the post exists
  const post = await db("posts").where({ id }).first();

  if (!post) {
    return res.status(404).json({ message: messages.postNotFound });
  }

  // Create a new comment object
  const newComment = {
    id,
    parentCommentId: parentCommentId ? parentCommentId : null,
    content,
  };

  // Insert the new comment into the database
  const [commentId] = await db("comments").insert(newComment);

  // Retrieve the newly created comment from the database
  const createdComment = await db("comments").where({ id: commentId }).first();

  // Store the comment in Redis
  await redisClient.set(`comment:${commentId}`, JSON.stringify(createdComment));
  await redisClient.expire(`comment:${commentId}`, 24 * 3600); // 1 day

  return res.status(201).json(createdComment);
};

export const getPostWithComments = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { id } = req.params;

  // Retrieve the post with the given postId
  const post = await db("posts").where({ id }).first();

  if (!post) {
    return res.status(404).json({ message: messages.postNotFound });
  }

  // Retrieve all comments associated with the post
  const comments = await db("comments").where({ postId: id });

  // Create a new object to store the post with comments
  const postWithComments = {
    id: post.id,
    title: post.title,
    content: post.content,
    authorId: post.authorId,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    comments: [] as any, // Initialize the comments array
  };

  // Initialize object for finding matches ids
  const commentObj: object | any = {};
  comments.forEach((comment) => {
    commentObj[comment.id] = comment;
  });

  // Iterate over the comments and populate the comments array
  comments.forEach((comment) => {
    const { parentCommentId } = comment;

    // Initialize the nested comments array
    comment.comments = [];

    // add comment to main comments row
    if (!parentCommentId) {
      postWithComments.comments.push(comment);
    }

    // add comment to subsidiary comments row
    if (parentCommentId) {
      const parentComment = commentObj[parentCommentId];
      if (parentComment) {
        parentComment.comments.push(comment);
      }
    }
  });

  await redisClient.set(
    `post:${id}:comments`,
    JSON.stringify(postWithComments)
  );
  await redisClient.expire(`post:${id}:comments`, 24 * 3600); // 1 day

  return res.status(200).json(postWithComments);
};

export const getPosts = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Check if posts exist in Redis
  const postsFromRedis = await redisClient.get("posts");

  if (postsFromRedis) {
    // Posts exist in Redis, parse and return them
    const posts = JSON.parse(postsFromRedis);
    return res.json(posts);
  }

  // Posts do not exist in Redis, retrieve them from the database
  const posts = await db("posts").select();

  // Store the posts in Redis
  await redisClient.set("posts", JSON.stringify(posts));
  await redisClient.expire(`posts`, 24 * 3600); // 1 day

  return res.json(posts);
};

export const getPost = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { id } = req.params;

  // Check if the post exists in Redis
  const postFromRedis = await redisClient.get(`post:${id}`);

  if (postFromRedis) {
    // Post exists in Redis, parse and return it
    const post = JSON.parse(postFromRedis);
    return res.json(post);
  }

  // Post does not exist in Redis, retrieve it from the database
  const post = await db("posts").where({ id }).first();

  if (!post) {
    return res.status(404).json({ message: messages.postNotFound });
  }

  // Store the post in Redis
  await redisClient.set(`post:${id}`, JSON.stringify(post));
  await redisClient.expire(`post:${id}`, 24 * 3600); // 1 day

  return res.json(post);
};

export const updatePost = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // Retrieve the post from the database based on the given ID
  const post = await db("posts").where({ id }).first();

  if (!post) {
    return res.status(404).json({ message: messages.postNotFound });
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
    return res.status(400).json({ message: messages.noFieldsToUpdate });
  }

  // Update the post in the database
  await db("posts").where({ id }).update(updatedPost);

  // Retrieve the updated post from the database
  const updatedPostData = await db("posts").where({ id }).first();

  // set cache
  await redisClient.set(`post:${id}`, JSON.stringify(updatedPostData));
  await redisClient.expire(`post:${id}`, 24 * 3600); // 1 day

  return res.json(updatedPostData);
};

export const deletePost = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { id } = req.params;

  // Retrieve the post from the database based on the given ID
  const deletedPost = await db("posts").where({ id }).first();

  if (!deletedPost) {
    return res.status(404).json({ message: messages.postNotFound });
  }

  // Delete the post from the database
  await db("posts").where({ id }).del();

  // delete cache
  await redisClient.srem(`post:${id}`, deletedPost);

  return res.status(204).json(deletedPost);
};

import postController from "../controllers/post.controller";

const routes = [
  {
    method: "post",
    routeName: "create",
    url: "/create",
    validator: [],
    middleware: [],
    controller: postController.createPost,
  },
  {
    method: "post",
    routeName: "addCommentToPost",
    url: "/comment",
    validator: [],
    middleware: [],
    controller: postController.addCommentToPost,
  },
  {
    method: "get",
    routeName: "getPostWithComments",
    url: "/getPostWithComments/:id",
    validator: [],
    middleware: [],
    controller: postController.getPostWithComments,
  },
  {
    method: "get",
    routeName: "getPosts",
    url: "/list",
    validator: [],
    middleware: [],
    controller: postController.getPosts,
  },
  {
    method: "get",
    routeName: "getPost",
    url: "/:id",
    validator: [],
    middleware: [],
    controller: postController.getPost,
  },
  {
    method: "post",
    routeName: "updatePost",
    url: "/:id",
    validator: [],
    middleware: [],
    controller: postController.updatePost,
  },
  {
    method: "post",
    routeName: "deletePost",
    url: "/:id",
    validator: [],
    middleware: [],
    controller: postController.deletePost,
  },
];

export default routes;

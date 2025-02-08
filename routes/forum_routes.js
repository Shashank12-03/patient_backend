import { Router } from "express";
import { addcomment, createPost, deletePost, getComments, getPosts } from "../controllers/forum_controller.js";

export const forumRoutes = Router();

forumRoutes.post('/add-post',createPost);
forumRoutes.post('/add-comment',addcomment);
forumRoutes.get('/get-posts',getPosts);
forumRoutes.get('/get-comments',getComments);
forumRoutes.delete('/delete-post/:id',deletePost);

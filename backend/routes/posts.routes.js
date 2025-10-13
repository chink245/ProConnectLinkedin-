import { Router } from "express";
import {activeCheck, delete_comment_of_user}  from "../controllers/posts.controller.js";
import multer from "multer";
import { createPost,getAllPosts,deletePost,commentPost,get_comments_by_post,increment_likes} from "../controllers/posts.controller.js";
import { get } from "http";


const router = Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },  
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    },
})

const upload = multer({storage: storage})

router.route('/').get(activeCheck);

router.route('/post').post(upload.single('media'),createPost);
router.route('/posts').get(getAllPosts);
router.route('/delete_post').delete(deletePost);
router.route('/comment').post(commentPost);
router.route('/get_comments').get(get_comments_by_post);
router.route('/delete_comment').post(delete_comment_of_user);
router.route('/increment_post_like').post(increment_likes);   




export default router;


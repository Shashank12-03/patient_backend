import { CareGiver } from "../models/caregiver_model.js";
import { Post } from "../models/forum_model.js";


export const createPost = async (req,res) => {
    const logged = await req.user;
    if (!logged) {
        return res.status(401).json({'message':'no logged user'});
    }
    if (logged.isPatient) {
        return res.status(401).json({'message':'Patient cant be in the forum'});
    }
    try {
        const {title, postBody, tag, postImage} = req.body;
        if (!title || !postBody || !tag) {
            return res.status(401).json({'message':'Any of the title body or tags is missing'}); 
        }
        const newPost = await Post.create({
            creator:logged.id,
            title,
            postBody,
            tag,
            postImage
        });
        const addToCaregiver = await CareGiver.findByIdAndUpdate(logged.id,{$push:{list_of_post:newPost.id}});
        return res.status(200).json({'message':'posted the post',newPost});
    } catch (error) {
        return res.status(500).json({
            message : "Internal server occured",
            error : error.message
        });
    }
}

export const addcomment = async (req,res) => {
    const logged = await req.user;
    if (!logged) {
        return res.status(401).json({'message':'no logged user'});
    }
    if (logged.isPatient) {
        return res.status(401).json({'message':'Patient cant be in the forum'});
    }
    try {
        const {postId, commentBody} = req.body;
        if (!postId || !commentBody) {
            return res.status(401).json({'message':'Any of the postId or replyBody is missing'}); 
        }

        const comment = {
            'commentorId':logged.id,
            'comment':commentBody
        }

        const newReply = await Post.findByIdAndUpdate(postId,{$push:{comments:comment}});
        return res.status(200).json({'message':'add the comment'});
    } catch (error) {
        return res.status(500).json({
            message : "Internal server occured",
            error : error.message
        });
    }
}

export const getPosts = async (req,res) => {
    const logged = await req.user;
    if (!logged) {
        return res.status(401).json({'message':'no logged user'});
    }
    if (logged.isPatient) {
        return res.status(401).json({'message':'Patient cant be in the forum'});
    }
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).limit(10);
        const postData = [];
        for (let index = 0; index < posts.length; index++) {
            const element = posts[index];
            const creator = await CareGiver.findOne({ _id: element.creator });
            const data = {
                'postId':element.id,
                'caregiverName':creator.name,
                'caregiverPfp':creator.profile_pic_url,
                'title':element.title,
                'postBody':element.postBody,
                'postImage':element.postImage,
                'tag':element.tag,
                'postDate': element.createdAt
            }
            console.log(data);
            postData.push(data);
        }
        
        return res.status(200).json({'message':'posted the post',postData});
    } catch (error) {
        return res.status(500).json({
            message : "Internal server occured",
            error : error.message
        });
    }
}

export const getComments = async (req,res) => {
    const logged = await req.user;
    if (!logged) {
        return res.status(401).json({'message':'no logged user'});
    }
    if (logged.isPatient) {
        return res.status(401).json({'message':'Patient cant be in the forum'});
    }
    try {
        const postId = req.body;
        const post = await Post.findOne(postId);
        const commentData = post.comments;
        for (let index = 0; index < commentData.length; index++) {
            const element = commentData[index];
            const creator = await CareGiver.findOne({ _id: element.commentorId });
            const data = {
                'caregiverName':creator.name,
                'caregiverPfp':creator.profile_pic_url,
                'comment':element.comment,
            }
            console.log(data);
            postData.push(data);
        }
        
        return res.status(200).json({'message':'posted the post',postData});
    } catch (error) {
        return res.status(500).json({
            message : "Internal server occured",
            error : error.message
        });
    }
}


export const deletePost = async (req,res) => {
    const logged = await req.user;
    const postId = req.params.id;
    if (!postId) {
        return res.status(401).json({'message':'need post id'});
    }
    if (!logged) {
        return res.status(401).json({'message':'no logged user'});
    }
    if (logged.isPatient) {
        return res.status(401).json({'message':'Patient cant be in the forum'});
    }
    try {
        await Post.findByIdAndDelete(postId);
        await CareGiver.findByIdAndUpdate(logged.id,{$pull:{list_of_post:postId}});
        return res.status(200).json({'message':'posted the post',newPost});
    } catch (error) {
        return res.status(500).json({
            message : "Internal server occured",
            error : error.message
        });
    }
}
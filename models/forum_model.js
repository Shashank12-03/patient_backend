import mongoose from "mongoose";

const forumSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CareGiver',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    postBody: {
        type: String,
        required: true
    },
    postImage: {
        type: String
    },
    tag: {
        type: String,
        enum: ['rant', 'advice', 'exhausted', 'tips','random'],
        require:true
    },
    comments :[{
        commentorId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CareGiver',
            required: true
        },
        comment:{
            type: String
        }
    }]
},{timestamps:true});

export const Post = mongoose.model('Post',forumSchema); 

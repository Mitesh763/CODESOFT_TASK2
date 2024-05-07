const mongoose = require('mongoose');
const  Schema  = mongoose.Schema;
const userLocalMongoose = require('passport-local-mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/codesoft2").then(() => console.log("Connection Successfully")).catch((err) => console.log(err));

const quizUserSchema  = new Schema({
    email:{
        type:String,
        required: true,
    }
});

quizUserSchema.plugin(userLocalMongoose)
module.exports = mongoose.model("QuizUser" , quizUserSchema);
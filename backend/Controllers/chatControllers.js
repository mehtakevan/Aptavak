const { Chat, User } = require('../database/database.schema');
const mongoose = require('mongoose');



const accessChat = (async (req, res) => {
    console.log("In accesschat");
    const { userId } = req.body;
    console.log(userId);

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }
    try {
        var isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        }).populate("users", "-password").populate("latestMessage");
        console.log(isChat);
        isChat = await User.populate(isChat, {
            path: 'latestMessage.sender',
            select: "name pic email",
        })

        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            };

            try {
                const createdChat = await Chat.create(chatData);

                const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                    "users",
                    "-password"
                );
                res.status(200).send(FullChat);
            } catch (error) {
                res.status(400).send(error);
                // console.log(error.data);
                // console.log(error.Error.messages);
                // throw new Error(error.message);
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error(error.message);
    }
});

const fetchChats = (async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users","-password")
            .populate("groupAdmin","-password")
            .populate("latestMessage")
            .sort({updatedAt : -1})
            .then(async (results)=>{
                results = await User.populate(results,{
                    path :"latestMessage.sender",
                    select:"name pic email",
                });

                res.status(200).send(results);
            });
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
})

const createGroupChat = (async(req,res)=>{
    console.log("In create Gorup Chat");
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message : "Please Fill all the feilds"});
    }
    
    var users = JSON.parse(req.body.users);

    if(users.length < 2){
        return res.status(400).send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    try{
        const groupchat = await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        });

        const fullGroupChat = await Chat.findOne({_id:groupchat._id})
                .populate("users","-password")
                .populate("groupAdmin","-password");

            res.status(200).json(fullGroupChat);
    }catch(error){
        res.status(400);
        throw new Error(error.message);
    }

});

const renameGroup = (async (req,res)=>{
    console.log("In rename group");
    const {chatId,chatName} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new:true,
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!updatedChat){
        res.status(404);
        throw new Error("Chat Not Found");
    }else{
        res.json(updatedChat);
    }
});

const addToGroup = (async(req,res)=>{
    console.log("In add to group");
    const {chatId,userId} = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: {users : userId},
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!added){
        res.status(404);
        throw new Error("CHat Not Found");
    }else{
        res.json(added);
    }
});

const removeFromGroup = (async(req,res)=>{
    console.log("In remove form group");
    const {chatId,userId} = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: {users : userId},
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!removed){
        res.status(404);
        throw new Error("CHat Not Found");
    }else{
        res.json(removed);
    }
})

module.exports = {
    accessChat: accessChat,
    fetchChats:fetchChats,
    createGroupChat:createGroupChat,
    renameGroup:renameGroup,
    addToGroup:addToGroup,
    removeFromGroup:removeFromGroup,
}
import User from "../models/user.model.js";
import Message from "../models/msg.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js"; 

export const getUsersForSidebar = async(req, res) => {
     try {
          const loggedInUserId=req.user._id;
          const filteredUsers=await User.find({_id: {$ne: loggedInUserId}}).select("-password");
          res.status(200).json(filteredUsers);

     } catch (error) {
          console.log("Error in getUsersForSidebar:", error.message);
          res.status(500).json({error: "Internal Server Error"});
     }
}

export const getMessages =async(req, res) => {
     try {
          const {id : userToChatId} = req.params;
          const myId= req.user._id;

          const messages= await Message.find({
               $or:[
                    {senderId : myId, receiverId : userToChatId},
                    {senderId : userToChatId, receiverId : myId},
               ]
          })

          res.status(200).json(messages);
     } catch (error) {
          console.log("Error in getMessages controller: ", error.message);
          res.status(500).json({error : "Internal Server Error"});
     }
}

export const sendMessage = async(req, res) =>{
     try {
          const {text, image} = req.body;
          const {id:receiverId}=req.params;
          const senderId = req.user._id;

          let imageUrl;
          if(image){
               const uploadResponse = await cloudinary.uploader.upload(image);
               imageUrl = uploadResponse.secure_url;
          }

          const newMsg=new Message({
               senderId,
               receiverId,
               text,
               image : imageUrl
          });

          await newMsg.save();

          const receiverSocketId = getReceiverSocketId (receiverId);
          if(receiverSocketId){
               io.to(receiverSocketId).emit("newMessage", newMsg);
          }

          res.status(201).json(newMsg);

     } catch (error) {
          console.log("Error in sendMessage controlller", error.message);
          res.status(500).json({error: "Internal Server Error"}); 
     }
}; 
import { useChatStore } from "../store/useChatStore.js";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./Skeletons/MessageSkeleton.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatMessageTime } from "../lib/utils.js";


const ChatContainer = () => {
  const { selectedUser, messages, getMessages, isMessagesLoading, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => {
    unsubscribeFromMessages();
  };
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedUser) {
    return <div className="flex-1 flex items-center justify-center">Select a user to chat</div>;
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {(Array.isArray(messages) ? messages : []).map((msg, idx) => {
          const isSender = String(msg.senderId) === String(authUser?._id);
          return (
            <div
              key={msg._id || idx}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
              ref={idx === (messages.length - 1) ? messageEndRef : null}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isSender
                        ? authUser?.profilePic || "/avatar.png"
                        : selectedUser?.profilePic || "/avatar.png"
                    }
                    alt="Profile"
                  />
                </div>
              </div>
              <div className="chat-bubble flex flex-col max-w-xs break-words">
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="attachment"
                    className="max-w-[200px] rounded-md mb-2"
                  />
                )}
                {msg.text && <p>{msg.text}</p>}
                <time className="self-end text-[10px] opacity-50 mt-1">
                  {formatMessageTime(msg.createdAt)}
                </time>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;


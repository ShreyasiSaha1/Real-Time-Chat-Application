import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create(
  persist(
    (set, get) => ({
      selectedUser: null,
      users: [],
      messages: [],
      isUsersLoading: false,
      isMessagesLoading: false,
      onlineUsers: [], 


      getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("/msg/users");
          set({ users: res.data });
        } catch (err) {
          console.error("Failed to load users:", err);
          toast.error(err?.response?.data?.message || "Failed to load users");
        } finally {
          set({ isUsersLoading: false });
        }
      },

      getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
          const res = await axiosInstance.get(`/msg/${userId}`);
          set({ messages: res.data });
        } catch (err) {
          console.error("Failed to load messages:", err);
          toast.error(err?.response?.data?.message || "Failed to load messages");
        } finally {
          set({ isMessagesLoading: false });
        }
      },

      selectUser: (user) => {
        set({ selectedUser: user, messages: [] });
        get().getMessages(user._id);
      },

      setSelectedUser: (user) => {
        set({ selectedUser: user });
      },

      sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser) {
          toast.error("No chat selected");
          return;
        }
        try {
          const res = await axiosInstance.post(`/msg/send/${selectedUser._id}`, messageData);
          set({ messages: [...messages, res.data] });
        } catch (err) {
          console.error("Failed to send message:", err);
          toast.error(err?.response?.data?.message || "Failed to send message");
        }
      },

      subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMsg) => {
          if(newMsg.senderId !== selectedUser._id) return;
          set({ messages: [...get().messages, newMsg] });
        });
      },

      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
      },
    }),
    {
      name: "chat-store",
      partialize: (state) => ({ selectedUser: state.selectedUser }),
    }
  )
);

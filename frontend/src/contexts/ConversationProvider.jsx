import { create } from "zustand";

const useConversation = create((set) => ({
  selectedContactUser: null,
  setSelectedContactUser: (selectedContactUser) => set({ selectedContactUser }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  isTyping: false,
  setIsTyping: (isTyping) => set({ isTyping }),
}));

export default useConversation;

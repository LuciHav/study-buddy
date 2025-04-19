import { create } from "zustand";

const useConversation = create((set) => ({
  // Conversation state
  selectedContactUser: null,
  setSelectedContactUser: (selectedContactUser) => set({ selectedContactUser }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  isTyping: false,
  setIsTyping: (isTyping) => set({ isTyping }),
  
  // Video call state
  callStatus: "idle",
  setCallStatus: (callStatus) => set({ callStatus }),
  incomingCall: null,
  setIncomingCall: (incomingCall) => set({ incomingCall }),

  // PeerJS state
  remotePeerId: null,
  setRemotePeerId: (remotePeerId) => set({ remotePeerId }),
}));

export default useConversation;

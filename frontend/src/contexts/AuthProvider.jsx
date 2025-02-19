import { create } from "zustand";

const loadStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage", error);
    return null;
  }
};

const useAuth = create((set) => ({
  currentUser: loadStoredUser(),
  setCurrentUser: (newUser) => {
    set({ currentUser: newUser });
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  },
  clearUser: () => {
    set({ currentUser: null });
    localStorage.removeItem("user");
  },
}));

export default useAuth;

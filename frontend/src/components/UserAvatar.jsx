import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserAvatar({ user }) {
  return (
    <Avatar>
      <AvatarImage src={`${import.meta.env.VITE_SERVER_URL}/${user?.image}`} />
      <AvatarFallback>{`${user.firstName.charAt(0)}${user.lastName.charAt(
        0
      )}`}</AvatarFallback>
    </Avatar>
  );
}

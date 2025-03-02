import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserAvatar({ user }) {
  return (
    <Avatar>
      <AvatarImage src={user?.image} />
      <AvatarFallback>{`${user.firstName.charAt(0)}${user.lastName.charAt(
        0
      )}`}</AvatarFallback>
    </Avatar>
  );
}

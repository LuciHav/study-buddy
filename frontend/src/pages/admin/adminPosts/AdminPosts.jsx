import ListPosts from "./ListPosts";

export default function AdminPosts() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Posts</h1>
      <div>
        <ListPosts />
      </div>
    </div>
  );
}

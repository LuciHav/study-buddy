import { AvatarUpload } from "./AvatarUpload";
import { PasswordForm } from "./PasswordForm";
import { ProfileForm } from "./ProfileForm";

export default function Profile() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <ProfileForm />
          <PasswordForm />
        </div>
        <div>
          <AvatarUpload />
        </div>
      </div>
    </div>
  );
}

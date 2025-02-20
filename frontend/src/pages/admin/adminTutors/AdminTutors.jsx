import CreateTutor from "./CreateTutor";
import ListTutors from "./ListTutors";

export default function AdminTutors() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tutors</h1>
        <CreateTutor />
      </div>
      <div>
        <ListTutors />
      </div>
    </div>
  );
}

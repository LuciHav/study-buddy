import { useEffect, useState } from "react";
import CreateTutor from "./CreateTutor";
import ListTutors from "./ListTutors";
import { getRequest } from "@/utils/apiHelpers";
import { toast } from "sonner";

export default function AdminTutors() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTutors = async () => {
    setLoading(true);
    const resData = await getRequest({ url: "/api/v1/tutors" });
    if (resData.success) {
      setTutors(resData.tutors);
    } else {
      toast.error(resData.message);
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tutors</h1>
        <CreateTutor onSuccess={fetchTutors} />
      </div>
      <div>
        <ListTutors
          tutors={tutors}
          loading={loading}
          error={error}
          onSuccess={fetchTutors}
        />
      </div>
    </div>
  );
}

import TutorCard from "@/components/TutorCard";
import { getRequest } from "@/utils/apiHelpers";
import { useEffect, useState } from "react";

export default function Tutors() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      const resData = await getRequest({ url: "/api/v1/tutors" });
      if (resData.success) {
        setTutors(resData.tutors);
      } else {
        console.log("Error:", resData.message);
        setError(true);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <p>Loading</p>;
  if (error) return <p>An Error Occured</p>;

  console.log(tutors);

  return (
    <div className="grid gap-6 p-4">
      {tutors.length === 0 ? (
        <p className="text-center">No tutors added yet</p>
      ) : (
        tutors.map((tutor) => <TutorCard key={tutor.id} tutor={tutor} />)
      )}
    </div>
  );
}

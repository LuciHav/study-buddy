import Loader from "@/components/Loader";
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

  if (loading) return <Loader />;
  if (error) return <p>An Error Occured</p>;

  return (
    <div className="p-4 h-[calc(100vh-4rem)] overflow-y-auto hide-scrollbar">
      <h1 className="text-3xl font-bold mb-6">Tutors</h1>

      {tutors.length === 0 ? (
        <p className="text-center">No tutors added yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-max">
          {tutors.map((tutor) => <TutorCard key={tutor.id} tutor={tutor} />)}
        </div>
      )}
    </div>
  );
}

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserAvatar from "@/components/UserAvatar";
import { getRequest } from "@/utils/apiHelpers";
import { useEffect, useState } from "react";

export default function ListTutors() {
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

  return (
    <Table>
      <TableCaption>A list of all the tutors</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Tutor ID</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Address</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tutors.map((tutor) => (
          <TableRow key={tutor.id}>
            <TableCell>{tutor.id}</TableCell>
            <TableCell>
              <UserAvatar user={tutor} />
            </TableCell>
            <TableCell>{tutor.firstName + " " + tutor.lastName}</TableCell>
            <TableCell>{tutor.email}</TableCell>
            <TableCell>{tutor.phone}</TableCell>
            <TableCell>{tutor.address}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

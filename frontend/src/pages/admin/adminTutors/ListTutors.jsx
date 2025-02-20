import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
        <TableHead>Tutor ID</TableHead>
        <TableHead>Image</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Phone</TableHead>
        <TableHead>Address</TableHead>
      </TableHeader>
      <TableBody>
        {tutors.map((tutor) => (
          <TableRow key={tutor.id}>
            <TableCell>{tutor.id}</TableCell>
            <TableCell>
              <Avatar>
                <AvatarImage
                  src={`${import.meta.env.VITE_SERVER_URL}/${tutor.image}`}
                />
                <AvatarFallback>{tutor.firstName.charAt(0)}</AvatarFallback>
              </Avatar>
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

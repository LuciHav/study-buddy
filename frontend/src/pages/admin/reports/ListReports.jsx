import Loader from "@/components/Loader";
import NavButton from "@/components/NavButton";
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

export default function ListReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      const resData = await getRequest({ url: "/api/v1/reports" });
      if (resData.success) {
        setReports(resData.reports);
      } else {
        console.log("Error:", resData.message);
        setError(true);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>An error occurred while fetching reports.</p>;

  return (
    <Table>
      <TableCaption>A list of all reported posts</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Report ID</TableHead>
          <TableHead>Reported By</TableHead>
          <TableHead>Post Title</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell>{report.id}</TableCell>
            <TableCell className="flex items-center gap-4">
              <UserAvatar user={report.user} />
              {report.user.firstName} {report.user.lastName}
            </TableCell>
            <TableCell>{report.post ? report.post.title : "Deleted"}</TableCell>
            <TableCell>{report.reason}</TableCell>
            <TableCell>{report.post ? report.status : "Resolved"}</TableCell>
            <TableCell>
              {report.post ? (
                <NavButton to="/admin/posts">View Posts</NavButton>
              ) : (
                "No Actions"
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

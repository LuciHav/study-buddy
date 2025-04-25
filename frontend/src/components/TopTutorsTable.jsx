import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CrownIcon, DollarSignIcon, BadgeCheckIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { getRequest } from "@/utils/apiHelpers";
import UserAvatar from "./UserAvatar";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/helpers";

export default function TopTutorsTable() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTutors = async () => {
      const resData = await getRequest({ url: "/api/v1/admin/dashboard" });
      if (resData.success) {
        setTutors(resData.metrics.topTutors);
      } else {
        toast.error(resData.message);
      }
      setLoading(false);
    };

    fetchTopTutors();
  }, []);

  const renderRank = (index) => {
    if (index === 0) {
      return <CrownIcon className="h-5 w-5 text-yellow-500" />;
    } else if (index === 1) {
      return <CrownIcon className="h-5 w-5 text-gray-400" />;
    } else if (index === 2) {
      return <CrownIcon className="h-5 w-5 text-amber-700" />;
    }
    return <span className="text-muted-foreground">{index + 1}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BadgeCheckIcon className="h-5 w-5 text-primary" />
          Top Performing Tutors
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading top tutors...</p>
          </div>
        ) : tutors.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">No tutors found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tutors.map((tutor, index) => (
                <TableRow key={tutor.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center justify-center">
                      {renderRank(index)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserAvatar user={tutor} />
                      <span>
                        {tutor.firstName} {tutor.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {tutor.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSignIcon className="h-4 w-4 text-green-600" />
                      {formatCurrency(tutor.totalRevenue)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {tutor.totalStudents}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

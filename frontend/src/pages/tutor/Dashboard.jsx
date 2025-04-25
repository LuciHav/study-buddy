import Error from "@/components/Error";
import Loader from "@/components/Loader";
import UserAvatar from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRequest } from "@/utils/apiHelpers";
import { formatCurrency, getStatusColor } from "@/utils/helpers";
import { BookOpen, Clock, DollarSign, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    profile: {},
    totalStudents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingRequests: 0,
    newBookingsThisWeek: 0,
    monthlyTrends: [],
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const resData = await getRequest({ url: "/api/v1/tutors/dashboard" });
      if (resData.success) {
        setMetrics(resData.metrics);
      } else {
        setError(resData.message);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Error error={error} />;

  const handleBookingClick = () => {
    navigate("/tutor/bookings");
  };

  return (
    <div className="p-6 space-y-8">
      {/* Tutor Profile Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <UserAvatar user={metrics.profile} className="h-16 w-16" />
            <div>
              <h2 className="text-2xl font-bold">
                {metrics.profile.firstName} {metrics.profile.lastName}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {metrics.profile.subjects?.map((subject, index) => (
                  <Badge key={index} variant="secondary">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm text-muted-foreground">Hourly Rate</p>
              <p className="text-2xl font-bold">
                Rs. {metrics.profile.hourlyRate}/hr
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {metrics.totalRevenue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Confirmed Bookings
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingRequests}</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>
              Your earnings over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {metrics.monthlyTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(month) => {
                        const [year, monthNum] = month.split("-");
                        return new Date(
                          year,
                          parseInt(monthNum) - 1
                        ).toLocaleString("default", { month: "short" });
                      }}
                    />
                    <YAxis tickFormatter={(value) => `Rs ${value}`} />
                    <Tooltip
                      formatter={(value) => [`Rs ${value}`, "Revenue"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">
                    No revenue data available
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your latest booking requests</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.recentBookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.recentBookings.map((booking) => (
                    <TableRow
                      key={booking.id}
                      className="hover:cursor-pointer"
                      onClick={handleBookingClick}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserAvatar user={booking.student} />
                          <span>
                            {booking.student.firstName}{" "}
                            {booking.student.lastName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{booking.hours}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(booking.status)}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {booking.amount
                          ? formatCurrency(booking.amount)
                          : "Pending"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No recent bookings</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

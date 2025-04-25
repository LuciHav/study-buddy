import Error from "@/components/Error";
import Loader from "@/components/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserAvatar from "@/components/UserAvatar";
import UserDistributionChart from "@/components/UserDistributionChart";
import { getRequest } from "@/utils/apiHelpers";
import {
  DollarSign,
  FileText,
  GraduationCap,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
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
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalTutors: 0,
    totalPosts: 0,
    totalRevenue: 0,
    pendingTutorRequests: 0,
    newPostsToday: 0,
    newUsersThisWeek: 0,
    userDistribution: [],
    monthlyTrends: [],
    topTutors: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const resData = await getRequest({ url: "/api/v1/admin/dashboard" });
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

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your platform&apos;s performance and key metrics
        </p>
      </div>

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
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tutors</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalTutors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalPosts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Revenue Chart */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <UserDistributionChart data={metrics.userDistribution} />
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Pending Tutor Requests</span>
                <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-sm">
                  {metrics.pendingTutorRequests}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">New Posts Today</span>
                <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm">
                  {metrics.newPostsToday}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">New Users This Week</span>
                <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm">
                  {metrics.newUsersThisWeek}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  name="Revenue (Rs)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Tutors */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Tutors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.topTutors.map((tutor) => (
              <div
                key={tutor.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center space-x-4">
                  <UserAvatar user={tutor} className="h-10 w-10" />
                  <div>
                    <p className="font-medium">
                      {tutor.firstName} {tutor.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {tutor.totalStudents} students
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">Rs. {tutor.totalRevenue || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import {
  DollarSign,
  CreditCard,
  Users,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/helpers";

export default function MetricCards({ metrics }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">Total Revenue</span>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold tracking-tighter">
                {formatCurrency(metrics?.totalRevenue || 0)}
              </div>
              <p className="text-xs text-zinc-400">
                From {metrics?.totalSales || 0} confirmed bookings
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Total Users</span>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold tracking-tighter">
                {metrics?.totalUsers || 0}
              </div>
              <p className="text-xs text-zinc-400">Registered platform users</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              <span className="text-sm font-medium">Tutors</span>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold tracking-tighter">
                {metrics?.totalTutors || 0}
              </div>
              <p className="text-xs text-zinc-400">Active tutors on platform</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <span className="text-sm font-medium">Sales</span>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold tracking-tighter">
                {metrics?.totalSales || 0}
              </div>
              <p className="text-xs text-zinc-400">Total completed bookings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium">Posts</span>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold tracking-tighter">
                {metrics?.totalPosts || 0}
              </div>
              <p className="text-xs text-zinc-400">Learning content shared</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { DollarSign, CreditCard, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function MetricCards() {
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
              <div className="text-3xl font-bold tracking-tighter">$45,231.89</div>
              <p className="text-xs text-zinc-400">
                <span className="text-emerald-400">+20.1%</span> from last month
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
              <span className="text-sm font-medium">Subscriptions</span>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold tracking-tighter">+2350</div>
              <p className="text-xs text-zinc-400">
                <span className="text-emerald-400">+180.1%</span> from last month
              </p>
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
              <div className="text-3xl font-bold tracking-tighter">+12,234</div>
              <p className="text-xs text-zinc-400">
                <span className="text-emerald-400">+19%</span> from last month
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


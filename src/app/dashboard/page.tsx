import Link from "next/link";
import { Stethoscope, Search, TrendingUp, Clock } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      label: "Total Surgeons",
      value: 0,
      icon: Stethoscope,
      color: "text-coral",
    },
    {
      label: "Matches This Week",
      value: 0,
      icon: TrendingUp,
      color: "text-burgundy",
    },
    {
      label: "Pending Reviews",
      value: 0,
      icon: Clock,
      color: "text-warm-grey",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-burgundy text-pirk-heading">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-warm-grey">
          Overview of your surgeon matching platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-coral-mid/30 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warm-grey">
                  {stat.label}
                </p>
                <p className={`mt-2 text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className="rounded-lg bg-coral-light p-3">
                <stat.icon className="h-6 w-6 text-coral" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-near-black mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/surgeons"
            className="bg-coral text-white hover:bg-coral/90 rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-2 transition-colors"
          >
            <Stethoscope className="h-4 w-4" />
            Manage Surgeons
          </Link>
          <Link
            href="/match"
            className="bg-coral text-white hover:bg-coral/90 rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-2 transition-colors"
          >
            <Search className="h-4 w-4" />
            New Match
          </Link>
        </div>
      </div>
    </div>
  );
}

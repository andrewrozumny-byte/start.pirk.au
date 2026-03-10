export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { getProcedureLabel } from "@/config/procedures";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: {
      matches: {
        include: {
          matchSurgeons: {
            include: { surgeon: true },
            orderBy: { rank: "asc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-near-black tracking-tight">
            Clients
          </h1>
          <p className="text-warm-grey text-sm mt-1">
            All clients who have had matches run
          </p>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white rounded-xl border border-coral-mid/30 p-12 text-center">
          <Users className="w-8 h-8 text-coral-mid mx-auto mb-3" />
          <p className="text-near-black font-medium">No clients yet</p>
          <p className="text-warm-grey text-sm mt-1">
            Run your first match to see clients here
          </p>
          <Link
            href="/match"
            className="inline-block mt-4 bg-coral text-white hover:bg-coral/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Run a Match
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-coral-mid/30 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-coral-mid/30">
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-warm-grey font-medium">
                  Client
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-warm-grey font-medium">
                  Procedure
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-warm-grey font-medium">
                  Location
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-warm-grey font-medium">
                  Top Match
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-warm-grey font-medium">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-warm-grey font-medium">
                  Date
                </th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => {
                const latestMatch = client.matches[0];
                const topSurgeon =
                  latestMatch?.matchSurgeons[0]?.surgeon;

                return (
                  <tr
                    key={client.id}
                    className="border-b border-coral-mid/15 hover:bg-cream/50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-near-black">
                        {client.name}
                      </p>
                      <p className="text-xs text-warm-grey">{client.email}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-near-black">
                      {getProcedureLabel(client.procedure)}
                    </td>
                    <td className="px-5 py-3 text-sm text-near-black">
                      {client.location}
                      {client.state ? `, ${client.state}` : ""}
                    </td>
                    <td className="px-5 py-3 text-sm text-near-black">
                      {topSurgeon?.name || "—"}
                    </td>
                    <td className="px-5 py-3">
                      {latestMatch ? (
                        <span
                          className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full ${
                            latestMatch.status === "sent"
                              ? "bg-green-100 text-green-700"
                              : latestMatch.status === "reviewed"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-coral-light text-coral"
                          }`}
                        >
                          {latestMatch.status}
                        </span>
                      ) : (
                        <span className="text-xs text-warm-grey">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-warm-grey">
                      {new Date(client.createdAt).toLocaleDateString(
                        "en-AU"
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {latestMatch && (
                        <Link
                          href={`/match/${latestMatch.id}`}
                          className="text-coral hover:text-coral/80 transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

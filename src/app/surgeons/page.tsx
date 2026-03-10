export const dynamic = "force-dynamic";
import Link from "next/link";
import { Plus, Upload } from "lucide-react";
import { prisma } from "@/lib/db";
import { getProcedureLabel } from "@/config/procedures";
import { SurgeonFilters } from "@/components/surgeons/SurgeonFilters";
import { Suspense } from "react";

interface SurgeonsPageProps {
  searchParams: Promise<{ search?: string; state?: string }>;
}

export default async function SurgeonsPage({ searchParams }: SurgeonsPageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const stateFilter = params.state ?? "";

  const surgeons = await prisma.surgeon.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search } },
                { practiceName: { contains: search } },
                { suburb: { contains: search } },
              ],
            }
          : {},
        stateFilter ? { state: stateFilter } : {},
      ],
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-burgundy text-pirk-heading">
            Surgeons
          </h1>
          <p className="mt-1 text-sm text-warm-grey">
            {surgeons.length} surgeon{surgeons.length !== 1 ? "s" : ""} in
            database
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/surgeons/import"
            className="inline-flex items-center gap-2 rounded-lg border border-coral-mid/30 bg-white px-4 py-2 text-sm font-medium text-near-black hover:bg-coral-light transition-colors"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Link>
          <Link
            href="/surgeons/add"
            className="bg-coral text-white hover:bg-coral/90 rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Surgeon
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-coral-mid/30 p-4">
        <Suspense fallback={null}>
          <SurgeonFilters />
        </Suspense>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-coral-mid/30 overflow-hidden">
        {surgeons.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-warm-grey text-sm">
              {search || stateFilter
                ? "No surgeons match your filters."
                : "No surgeons yet. Add your first surgeon to get started."}
            </p>
            {!search && !stateFilter && (
              <Link
                href="/surgeons/add"
                className="bg-coral text-white hover:bg-coral/90 rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-2 mt-4 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Surgeon
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-coral-mid/20 bg-coral-light/30">
                  <th className="px-4 py-3 text-left font-medium text-warm-grey">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-warm-grey">
                    Practice
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-warm-grey">
                    State
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-warm-grey">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-warm-grey">
                    Procedures
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-warm-grey">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coral-mid/10">
                {surgeons.map((surgeon) => {
                  let procedures: string[] = [];
                  try {
                    procedures = JSON.parse(surgeon.proceduresOffered || "[]");
                  } catch {
                    procedures = [];
                  }

                  return (
                    <tr
                      key={surgeon.id}
                      className="hover:bg-coral-light/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/surgeons/${surgeon.id}`}
                          className="font-medium text-near-black hover:text-coral transition-colors"
                        >
                          {surgeon.name}
                        </Link>
                        {!surgeon.acceptingPatients && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-warm-grey/10 px-2 py-0.5 text-[10px] font-medium text-warm-grey">
                            Not Accepting
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-warm-grey">
                        {surgeon.practiceName || "\u2014"}
                      </td>
                      <td className="px-4 py-3">
                        {surgeon.state ? (
                          <span className="inline-flex items-center rounded-full bg-coral-light px-2.5 py-0.5 text-xs font-medium text-coral">
                            {surgeon.state}
                          </span>
                        ) : (
                          <span className="text-warm-grey">&mdash;</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {surgeon.googleRating > 0 ? (
                          <span className="text-near-black">
                            {surgeon.googleRating.toFixed(1)}
                            <span className="text-warm-grey/60 ml-1 text-xs">
                              ({surgeon.googleReviewCount})
                            </span>
                          </span>
                        ) : (
                          <span className="text-warm-grey">&mdash;</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {procedures.slice(0, 3).map((slug) => (
                            <span
                              key={slug}
                              className="inline-flex items-center rounded-full bg-coral-light px-2 py-0.5 text-[10px] font-medium text-burgundy"
                            >
                              {getProcedureLabel(slug)}
                            </span>
                          ))}
                          {procedures.length > 3 && (
                            <span className="inline-flex items-center rounded-full bg-cream px-2 py-0.5 text-[10px] font-medium text-warm-grey">
                              +{procedures.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/surgeons/${surgeon.id}`}
                          className="text-coral hover:text-coral/80 text-sm font-medium transition-colors"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

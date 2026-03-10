import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import MatchResults from "@/components/results/MatchResults";

interface ResultsPageProps {
  params: Promise<{ matchId: string }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { matchId } = await params;

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          procedure: true,
          tier: true,
        },
      },
      matchSurgeons: {
        include: {
          surgeon: {
            select: {
              id: true,
              name: true,
              practiceName: true,
              suburb: true,
              state: true,
              googleRating: true,
              googleReviewCount: true,
              experienceQualification: true,
              consultWaitTime: true,
              consultCost: true,
              surgeryWaitTime: true,
              paymentPlansAvailable: true,
              paymentPlanDetails: true,
              priceRanges: true,
              beforeAfterAvailable: true,
              website: true,
            },
          },
        },
        orderBy: { rank: "asc" },
      },
    },
  });

  if (!match) {
    notFound();
  }

  return <MatchResults match={match} />;
}

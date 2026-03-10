"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { SurgeonForm, type SurgeonFormData } from "@/components/surgeons/SurgeonForm";
import { Loader2 } from "lucide-react";

export default function EditSurgeonPage() {
  const params = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<SurgeonFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSurgeon() {
      try {
        const res = await fetch(`/api/surgeons/${params.id}`);
        if (!res.ok) {
          throw new Error("Failed to load surgeon");
        }
        const surgeon = await res.json();

        let proceduresOffered: string[] = [];
        try {
          proceduresOffered = JSON.parse(surgeon.proceduresOffered || "[]");
        } catch {
          proceduresOffered = [];
        }

        let priceRanges: Record<string, { min: string; max: string; notes: string }> = {};
        try {
          priceRanges = JSON.parse(surgeon.priceRanges || "{}");
        } catch {
          priceRanges = {};
        }

        setInitialData({
          name: surgeon.name ?? "",
          practiceName: surgeon.practiceName ?? "",
          address: surgeon.address ?? "",
          suburb: surgeon.suburb ?? "",
          state: surgeon.state ?? "",
          postcode: surgeon.postcode ?? "",
          phone: surgeon.phone ?? "",
          website: surgeon.website ?? "",
          yearOfCompletion: surgeon.yearOfCompletion?.toString() ?? "",
          experienceQualification: surgeon.experienceQualification ?? "",
          instagram: surgeon.instagram ?? "",
          tiktok: surgeon.tiktok ?? "",
          proceduresOffered,
          priceRanges,
          consultWaitTime: surgeon.consultWaitTime ?? "",
          consultCost: surgeon.consultCost ?? "",
          secondConsultCost: surgeon.secondConsultCost ?? "",
          surgeryWaitTime: surgeon.surgeryWaitTime ?? "",
          revisionPolicy: surgeon.revisionPolicy ?? "",
          paymentPlansAvailable: surgeon.paymentPlansAvailable ?? false,
          paymentPlanDetails: surgeon.paymentPlanDetails ?? "",
          depositInfo: surgeon.depositInfo ?? "",
          callExperienceNotes: surgeon.callExperienceNotes ?? "",
          followUpNotes: surgeon.followUpNotes ?? "",
          additionalInfo: surgeon.additionalInfo ?? "",
          acceptingPatients: surgeon.acceptingPatients ?? true,
          googleRating: surgeon.googleRating?.toString() ?? "",
          googleReviewCount: surgeon.googleReviewCount?.toString() ?? "",
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load surgeon"
        );
        toast.error("Failed to load surgeon data");
      } finally {
        setLoading(false);
      }
    }
    fetchSurgeon();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-coral" />
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="bg-white rounded-xl border border-coral-mid/30 p-12 text-center">
        <p className="text-warm-grey text-sm">
          {error ?? "Surgeon not found."}
        </p>
      </div>
    );
  }

  return (
    <SurgeonForm
      mode="edit"
      surgeonId={params.id}
      initialData={initialData}
    />
  );
}

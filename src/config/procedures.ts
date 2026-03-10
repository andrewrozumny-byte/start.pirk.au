export const PROCEDURE_CATEGORIES = {
  breast: {
    label: "Breast",
    procedures: [
      { slug: "breast-augmentation", label: "Breast Augmentation" },
      { slug: "breast-lift", label: "Breast Lift" },
      { slug: "breast-reduction", label: "Breast Reduction" },
      { slug: "breast-revision", label: "Breast Revision" },
      { slug: "implant-replacement", label: "Implant Replacement" },
      { slug: "implant-removal", label: "Implant Removal" },
      { slug: "gynaecomastia", label: "Gynaecomastia" },
      { slug: "breast-reconstruction", label: "Breast Reconstruction" },
      { slug: "fat-transfer-breast", label: "Fat Transfer to Breast" },
      { slug: "tuberous-breast", label: "Tuberous Breast Correction" },
    ],
  },
  face: {
    label: "Face",
    procedures: [
      { slug: "facelift", label: "Facelift" },
      { slug: "neck-lift", label: "Neck Lift" },
      { slug: "brow-lift", label: "Brow Lift" },
      { slug: "blepharoplasty", label: "Blepharoplasty (Eyelid)" },
      { slug: "rhinoplasty", label: "Rhinoplasty" },
      { slug: "otoplasty", label: "Otoplasty (Ear)" },
      { slug: "chin-augmentation", label: "Chin Augmentation" },
    ],
  },
  body: {
    label: "Body",
    procedures: [
      { slug: "abdominoplasty", label: "Abdominoplasty (Tummy Tuck)" },
      { slug: "liposuction", label: "Liposuction" },
      { slug: "body-lift", label: "Body Lift" },
      { slug: "arm-lift", label: "Brachioplasty (Arm Lift)" },
      { slug: "thigh-lift", label: "Thigh Lift" },
      { slug: "bbl", label: "Brazilian Butt Lift" },
      { slug: "mummy-makeover", label: "Mummy Makeover" },
    ],
  },
} as const;

export const ALL_PROCEDURES = Object.values(PROCEDURE_CATEGORIES).flatMap(
  (cat) => [...cat.procedures]
);

export function getProcedureLabel(slug: string): string {
  const proc = ALL_PROCEDURES.find((p) => p.slug === slug);
  return proc?.label ?? slug;
}

export const AUSTRALIAN_STATES = [
  { code: "VIC", label: "Victoria" },
  { code: "NSW", label: "New South Wales" },
  { code: "QLD", label: "Queensland" },
  { code: "SA", label: "South Australia" },
  { code: "WA", label: "Western Australia" },
  { code: "TAS", label: "Tasmania" },
  { code: "NT", label: "Northern Territory" },
  { code: "ACT", label: "Australian Capital Territory" },
] as const;

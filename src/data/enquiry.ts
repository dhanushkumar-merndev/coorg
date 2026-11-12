// Shared definition of the enquiry form. The client renders from it and the
// server action validates against it, so only known option values reach the sheet.

export const plotQuestions = [
  { name: "purpose", summary: "Purpose", legend: "What is your primary purpose for buying a plot in Coorg?", options: ["Build a holiday home", "Investment", "Build and rent it out"] },
  { name: "plots", summary: "Number of plots", legend: "How many plots are you looking to buy?", options: ["1 plot", "2 plots", "3 plots", "4 or more plots"] },
  { name: "budget", summary: "Budget", legend: "What is your budget for the plot?", options: ["₹2 Crore – ₹3 Crore", "₹4 Crore – ₹6 Crore", "₹7 Crore – ₹10 Crore", "More than ₹10 Crore"] },
  { name: "visit", summary: "Site visit", legend: "When would you be available for a site visit?", options: ["This week", "Next week", "Within 2–4 weeks"] },
] as const;

export const interestOptions = [
  "Star Garden",
  "Projects",
  "Madikeri Estate",
  "Plantation Estates",
  "Private Hill Retreats",
  "Curated Estate Plots",
  "Forest & Mountain Land",
  "Countryside Homes",
] as const;

export const enquiryLimits = { name: 100, phone: 20, email: 180, note: 3000, page: 200 } as const;

export const phonePattern = /^[+\d\s().-]+$/;
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "").length;
  return phonePattern.test(phone) && digits >= 7 && digits <= 15;
}

export type EnquiryResult = { ok: true } | { ok: false; error: string };

export const CATEGORIES = [
  "Programming",
  "Design",
  "Business",
  "Language",
  "Music",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const LIMITS = {
  title: { min: 3, max: 80 },
  description: { min: 10, max: 500 },
} as const;

export function validateSessionInput(input: {
  title: string;
  description: string;
  category: string;
}) {
  const title = input.title.trim();
  const description = input.description.trim();
  const errors: string[] = [];

  if (title.length < LIMITS.title.min || title.length > LIMITS.title.max) {
    errors.push(`Title must be ${LIMITS.title.min}-${LIMITS.title.max} characters.`);
  }
  if (
    description.length < LIMITS.description.min ||
    description.length > LIMITS.description.max
  ) {
    errors.push(
      `Description must be ${LIMITS.description.min}-${LIMITS.description.max} characters.`
    );
  }
  if (!CATEGORIES.includes(input.category as Category)) {
    errors.push("Invalid category.");
  }

  return {
    ok: errors.length === 0,
    errors,
    value: { title, description, category: input.category },
  };
}
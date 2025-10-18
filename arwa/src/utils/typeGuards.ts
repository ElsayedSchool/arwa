// Type guards for API payloads
export const isNewMainCategory = (data: unknown): data is { name: string } => {
  return (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    typeof (data as Record<string, unknown>).name === "string"
  );
};

export const isNewSubCategory = (
  data: unknown
): data is {
  name: string;
  character: string;
  color: string;
  description?: string;
} => {
  return (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    "character" in data &&
    "color" in data &&
    typeof (data as Record<string, unknown>).name === "string" &&
    typeof (data as Record<string, unknown>).character === "string" &&
    typeof (data as Record<string, unknown>).color === "string" &&
    (!(data as Record<string, unknown>).description ||
      typeof (data as Record<string, unknown>).description === "string")
  );
};

export const isUpdateMainCategory = (
  data: unknown
): data is { name: string } => {
  return isNewMainCategory(data); // Same validation logic
};

export const isUpdateSubCategory = (
  data: unknown
): data is {
  name: string;
  character: string;
  color: string;
  description?: string;
} => {
  return isNewSubCategory(data); // Same validation logic
};

// Generic API response type guard
export const isApiResponse = (data: unknown): data is { data: unknown } => {
  return typeof data === "object" && data !== null && "data" in data;
};

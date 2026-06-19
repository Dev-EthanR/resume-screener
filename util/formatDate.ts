export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

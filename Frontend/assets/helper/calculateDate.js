export const getDate = (date) => {
  if (!date) return null; // handles undefined, null, empty string

  const d = new Date(date);

  if (isNaN(d.getTime())) return null; // invalid date

  return d.toISOString().split("T")[0];
};

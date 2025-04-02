
/**
 * Format date for display (simple format for demo)
 */
export const formatDate = (date: Date | undefined) => {
  if (!date) return "";
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

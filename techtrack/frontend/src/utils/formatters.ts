export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  } catch (e) {
    return dateString;
  }
};
export {};

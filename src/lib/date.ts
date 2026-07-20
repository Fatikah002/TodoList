export function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isSameDay(deadline: string, selectedDate: string) {
  return formatLocalDate(new Date(deadline)) === selectedDate;
}

export function isOverdue(completed: boolean, deadline: string) {
  if (completed) return false;
  const today = formatLocalDate(new Date());
  return formatLocalDate(new Date(deadline)) < today;
}

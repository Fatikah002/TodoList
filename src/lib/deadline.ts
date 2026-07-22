export type DeadlineStatus = "late" | "today" | "tomorrow";

export function getDeadlineStatus(
  deadline: string,
  dueTime?: string
): DeadlineStatus | null {
  const now = new Date();

  const deadlineDate = dueTime
    ? new Date(`${deadline}T${dueTime}:00`)
    : new Date(`${deadline}T23:59:59`);

  if (Number.isNaN(deadlineDate.getTime())) return null;

  // Sudah melewati deadline
  if (deadlineDate < now) {
    return "late";
  }

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const target = new Date(deadlineDate);
  target.setHours(0, 0, 0, 0);

  const diffDays =
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";

  return null;
}
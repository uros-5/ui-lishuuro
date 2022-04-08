export function ServerDate(date: string): Date {
  date = date.split(" +0")[0];
  date = new Date(date);
  const newDate = new Date(date);
  newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return newDate;
}

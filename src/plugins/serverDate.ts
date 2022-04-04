export function ServerDate(date: String): Date {
  date = date.split(" +0")[0];
  date = new Date(date);
  var newDate = new Date(date);
  newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return newDate;
}

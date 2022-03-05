function ServerDate(date: String) {
  date = date.split(" +0")[0];
  date = new Date(date);
  var newDate = new Date(date);
  newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return newDate;
}

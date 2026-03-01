export function formatDate(value) {

  if (!value) return "";
  let date;

  // Firestore Timestamp
  if (typeof value.toDate === "function") {
    date = value.toDate();
  }
  // ISO string or Date
  else {
    date = new Date(value);
  }

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, "0"); // 24-hour
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} - ${hour}:${minute} `;
}

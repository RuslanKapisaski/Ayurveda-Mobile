export const formatDate = (timestamp) => {
  const date = timestamp.toDate();

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, "0"); // 24-hour
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${hour}:${minute} ${day}/${month} ${year}`;
};

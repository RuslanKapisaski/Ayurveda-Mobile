import request from "./request";

export default function fetchPrograms() {
  return request.get("/programs");
}

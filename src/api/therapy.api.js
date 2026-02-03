import request from "./request";

export function fetchTerapies() {
  return request.get("/therapies");
}

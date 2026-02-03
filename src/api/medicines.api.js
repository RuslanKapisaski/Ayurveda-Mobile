import request from "./request";

export default function fetchMedicines() {
  return request.get("/medicines");
}

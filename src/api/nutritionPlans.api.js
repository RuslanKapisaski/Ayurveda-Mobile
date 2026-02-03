import request from "./request";

export default function fetchNutritionPlans() {
  return request.get("/nutritionPlans");
}

import useFetch from "./useFetch";
import { useState } from "react";

import * as appointmentService from "../services/appointmentsService";

export default function useFetchHistory(userId) {
  const [historyOfAppointments, setHistoryOfAppointments] = useState([]);

  const {
    execute: loadHistoryOfAppointments,
    isLoading,
    error,
  } = useFetch(async () => {
    const result = await appointmentService.getHistory(userId);
    setHistoryOfAppointments(result);
  });

  return { historyOfAppointments, loadHistoryOfAppointments, isLoading, error };
}

import { useState } from "react";
import useFetch from "./useFetch";
import * as appointmentService from "../services/appointmentsService";

export default function useFetchCount(userId) {
  const [counts, setCounts] = useState({
    therapies: 0,
    programs: 0,
    checkups: 0,
  });

  const {
    execute: loadCount,
    isLoading,
    error,
  } = useFetch(async () => {
    const { appointmentsCount } = await appointmentService.getCount(userId);
    setCounts({
      therapies: appointmentsCount.therapies,
      programs: appointmentsCount.programs,
      checkups: appointmentsCount.checkups,
    });
  });

  return { counts, loadCount, isLoading, error };
}

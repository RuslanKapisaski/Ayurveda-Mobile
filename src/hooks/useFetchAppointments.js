// hooks/useFetchAppointments.js
import { useState } from "react";
import useFetch from "./useFetch";
import * as appointmentService from "../services/appointmentsService";

export default function useFetchAppointments(userId) {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);

  const {
    execute: loadUpcoming,
    isLoading,
    error,
  } = useFetch(async () => {
    const result = await appointmentService.getUpcommingAppointmets(userId);
    setUpcomingAppointments(result);
  });

  const { execute: loadPast } = useFetch(async () => {
    const result = await appointmentService.getPastAppointmets(userId);
    setPastAppointments(result);
  });

  return {
    upcomingAppointments,
    pastAppointments,
    loadUpcoming,
    loadPast,
    isLoading,
    error,
  };
}

import { useState } from "react";
import useFetch from "./useFetch";
import * as appointmentService from "../services/appointmentsService";

export default function useFetchAppointmentDetails(userId) {
  const [detailedAppointments, setDetailedAppointments] = useState([]);

  const {
    execute: loadDetails,
    isLoading,
    error,
  } = useFetch(async () => {
    const history = await appointmentService.getHistory(userId);

    const details = await Promise.all(
      history.map(async (appointment) => {
        let fetchedDetails = {};

        if (appointment.itemId) {
          const result = await appointmentService.getById(
            appointment.itemId,
            appointment.type,
            userId,
          );
          fetchedDetails = result || {};
        }

        return {
          details: {
            ...fetchedDetails,
            type: appointment.type,
            date: appointment.date,
            doctor: appointment.doctor || null,
          },
        };
      }),
    );

    setDetailedAppointments(details);
  });

  return { detailedAppointments, loadDetails, isLoading, error };
}

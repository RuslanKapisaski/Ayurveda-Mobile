import { useState } from "react";
import useFetch from "./useFetch";
import * as userService from "../services/userService";

export default function useFetchUserData(userId) {
  const [allergies, setAllergies] = useState([]);
  const [firestoreUser, setFirestoreUser] = useState({});

  const {
    execute: loadUserData,
    isLoading,
    error,
  } = useFetch(async () => {
    const result = await userService.getUserData(userId);
    setFirestoreUser(result);
    setAllergies(result.allergies || []);
  });

  return { allergies, firestoreUser, loadUserData, isLoading, error };
}

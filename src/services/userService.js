import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
  and,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../fireBaseConfig";

export async function getUserData(userId) {
  try {

    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error("No user found with the given userId");
    }

    return {
      id: userDocSnap.id,
      ...userDocSnap.data(),
    };
  } catch (error) {
    console.error("Error fetching user info", error);
    throw new Error(`Error during fetching user data: ${error.message}`);
  }
}
export async function setUserAllergies(userId, updatedAllergies) {
  try {
    const docRef = doc(db, "users", userId);

    const docSnap = await getDoc(docRef);

    if (!docSnap.exists) {
      throw new Error("No such user found");
    }

    await updateDoc(docRef, {
      allergies: updatedAllergies,
    });
  } catch (error) {
    console.error("Error setting user allergies", error);
    throw new Error(`Error during setting user allergies, ${error.message}`);
  }
}

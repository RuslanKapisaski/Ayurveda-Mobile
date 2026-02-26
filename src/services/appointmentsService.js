import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  getDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../fireBaseConfig";

export async function create(appointmentData) {
  try {
    const docRef = await addDoc(collection(db, "appointments"), {
      ...appointmentData,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (e) {
    console.error("Error adding appointment: ", e);
    throw new Error(`Failed appointment creation: ${e.message}`);
  }
}

export async function getAllByUser(userId) {
  try {
    const q = query(
      collection(db, "appointments"),
      where("userId", "==", userId),
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error loading user appointments: ", error);
    throw new Error("Failed appointment load: " + error.message);
  }
}

export async function deleteAppointment(appointmentId) {
  try {
    await deleteDoc(doc(db, "appointments", appointmentId));
    return true;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw new Error("Failed to cancel appointment: " + error.message);
  }
}

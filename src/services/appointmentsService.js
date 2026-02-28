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

export async function edit(appointmentData, updates) {
  try {
    const { id } = { ...appointmentData };

    if (!id) {
      throw new Error("Appointment ID is required");
    }

    const docRef = doc(db, "appointments", id);
    await updateDoc(docRef, updates);

    console.log("Appointment updated successfully!");
  } catch (error) {
    console.error(`Error editing appointment:, ${error}`);
    throw new Error(`Failed to edit appointment: ${error.message}`);
  }
}

export async function deleteAppointment(appointmentId) {
  try {
    await deleteDoc(doc(db, "appointments", appointmentId));
    return true;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw new Error(`Failed to cancel appointment: ${error.message}`);
  }
}

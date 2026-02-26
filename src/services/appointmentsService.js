import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../fireBaseConfig";

export async function create(appointmentData) {
  try {
    const docRef = await addDoc(
      collection(db, "appointments"),
      appointmentData,
    );
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding appointment: ", e);
    throw new Error("Failed appointent creation:", e.message);
  }
}

export async function getAllByUser(userId) {
  try {
    const q = query(
      collection(db, "appointments"),
      where("userId", "==", userId),
    );

    const querySnapshot = await getDocs(q);

    const appointments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return appointments;
  } catch (error) {
    console.error("Error loading user appointments: ", error);
    throw new Error("Failed appointment load: " + error.message);
  }
}

export async function deleteAppointment(appointmentId) {
  try {
    await deleteDoc(doc(db, "appointments", appointmentId));
    console.log("Appointment deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw new Error("Failed to cancel appointment: " + error.message);
  }
}

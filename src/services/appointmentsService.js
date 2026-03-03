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
  orderBy,
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

export async function getCount(userId) {
  try {
    const therapiesCountQuery = query(
      collection(db, "appointments"),
      where("userId", "==", userId),
      where("type", "==", "therapy"),
    );

    const programsCountQuery = query(
      collection(db, "appointments"),
      where("userId", "==", userId),
      where("type", "==", "program"),
    );

    const checkupsCountQuery = query(
      collection(db, "appointments"),
      where("userId", "==", userId),
      where("type", "==", "checkup"),
    );

    const therapiesQuerySnapshot = await getDocs(therapiesCountQuery);
    const programsQuerySnapshot = await getDocs(programsCountQuery);
    const checkupsQuerySnapshot = await getDocs(checkupsCountQuery);

    const therapies = therapiesQuerySnapshot.size;
    const programs = programsQuerySnapshot.size;
    const checkups = checkupsQuerySnapshot.size;

    return {
      appointmentsCount: {
        therapies,
        programs,
        checkups,
      },
    };
  } catch (error) {
    console.error("Error loading appointments count:", error);
    throw new Error("Failed to load appointments count: " + error.message);
  }
}

export async function getById(itemId, type, userId) {
  try {
    let itemDetails;

    if (type === "therapy") {
      const therapyDocRef = doc(db, "therapies", itemId);
      const therapyDocSnap = await getDoc(therapyDocRef);

      if (!therapyDocSnap.exists()) {
        throw new Error("Therapy item not found");
      }

      itemDetails = therapyDocSnap.data();
    } else if (type === "program") {
      const programDocRef = doc(db, "programs", itemId);
      const programDocSnap = await getDoc(programDocRef);

      if (!programDocSnap.exists()) {
        throw new Error("Program item not found");
      }

      itemDetails = programDocSnap.data();
    } else if (type === "checkup") {
      const q = query(
        collection(db, "appointments"),
        where("userId", "==", userId),
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error("No checkups found");
      }
      itemDetails = querySnapshot.docs[0].data();
    } else {
      throw new Error("Invalid appointment type");
    }

    return itemDetails;
  } catch (error) {
    console.error(`Error fetching details for ${type}:`, error);
    throw new Error(`Error fetching details: ${error.message}`);
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

export async function getUpcommingAppointmets(userId) {
  try {
    const latestApppointmetsQuery = query(
      collection(db, "appointments"),
      where("userId", "==", userId),
      where("date", ">=", Timestamp.fromDate(new Date())),
    );

    const querySnapshot = await getDocs(latestApppointmetsQuery);

    const upcomingAppointments = [];

    querySnapshot.forEach((doc) => {
      upcomingAppointments.push({ id: doc.id, ...doc.data() });
    });

    return upcomingAppointments;
  } catch (error) {
    console.error(`Erorr fetching upcoming appointments: ${error}`);
    throw new Error(
      `Error during fetching upcoming appointments: ${error.message}`,
    );
  }
}

export async function getPastAppointmets(userId) {
  try {
    const pastAppointmentsQuery = query(
      collection(db, "appointments"),
      where("userId", "==", userId),
      where("date", "<=", Timestamp.fromDate(new Date())),
    );

    const querySnapshot = await getDocs(pastAppointmentsQuery);

    const pastAppointments = [];

    querySnapshot.forEach((doc) => {
      pastAppointments.push({ id: doc.id, ...doc.data() });
    });

    return pastAppointments;
  } catch (error) {
    console.error(`Erorr fetching past appointments: ${error}`);
    throw new Error(
      `Error during fetching past appointments: ${error.message}`,
    );
  }
}

export async function getHistory(userId) {
  try {
    const historyQuery = query(
      collection(db, "appointments"),
      where("userId", "==", userId),
      where("date", "<=", Timestamp.fromDate(new Date())),
      orderBy("date", "desc"),
    );

    const historySnapshot = await getDocs(historyQuery);

    const history = [];

    historySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() });
    });

    return history;
  } catch (error) {
    console.error(`Erorr fetching history of appointments: ${error}`);
    throw new Error(
      `Error during fetching history of appointments: ${error.message}`,
    );
  }
}

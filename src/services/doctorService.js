import { db } from "../fireBaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const getAll = async () => {
  try {
    const doctorsDocRef = collection(db, "doctors");
    const doctorsDocSnap = await getDocs(doctorsDocRef);

    if (doctorsDocSnap.empty) {
      throw new Error("No doctors found");
    }

    const doctors = doctorsDocSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return doctors;
  } catch (error) {
    console.error(`Error during fetching doctors`, error);
    throw new Error(`Error during fetching doctors: ${error.message}`);
  }
};

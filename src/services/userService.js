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
    const userDataQuery = query(
      collection(db, "users"),
      where("uid", "==", userId),
    );

    const userDataSnapshot = await getDocs(userDataQuery);

    if (userDataSnapshot.empty) {
      throw new Error("No user found withthe given userId");
    }

    const firestoreUser = userDataSnapshot.docs[0].data();

    return {
      id: userDataSnapshot.docs[0].id,
      ...firestoreUser,
    };
  } catch (error) {
    console.error("Error fetching dosha info", error);
    throw new Error(
      `Error during fetching dosha of the user, ${error.message}`,
    );
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



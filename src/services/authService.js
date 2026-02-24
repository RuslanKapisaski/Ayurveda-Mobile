import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../fireBaseConfig";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

export async function login(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    throw new Error("Invalid user credentials");
  }
}

export async function register(name, email, password) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(result.user, {
      displayName: name,
    });

    await result.user.reload();

    const docRef = await setDoc(doc(db, "users", result.user.uid), {
      name,
      email,
      currentProgramId: null,
      currentTherapyId: null,
      createdAt: serverTimestamp(),
    });

    return auth.currentUser;
  } catch (e) {
    throw new Error(e.message || "Unsuccessful registration");
  }
}

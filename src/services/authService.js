import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../fireBaseConfig";
import { log } from "firebase/firestore/lite/pipelines";

export async function login(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("logged in:", result);
    return result.user;
  } catch (error) {
    throw new Error(error.message || "Unsuccessful login");
  }
}

export async function register(name, email, password) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });

    return result.user;
  } catch (e) {
    throw new Error(error.message || "Unsuccessful regsitration");
  }
}

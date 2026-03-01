import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../fireBaseConfig";

export async function register(name, email, password) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(result.user, {
      displayName: name,
    });

    const userRef = doc(db, "users", result.user.uid);

    await setDoc(userRef, {
      uid: result.user.uid,
      name,
      email,
      photoURL: null,
      phone: null,
      hasCompletedOnBoarding: false,
      dosha: null,
      allergies: [],
      role: "user",
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return result.user;
  } catch (error) {
    throw new Error(error.message || "Registration failed");
  }
}

export async function login(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);

    const userDoc = await getDoc(doc(db, "users", result.user.uid));

    if (!userDoc.exists()) {
      throw new Error("User document not found");
    }

    return {
      authUser: result.user,
      firestoreUser: userDoc.data(),
    };
  } catch (error) {
    throw new Error("Invalid credentials");
  }
}

export async function getCurrentUserData() {
  const currentUser = auth.currentUser;

  if (!currentUser) return null;

  const userDoc = await getDoc(doc(db, "users", currentUser.uid));

  if (!userDoc.exists()) return null;

  return userDoc.data();
}

export async function completeOnboarding(data) {
  const currentUser = auth.currentUser;

  if (!currentUser) throw new Error("No user logged in");

  const userRef = doc(db, "users", currentUser.uid);

  await updateDoc(userRef, {
    dosha: data.dosha,
    doshaScores: data.doshaScores,
    hasCompletedOnboarding: true,
    updatedAt: serverTimestamp(),
  });
}

export async function logout() {
  await signOut(auth);
}

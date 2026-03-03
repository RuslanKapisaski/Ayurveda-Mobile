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
import { uploadProfileImage } from "./uploadImageService.js";

export async function register(name, email, password, imageUri) {
	try {
		const result = await createUserWithEmailAndPassword(auth, email, password);

		await setDoc(doc(db, "users", result.user.uid), {
			uid: result.user.uid,
			name,
			email,
			photoURL: null,
			hasCompletedOnBoarding: false,
			dosha: null,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		});

		if (imageUri) {
			try {
				const photoURL = await uploadProfileImage(imageUri, result.user.uid);

				await updateDoc(doc(db, "users", result.user.uid), {
					photoURL,
					updatedAt: serverTimestamp(),
				});

				await updateProfile(result.user, { photoURL });
			} catch (uploadError) {
				console.log("Image upload failed but user created");
			}
		}

		return result.user;
	} catch (error) {
		throw error;
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

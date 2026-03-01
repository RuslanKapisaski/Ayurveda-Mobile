import { doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, auth } from "../fireBaseConfig";

export async function saveUserGoals(goals) {
  const user = auth.currentUser;

  if (!user) {
    console.log("No authenticated user");
    return;
  }

  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        goals,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Error saving user goals result:", error);
  }
}

export async function saveDoshaResultToUser(
  dominantDosha,
  doshaPercentages,
  doshaScores,
) {
  const user = auth.currentUser;

  if (!user) {
    console.log("No authenticated user");
    return;
  }

  const doshaResult = {
    dominant: dominantDosha,
    percentages: doshaPercentages,
    scores: doshaScores,
  };

  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        dosha: doshaResult,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Error saving result:", error);
  }
}

export async function setCompleteOnBoardingStatus(user) {
  try {
    await updateDoc(doc(db, "users", user.id), {
      hasCompletedOnBoarding: true,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error setting onBoard completed status: , ${error}`);
  }
}

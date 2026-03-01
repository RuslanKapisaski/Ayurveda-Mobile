import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../fireBaseConfig";

export async function saveDoshaResultToUser(dominantDosha, percentages) {
  const user = auth.currentUser;

  if (!user) {
    console.log("No authenticated user");
    return;
  }
  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        dominantDosha,
        percentages,
        hasCompletedOnBoarding: true,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Error saving result:", error);
  }
}

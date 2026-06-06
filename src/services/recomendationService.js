import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import {db} from "../fireBaseConfig"

async function getByDosha(dosha) {
  const q = query(
    collection(db, "recommendations"),
    where("dosha", "==", dosha),
    where("isActive", "==", true)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

function getTodayKey(){
  return new Date().toISOString().split("T")[0];
};

const getRandomItem = (items) => {
  if (!items || items.length === 0) return null;

  return items[Math.floor(Math.random() * items.length)];
};

export async function getOrCreateDailyRecommendations(userId, dosha) {
  if (!userId || !dosha) return null;

  const dateKey = getTodayKey();

  const dailyQuery = query(
    collection(db, "dailyRecommendations"),
    where("userId", "==", userId),
    where("dateKey", "==", dateKey),
    limit(1)
  );

  const dailySnapshot = await getDocs(dailyQuery);

  if (!dailySnapshot.empty) {
    return {
      id: dailySnapshot.docs[0].id,
      ...dailySnapshot.docs[0].data(),
    };
  }

  const allRecommendations =
    await getByDosha(dosha);

  const food = getRandomItem(
    allRecommendations.filter((rec) => rec.category === "food")
  );

  const lifestyle = getRandomItem(
    allRecommendations.filter((rec) => rec.category === "lifestyle")
  );

  const therapy = getRandomItem(
    allRecommendations.filter((rec) => rec.category === "therapy")
  );

  const dailyRecommendation = {
    userId,
    dateKey,
    dosha,
    recommendations: {
      food,
      lifestyle,
      therapy,
    },
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(
    collection(db, "dailyRecommendations"),
    dailyRecommendation
  );

  return {
    id: docRef.id,
    ...dailyRecommendation,
  };
}
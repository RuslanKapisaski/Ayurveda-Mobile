import { db, storage } from "../fireBaseConfig";
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc,serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export const uploadImage = async (uri, userId) => {
    if (!userId) throw new Error("User ID is undefined")

    const response = await fetch(uri);
    const blob = await response.blob();

    const imageRef = ref(storage, `scans/${userId}/${Date.now()}.jpg`);

    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
};


export const create = async (data) => {
    return await addDoc(collection(db, "scans"), {
        ...data,
        createdAt: serverTimestamp(),
    });
};


export const getAllByUser = async (userId) => {
    const scansQuery = query(
        collection(db, "scans"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    const feedbackQuery = query(
        collection(db, "scan_feedback"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    const [scansSnapshot, feedbackSnapshot] = await Promise.all([
        getDocs(scansQuery),
        getDocs(feedbackQuery),
    ]);

    const scans = scansSnapshot.docs.map(doc => ({
        id: doc.id,
        type: "scan", 
        ...doc.data()
    }));

    const feedbacks = feedbackSnapshot.docs.map(doc => ({
        id: doc.id,
        type: "feedback",  
        food: doc.data().correctFood, 
        ...doc.data()
    }));
    
    return [...scans, ...feedbacks].sort((a, b) => 
        b.createdAt?.seconds - a.createdAt?.seconds
    );
};


export const deleteScanning = async (scanId) => {
    await deleteDoc(doc(db, "scans", scanId));
};

export const createScanFeedback = async (data) => {
    return await addDoc(collection(db, "scan_feedback"), {
        ...data,
        createdAt: new Date(),
    });
};
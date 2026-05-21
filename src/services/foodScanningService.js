import { db, storage } from "../fireBaseConfig";
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export const uploadImage = async (uri, userId) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageRef = ref(storage, `scans/${userId}/${Date.now()}.jpg`);
    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
};


export const create = async (data) => {
    return await addDoc(collection(db, "scans"), {
        ...data,
        createdAt: new Date(),
    });
};


export const getAllByUser = async (userId) => {
    const q = query(
        collection(db, "scans"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const deleteScanning = async (scanId) => {
    await deleteDoc(doc(db, "scans", scanId));
};
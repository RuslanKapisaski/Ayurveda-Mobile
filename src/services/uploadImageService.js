import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../fireBaseConfig";

export async function uploadProfileImage(uri, userId) {
	try {
		const response = await fetch(uri);
		const blob = await response.blob();

		const imageRef = ref(storage, `profileImages/${userId}.jpg`);

		await uploadBytes(imageRef, blob);

		const downloadURL = await getDownloadURL(imageRef);

		return downloadURL;
	} catch (error) {
		console.log("UPLOAD ERROR:", error);
		throw error;
	}
}

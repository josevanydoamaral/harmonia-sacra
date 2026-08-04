import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../lib/firebase";
import { addDoc, collection } from "firebase/firestore";



export interface RawTrackData {
  id: string;
  label: string;
  file: File; 
}

export interface RawSongData {
  title: string;
  composer: string;
  category: string;
  pdfFile: File; 
  tracks: RawTrackData[];
}

export const songService = async (rawData: RawSongData): Promise<string> => {
    
    // PDF Upload
    const pdfRef = ref(storage, `scores/${Date.now()}_${rawData.pdfFile.name}`);
    await uploadBytes(pdfRef, rawData.pdfFile);
    const pdfUrl = await getDownloadURL(pdfRef);

    // Audio Tracks Upload
    const uploadedTracks = await Promise.all(
        rawData.tracks.map(async (track) => {
            const audioRef = ref(storage, `tracks/${Date.now()}_${track.file.name}`);
            await uploadBytes(audioRef, track.file);
            const url = await getDownloadURL(audioRef);

            return {
                id: track.id,
                label: track.label,
                url: url
            }

        })
    );

    // Save on Firestore
    const songDoc = {
        title: rawData.title,
        composer: rawData.composer,
        category: rawData.category,
        pdfUrl: pdfUrl,
        tracks: uploadedTracks,
        createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "songs"), songDoc)
    return docRef.id
}
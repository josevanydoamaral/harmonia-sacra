import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../lib/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import {logger} from "../utils/logger.ts";



export interface RawTrackData {
  id: string;
  label: string;
  file: File | null;
  existingUrl?: string | null;
  // Indicates if user confirmed time lag as intentional
  isIntentionalDelay?: boolean;
}

export interface RawSongData {
  title: string;
  composer: string;
  category: string;
  pdfFile: File | null; 
  existingPdfUrl?: string | null
  tracks: RawTrackData[];
}

export const createSong = async (rawData: RawSongData): Promise<string> => {
    logger.info('SongService', 'A iniciar upload e criação de cântico');
    if (!rawData.pdfFile) {
        throw new Error("O ficheiro PDF é obrigatório para criar um cântico.")
    }
    // PDF Upload
    const pdfRef = ref(storage, `scores/${Date.now()}_${rawData.pdfFile.name}`);
    await uploadBytes(pdfRef, rawData.pdfFile);
    const pdfUrl = await getDownloadURL(pdfRef);

    // Audio Tracks Upload
    const uploadedTracks = await Promise.all(
        rawData.tracks.map(async (track) => {
            if (!track.file) {
                throw new Error(`O ficheiro de áudio para a voz "${track.label}" é obrigatório.`)
            }

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


export const updateSong = async (id: string, songData: RawSongData): Promise<void> => {
    logger.info('SongService', `A atualizar cântico: ${id}`);

    let pdfUrl = songData.existingPdfUrl || null;
    const updatedTracks = await Promise.all(
        songData.tracks.map(async (track) => {
            if (track.file) {
                const storageRef = ref(storage, `tracks/${Date.now()}_${track.file.name}`)
                await uploadBytes(storageRef, track.file)

                const newUrl = await getDownloadURL(storageRef);
                
                if (track.existingUrl) {
                    try {
                        await deleteObject(ref(storage, track.existingUrl));
                    } catch (error) {
                        logger.warn('SongService', 'Ficheiro de áudio antigo não encontrado para remoção', error);
                    }
                }

                return {
                id: track.id,
                label: track.label,
                url: newUrl
            };
            } else {
                return { id: track.id, label: track.label, url: track.existingUrl || '' }
            }
        })
    )

    if (songData.pdfFile) {
        const storageRef = ref(storage, `pdfs/${id}_${songData.pdfFile?.name}`)
        await uploadBytes(storageRef, songData.pdfFile)
        const newUrl = await getDownloadURL(storageRef);
        pdfUrl = newUrl;

        if (songData.existingPdfUrl) {
            try {
                await deleteObject(ref(storage, songData.existingPdfUrl));

            } catch (error) {
                logger.warn('SongService', 'Ficheiro pdf antigo não encontrado para remoção', error);
            }
        }
    }
    
    const docRef = doc(db, 'songs', id);
    await updateDoc(docRef, {
        title: songData.title,
        composer: songData.composer,
        category: songData.category,
        pdfUrl: pdfUrl,
        tracks: updatedTracks
    })
}
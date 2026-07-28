import { useEffect, useState } from "react"
import type { Song } from "../types/song"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../lib/firebase"

export const useSongs = () => {
    const [songs, setSongs] = useState<Song[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)

        const docRef = collection(db, 'songs');

        const unsubscribe = onSnapshot(docRef, 
            (snapshot) => {
                const songsData = snapshot.docs.map((doc) => 
                    ({ id: doc.id, ...doc.data() }) as Song
                )
                setSongs(songsData)
                setLoading(false)
        }, (error) => {
            setError(error.message)
        })
        

        return () => unsubscribe() 
    }, [])

    return { songs, loading, error}
}
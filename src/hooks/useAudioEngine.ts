import { useEffect, useRef, useState } from "react"
import AudioEngine from "../lib/audio/AudioEngine"

export const useAudioEngine = (audioUrls?: Record<string, string>) => {
    const engineRef = useRef<AudioEngine | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!audioUrls || Object.keys(audioUrls).length === 0) return;

        engineRef.current = new AudioEngine();

        engineRef.current.onEndedCallback = () => {
            setIsPlaying(false);
            setElapsedTime(0);
        }

        const loadVoices = async () => {
            await engineRef.current?.loadTracks(audioUrls)
            setIsLoaded(true)
        }

        loadVoices()

        

        return () => {
            engineRef.current?.destroy()
            engineRef.current = null;
        }
    }, [JSON.stringify(audioUrls)])

    useEffect(() => {
        if (!isPlaying) return;

        let frameId: number;

        const loop = () => {
            if (engineRef.current) setElapsedTime(engineRef.current.getElapsedTime())
            frameId = requestAnimationFrame(loop);
        }
        frameId = requestAnimationFrame(loop)

        return () => cancelAnimationFrame(frameId)
    }, [isPlaying])

    const play = async () => {
        await engineRef.current?.play();
        setIsPlaying(true);
    }

    const pause = () => {
        engineRef.current?.pause()
        setIsPlaying(false);
    }

    const seek = (time: number) => {
        engineRef.current?.seek(time);
        setElapsedTime(time);
    }

    const setVolume = (voice: string, value: number) => {
        engineRef.current?.setVolume(voice, value);
    }

    const setMuted = (voice: string, muted: boolean) => {
        engineRef.current?.setMuted(voice, muted);
    }

    const setSolo = (voice: string | null) => {
        engineRef.current?.setSolo(voice);
    }

    const getWaveformData = (voice: string) => {
        return engineRef.current?.getWaveformData(voice) ?? new Float32Array(0)
    }

    const getDuration = () => {
        return engineRef.current?.getDuration() ?? 0;
    }

    

    return {
        isPlaying,
        elapsedTime,
        isLoaded,
        play,
        pause,
        seek,
        setVolume, 
        setMuted, 
        setSolo,
        getWaveformData,
        duration: engineRef.current?.getDuration() ?? 0
    }
}
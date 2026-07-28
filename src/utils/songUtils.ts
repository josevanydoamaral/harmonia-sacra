import type { Song } from "../types/song";

export type AudioStatus = 'Completo' | 'Parcial' | 'Sem áudio';

export const getAudioStatus = (song: Song): AudioStatus => {
    if (!song.audioUrls) return 'Sem áudio';

    // conunt the number of audio files recorded
    const audioCount = Object
        .values(song.audioUrls)
        .filter(Boolean).length;

    if (audioCount === 0) return 'Sem áudio'

    const requiredVoices = typeof song.voices === 'number' ? song.voices : Number(song.voices) || 1;

    if (audioCount >= requiredVoices) return 'Completo';

    return 'Parcial';
};


export interface AudioTrack {
    id: string;
    label: string;
    url?: string;
    isIntentionalDelay?: boolean;
}

export interface Song {
    id: string;
    title: string;
    composer: string;
    category: string;
    tracks: AudioTrack[];
    pdfUrl?: string;
    musicXmlUrl?: string;
}

export interface TrackProps {
    label: string;
    audioUrl?: string;
    volume: number;
    onVolumeChange: (value: number) => void;
    isMuted: boolean;
    onMuteToggle: () => void;
    isSolo: boolean;
    onSoloToggle: () => void;
    pcmData: Float32Array;
    progress: number;
    duration: number;
    onSeek: (time: number) => void
}

export interface AdminActions extends Song {
    onEdit(id: string) : void;
    onDelete(id: string) : void;
}


export const Voices = {
    oneVoice: 1,
    twoVoices: 2,
    threeVoices: 3,
    fourVoices: 4
} as const

export type VoicesType = typeof Voices[keyof typeof Voices]

export interface Song {
    id: string;
    title: string;
    composer: string;
    category: string;
    voices: VoicesType;
}

export interface AdminActions extends Song {
    onEdit(id: string) : void;
    onDelete(id: string) : void;
}
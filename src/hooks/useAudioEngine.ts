export const useAudioEngine = (audioUrls?: Record<string, string>) => {
    return {
        isPlaying: false,
        elapsedTime: 0,
        isLoaded: false,
        play: () => {},
        pause: () => {},
        seek: (_time: number) => {},
        setVolume: (_voice: string, _value: number) => {}, 
        setMuted: (_voice: string, _muted: boolean) => {}, 
        setSolo: (_voice: string | null) => {}
    }
}
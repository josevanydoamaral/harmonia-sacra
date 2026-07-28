class AudioEngine {
    private audioContext: AudioContext | null = null;
    private audioBuffers: Map<string, AudioBuffer> = new Map();
    private sourceNodes: Map<string, AudioBufferSourceNode> = new Map();
    private gainNodes: Map<string, GainNode> = new Map();
    private startTime: number = 0;
    private pauseOffset: number = 0;
    private isPlaying: boolean = false;

    async loadTracks(urls: Record<string, string>): Promise<void>
    {

        return;
    }

    play(): void {

    }

    pause(): void {

    }

    seek(time: number) {

    }

    setVolume(voice: string, value:number): void {

    }

    setMuted(voice: string, muted: boolean) {

    }

    setSolo(voice: string | null): void {

    }

    getElapsedTime(): number {
        return 0;
    }

    destroy(): void {

    }



}
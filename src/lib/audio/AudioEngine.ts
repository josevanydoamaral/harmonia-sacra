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

        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }

        for (const [voice, url] of Object.entries(urls)) {
            try {
                const response = await fetch(url)

                const arrayBuffer = await response.arrayBuffer()

                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

                this.audioBuffers.set(voice, audioBuffer);

                const gainNode = this.audioContext.createGain();

                gainNode.connect(this.audioContext.destination);

                this.gainNodes.set(voice, gainNode);
            } catch (error) {
                
            }

        }
        
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
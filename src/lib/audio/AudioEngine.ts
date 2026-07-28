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

    async play(): Promise<void> {
        if (!this.audioContext || this.audioBuffers.size === 0) {
            return;
        }

        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume()
        }

        for (const sourceNode of this.sourceNodes.values()) {
            try {
                sourceNode.stop();
            } catch(err) {
                
            }
        }
        this.sourceNodes.clear();

        const scheduledStartTime = this.audioContext.currentTime + 0.1;

        for(const [voice, buffer] of this.audioBuffers.entries()) {
            const gainNode = this.gainNodes.get(voice);

            const sourceNode = this.audioContext.createBufferSource();

            sourceNode.buffer = buffer;

            if (gainNode) sourceNode.connect(gainNode);

            sourceNode.start(scheduledStartTime, this.pauseOffset);

            this.sourceNodes.set(voice, sourceNode);
        }

        this.startTime = this.audioContext.currentTime - this.pauseOffset;

        this.isPlaying = true

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
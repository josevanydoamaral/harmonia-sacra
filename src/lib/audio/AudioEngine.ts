import { time } from "console";
import { buffer } from "stream/consumers";

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
        if (!this.isPlaying) return;

        this.pauseOffset = this.getElapsedTime();

        for (const sourceNode of this.sourceNodes.values()) {
            try {
                sourceNode.stop();
            } catch(err) {

            }
        }
        this.sourceNodes.clear()
        this.isPlaying = false;
    }

    seek(time: number): void {
        const wasPlaying = this.isPlaying;

        if (wasPlaying) {
            this.pause()
        }

        this.pauseOffset = Math.max(0, time)

        
        if (wasPlaying) this.play()
        
    }

    setVolume(voice: string, value:number): void {
        const naipe = this.gainNodes.get(voice)
        if (naipe) naipe.gain.value = Math.max(0, Math.min(1, value))
        
    }

    setMuted(voice: string, muted: boolean) {
        const naipe = this.gainNodes.get(voice)
        if (naipe) {
            naipe.gain.value = muted ? 0 : 1;
        }
        
    }

    setSolo(voice: string | null): void {
        for (const [vocalName, gainNode] of this.gainNodes.entries()) {
            if(voice === null) {
                gainNode.gain.value = 1
            } else {
                gainNode.gain.value = voice === vocalName ? 1 : 0
            }
        }   
        
    }

    getElapsedTime(): number {
        if (!this.audioContext) return 0;
        const time = 
            this.isPlaying 
            ? this.audioContext.currentTime - this.startTime 
            : this.pauseOffset

        return time
    }

    destroy(): void {
        this.pause();
        this.audioBuffers.clear();
        this.gainNodes.clear();
        this.sourceNodes.clear();
        this.audioContext?.close()
        this.audioContext = null
    }

    getWaveformData(voice: string): Float32Array {
        const buffer = this.audioBuffers.get(voice)?.getChannelData(0);

        if(buffer) return buffer
        
        return new Float32Array(0)
    }



}
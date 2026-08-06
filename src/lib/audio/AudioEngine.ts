import type { AudioTrack } from "../../types/song";

class AudioEngine {
    private audioContext: AudioContext | null = null;
    private audioBuffers: Map<string, AudioBuffer> = new Map();
    private sourceNodes: Map<string, AudioBufferSourceNode> = new Map();
    private gainNodes: Map<string, GainNode> = new Map();
    private startTime: number = 0;
    private pauseOffset: number = 0;
    private isPlaying: boolean = false;
    private volumes: Map<string, number> = new Map();
    private mutedVoices: Map<string, boolean> = new Map();
    private soloVoice: string | null = null;
    public onEndedCallback: (() => void) | null = null;

    async loadTracks(tracks: AudioTrack[]): Promise<void>
    {

        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }

        for (const track of tracks) {
            try {
                if (!track.url) continue;
                const response = await fetch(track.url)

                const arrayBuffer = await response.arrayBuffer()

                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

                this.audioBuffers.set(track.id, audioBuffer);

                const gainNode = this.audioContext.createGain();

                gainNode.connect(this.audioContext.destination);

                this.gainNodes.set(track.id, gainNode);
            } catch (error) {
                
            }

        }
        
        return;
    }

    private stopAllSourcesImmediately() {
        const now = this.audioContext ? this.audioContext.currentTime : 0;

        for (const [voice, sourceNode] of this.sourceNodes.entries()) {
            const gainNode = this.gainNodes.get(voice);
            
            gainNode?.gain.cancelScheduledValues(now);
            gainNode?.gain.setValueAtTime(0, now);
            sourceNode.onended = null;
            sourceNode.stop(now);
            sourceNode.disconnect();
        }

                    this.sourceNodes.clear();

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
                sourceNode.onended = null
                sourceNode.stop();
                sourceNode.disconnect()
            } catch(err) {
                
            }
        }
        this.sourceNodes.clear();

        const scheduledStartTime = this.audioContext.currentTime + 0.01;

        let endedTracksCount = 0;
        const totalTracks = this.audioBuffers.size;

        for(const [voice, buffer] of this.audioBuffers.entries()) {
            const gainNode = this.gainNodes.get(voice);
            const sourceNode = this.audioContext.createBufferSource();

            sourceNode.buffer = buffer;

            if (gainNode) sourceNode.connect(gainNode);

            sourceNode.start(scheduledStartTime, this.pauseOffset);

            this.sourceNodes.set(voice, sourceNode);

            const isMuted = this.mutedVoices.get(voice) === true;
            const isOtherSolo = this.soloVoice !== null && this.soloVoice !== voice;
            const targetVolume = (isMuted || isOtherSolo) ? 0 : (this.volumes.get(voice) ?? 0.8)

            if (gainNode) {

                gainNode.gain.cancelScheduledValues(scheduledStartTime);
                gainNode.gain.setValueAtTime(0, scheduledStartTime);

                gainNode.gain.linearRampToValueAtTime(targetVolume, scheduledStartTime + 0.005);
            }

            sourceNode.onended = () => {
                if (sourceNode !== this.sourceNodes.get(voice)) {
                    return;
                }
                endedTracksCount++;
                if (endedTracksCount === totalTracks) {
                    this.isPlaying = false;
                    this.pauseOffset = 0;

                    if (this.onEndedCallback) {
                        this.onEndedCallback()
                    }
                }
            }
        }

        this.startTime = scheduledStartTime - this.pauseOffset;
        this.isPlaying = true

    }

    pause(): void {
        if (!this.isPlaying) return;

        
        this.pauseOffset = this.getElapsedTime();
        const now = this.audioContext ? this.audioContext.currentTime : 0;
        
        for (const [voice, sourceNode] of this.sourceNodes.entries()) {
            try {
                const gainNode = this.gainNodes.get(voice);

                if (gainNode) {
                    gainNode.gain.cancelScheduledValues(now);
                    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
                    gainNode.gain.linearRampToValueAtTime(0, now + 0.005);
                }
                sourceNode.stop(now + 0.005);
            } catch(err) {

            }
        }
        this.sourceNodes.clear()
        this.isPlaying = false;
    }

    seek(time: number): void {
        const wasPlaying = this.isPlaying;

        if (wasPlaying) {
            this.stopAllSourcesImmediately()
        }

        this.pauseOffset = Math.max(0, time)

        
        if (wasPlaying) this.play()
        
    }

    private applyGain(voice: string): void {
        const gainNode = this.gainNodes.get(voice);
        if (!gainNode) return;

        const currVolume = this.volumes.get(voice) ?? 1.0;

        if (this.mutedVoices.get(voice) === true || (this.soloVoice !== null && this.soloVoice !== voice)) {
            gainNode.gain.value = 0;
        } else {
            gainNode.gain.value = currVolume;
        }
    }

    setVolume(voice: string, value: number): void {
        this.volumes.set(voice, Math.max(0, Math.min(1, value)))
        this.applyGain(voice);
    }

    setMuted(voice: string, muted: boolean) {
        this.mutedVoices.set(voice, muted)
        this.applyGain(voice);
        
    }

    setSolo(voice: string | null): void {
        this.soloVoice = voice;
        for (const v of this.gainNodes.keys()) {
            this.applyGain(v)
        }   
        
    }

    getElapsedTime(): number {
        if (!this.audioContext) return 0;
        const time = 
            this.isPlaying 
            ? Math.max(this.pauseOffset ,this.audioContext.currentTime - this.startTime) 
            : this.pauseOffset

        return time
    }
    getDuration(): number {
        const firstBuffer = Array.from(this.audioBuffers.values())[0];
        return firstBuffer ? firstBuffer.duration : 0;
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

export default AudioEngine;
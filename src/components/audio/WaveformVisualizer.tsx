import React, { useEffect, useRef } from 'react'
import WaveSurfer from "wavesurfer.js";

interface WaveformVisualizerProps {
    audioBuffer: AudioBuffer;
    height?: number;
    waveColor?: string;
    progressColor?: string;
}




export const WaveformVisualizer = ({ audioBuffer, height= 50, waveColor='#3F3F46', progressColor='#3F3F46' }: WaveformVisualizerProps) => {

    const containerRef = useRef<HTMLDivElement | null>(null)
    const wavesurferRef = useRef<WaveSurfer | null>(null)
    
    
    useEffect(() => {
        if (!containerRef.current || !audioBuffer) return;
    
        const ws = WaveSurfer.create({
            container: containerRef.current,
            height: height,
            waveColor: waveColor,
            progressColor: progressColor,
            interact: false
        })
    
        wavesurferRef.current = ws;
    
        const channelData = audioBuffer.getChannelData(0);

        ws.load('', [channelData], audioBuffer.duration)
        
    
        return () => ws.destroy() 
    }, [audioBuffer, height, waveColor, progressColor])

    return <div ref={containerRef} className='w-full' />
}
import React, { useEffect, useRef } from 'react'

interface WaveformVisualizerProps {
    pcmData: Float32Array;
    progress?: number;
}

const WaveformVisualizer = ({ pcmData, progress = 0 }: WaveformVisualizerProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');

        if (!ctx) return;

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        const barWidth = 2;
        const barGap = 3;
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;

        const totalBars = Math.floor(width / (barWidth + barGap));

        if (pcmData.length === 0) return;

        const samplesPerBar = Math.floor(pcmData.length / totalBars);

        const centerY = height / 2;

        let maxAmplitude = 0;

        for (let j = 0; j < pcmData.length; j++) {
            if (Math.abs(pcmData[j]) > maxAmplitude) maxAmplitude = Math.abs(pcmData[j])

        }

        for (let i = 0; i < totalBars; i++) {

            let maxAmplitude = 0;
            const startSample = i * samplesPerBar;

            for (let j = 0; j < samplesPerBar; j++) {
                const sample = Math.abs(pcmData[startSample + j] || 0);

                if (sample > maxAmplitude) maxAmplitude = sample

            }

            const barHeight = Math.max(2, maxAmplitude * height);

            const x = i * (barWidth + barGap);

            const y = centerY - barHeight / 2;

            const currentBarPercent = i / totalBars

            ctx.fillStyle = currentBarPercent <= progress ? "#d4af37" : "#3F3F46"

            ctx.fillRect(x, y, barWidth, barHeight)

        }


    }, [pcmData, progress])

    return (
        <canvas
            ref={canvasRef}
            className='w-full h-12'
        />
    )
}

export default WaveformVisualizer
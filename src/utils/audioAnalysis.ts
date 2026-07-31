export const detectOnset = (buffer: AudioBuffer, thresholdRatio?: number): number => {
    const samples = buffer.getChannelData(0);

    let maxAmplitude = 0

    for (const sample of samples) {
        const absValue = Math.abs(sample);
        if (absValue > maxAmplitude) maxAmplitude = absValue;
    }

    const threshold = maxAmplitude * (thresholdRatio ?? 0.08);

    const sampleIndex = samples.findIndex((sample) => Math.abs(sample) >= threshold)

    if (sampleIndex === -1) return 0;

    const onSetTime = sampleIndex / buffer.sampleRate;

    return onSetTime;
}

export const fileToAudioBuffer = async (file: File): Promise<AudioBuffer> => {
    const audioCtx = new AudioContext();

    const arrayBuffer = await file.arrayBuffer();

    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    
    await audioCtx.close();
    
    return audioBuffer;
}
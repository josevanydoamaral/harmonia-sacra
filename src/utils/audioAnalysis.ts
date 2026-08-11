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


export const padAudioBuffer = (buffer: AudioBuffer, padSeconds: number): AudioBuffer => {
    const padSamples = Math.round(padSeconds * buffer.sampleRate);

    const newBufferLength = buffer.length + padSamples;

    const newBuffer = new AudioBuffer({
        numberOfChannels: buffer.numberOfChannels,
        length: newBufferLength,
        sampleRate: buffer.sampleRate
    })
    for (let index = 0; index < buffer.numberOfChannels; index++) {
        newBuffer.getChannelData(index).set(buffer.getChannelData(index), padSamples)
    }

    return newBuffer
}

export const urlToAudioBuffer = async (url: string): Promise<AudioBuffer> => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return await audioCtx.decodeAudioData(arrayBuffer);
}

const writeString = (view: DataView, offset: number, str: string): void => {
    for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
    }
};

export const audioBufferToFile = (buffer: AudioBuffer, filename: string): File => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1;
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const numSamples = buffer.length * numChannels;
    const dataByteLength = numSamples * bytesPerSample;
    const headerByteLength = 44;

    const arrayBuffer = new ArrayBuffer(headerByteLength + dataByteLength);
    const view = new DataView(arrayBuffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataByteLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataByteLength, true);

    let offset = 44;
    const channels: Float32Array[] = [];
    for (let i = 0; i < numChannels; i++) {
        channels.push(buffer.getChannelData(i));       
    }

    for (let i = 0; i < buffer.length; i++) {
        for (let channel = 0; channel < numChannels; channel++) {
            const sample = Math.max(-1, Math.min(1, channels[channel][i]));

            const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            view.setInt16(offset, intSample, true);
            offset += 2;
        }
        
    }

    return new File([arrayBuffer], filename, { type: 'audio/wav'});
}
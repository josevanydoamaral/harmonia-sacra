import React, { useEffect, useRef, useState } from 'react'
import { FileMusic, FileUp, Upload, X } from 'lucide-react';
import { detectOnset, fileToAudioBuffer, padAudioBuffer, urlToAudioBuffer } from '../../utils/audioAnalysis';
import { WaveformVisualizer } from '../audio/WaveformVisualizer';
import type { RawSongData } from '../../services/songService';
import type { Song } from '../../types/song';

interface DraftTrack {
    id: string;
    label: string;
    file: File | null;
    url?: string | null;
    audioBuffer: AudioBuffer | null;
    isIntentionalDelay?: boolean;
}

interface SongModalProps {
    isOpen: boolean;
    initialData?: Song | null;
    onClose: () => void;
    onSave: (SongData: RawSongData) => Promise<void>;
}

const SongModal = ({ isOpen, onClose, onSave, initialData }: SongModalProps) => {

    const [title, setTitle] = useState('')
    const [composer, setComposer] = useState('')
    const [category, setCategory] = useState('')

    const [pdfFile, setPdfFile] = useState<File | null>(null)

    const [tracks, setTracks] = useState<DraftTrack[]>([]);
    const validTracksCount = tracks.filter(track => track.file !== null).length;

    const [existingUrl, setExistingUrl] = useState<string | null>(null);

    const audioCtxRef = useRef<AudioContext | null>(null);
    const sourcesRef = useRef<AudioBufferSourceNode[]>([]);

    const [isPlaying, setIsPlaying] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false;

        if (initialData) {
            setTitle(initialData.title);
            setComposer(initialData.composer);
            setCategory(initialData.category);
            setExistingUrl(initialData.pdfUrl ?? null);
            setPdfFile(null);
            const tr =
                initialData.tracks?.map(track => ({
                    id: track.id,
                    label: track.label,
                    file: null,
                    audioBuffer: null,
                    url: track.url,
                    isIntentionalDelay: track.isIntentionalDelay ?? false
                })) ?? []
            setTracks(tr)

            initialData.tracks?.forEach(async (track) => {
                if (track.url) {
                    try {
                        const buffer = await urlToAudioBuffer(track.url);
                        setTracks((prevTracks) =>
                            prevTracks.map((t) => (t.id === track.id ? { ...t, audioBuffer: buffer } : t))
                        );
                    } catch (err) {
                        console.error(`Erro ao carregar buffer da faixa ${track.label}`, err)
                    }
                }
            });

        } else {
            resetForm()
        }

        return () => {
            isCancelled = true;
        }

    }, [initialData, isOpen])

    const handleAddTrack = () => {
        const track = {
            id: crypto.randomUUID(),
            label: '',
            file: null,
            audioBuffer: null
        }

        setTracks([...tracks, track])
    }

    const handleRemoveTrack = (id: string) => {
        setTracks((items) =>
            items.filter((item) => item.id !== id)
        )
    }

    const handleLabelChange = (id: string, label: string) => {

        setTracks((tracks) =>
            tracks.map((track) => {
                if (track.id === id) {
                    return { ...track, label: label }
                }
                return track
            })
        )
    }

    const handleFileChange = async (id: string, file: File | null) => {
        const buffer = file ? await fileToAudioBuffer(file) : null

        setTracks((tracks) =>
            tracks.map((track) => {
                if (track.id === id) {
                    return { ...track, file: file, audioBuffer: buffer }
                }
                return track
            })
        )
    }

    const handleAlignTracks = () => {
        if (tracksToAnalyze.length < 2) return;

        const maxOnset = Math.max(...tracksToAnalyze.map((t) => detectOnset(t.audioBuffer!)));

        setTracks((prevTracks) =>
            prevTracks.map((track) => {
                if (!track.audioBuffer) return track;

                const currentOnset = detectOnset(track.audioBuffer);
                const delay = maxOnset - currentOnset;

                // If the delay is significant (Greather than 5ms)
                if (delay > 0.005) {
                    const paddedBuffer = padAudioBuffer(track.audioBuffer, delay);
                    return { ...track, audioBuffer: paddedBuffer };
                }
                return track;
            })
        )
    }

    const handleSubmit = async () => {
        if (!isFormValid || isSubmitting) return;

        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const songData = {
                title,
                composer,
                category,
                pdfFile,
                existingPdfUrl: existingUrl,
                tracks: tracks.map(t => ({
                    id: t.id,
                    label: t.label,
                    file: t.file,
                    existingUrl: t.url,
                    isIntentionalDelay: t.isIntentionalDelay
                })),
            }

            await onSave(songData);
            resetForm();
            onClose();

        } catch (error) {
            console.error(error)
            setErrorMessage("Erro ao guardar o cântico. Tente novamente!");
        } finally {
            setIsSubmitting(false);
        }


    }
    const handleClose = () => {
        resetForm();
        onClose();
    }

    const resetForm = () => {
        setTitle('');
        setComposer('');
        setCategory('');
        setPdfFile(null);
        setExistingUrl(null);
        setTracks([]);
        setErrorMessage(null);
        setIsPlaying(false);
    };

    const toggleIntentionalDelay = (id: string) => {
        setTracks((prevTracks) =>
            prevTracks.map((t) => (t.id === id ? { ...t, isIntentionalDelay: !t.isIntentionalDelay } : t))
        );
    }

    const togglePlayAll = () => {
        if (isPlaying) {
            sourcesRef.current.forEach((source) => {
                try { source.stop(); } catch { }
            });

            sourcesRef.current = [];
            setIsPlaying(false);
            return;
        }

        if (tracksToAnalyze.length === 0) return;

        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const ctx = audioCtxRef.current;

        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const newSources: AudioBufferSourceNode[] = [];

        tracksToAnalyze.forEach((track) => {
            if (!track.audioBuffer) return;

            const source = ctx.createBufferSource();
            source.buffer = track.audioBuffer;
            source.connect(ctx.destination);
            newSources.push(source);
        });

        sourcesRef.current = newSources;

        const starTime = ctx.currentTime + 0.05;
        newSources.forEach((source) => source.start(starTime));
        setIsPlaying(true)

        const maxDuration = Math.max(...tracksToAnalyze.map((t) => t.audioBuffer?.duration || 0));

        setTimeout(() => {
            setIsPlaying(false);
        }, maxDuration * 1000);
    }

    const tracksToAnalyze = tracks.filter((track) => track.audioBuffer !== null && !track.isIntentionalDelay);

    const onsets = tracksToAnalyze.map((track) => detectOnset(track.audioBuffer!));

    const maxOnset = onsets.length > 0 ? Math.max(...onsets) : 0;
    const minOnset = onsets.length > 0 ? Math.min(...onsets) : 0;

    const maxDelta = onsets.length > 1 ? maxOnset - minOnset : 0;

    const isMisaligned = maxDelta > 0.15;

    const isFormValid =
        title.trim().length > 0 &&
        composer.trim().length > 0 &&
        category.trim().length > 0 &&
        (pdfFile !== null || existingUrl !== null) &&
        tracks.length >= 1 &&
        tracks.every(t => (t.file !== null || !!t.url) && t.label.trim().length > 0) &&
        !isMisaligned;

    const alignmentStatusText = tracksToAnalyze.length < 2
        ? `${tracks.length} vozes adicionadas - Alinhamento disponível a partir de 2 faixas`
        : isMisaligned
            ? `Aviso: Desalinhamento detetado (~${Math.round(maxDelta * 1000)}ms)`
            : 'Vozes perfeitamente alinhadas';


    const alignmentStatusColor = tracksToAnalyze.length < 2
        ? 'text-card-text/50'
        : isMisaligned
            ? 'text-amber-600'
            : 'text-emerald-600';

    if (!isOpen) return null;

    return (
        <div className='flex items-center justify-center fixed inset-0 bg-base-surface/80 backdrop-blur-sm z-50'>

            <div className='flex flex-col max-w-3xl w-full max-h-[90vh] bg-base-surface border border-border-subtle rounded-3xl shadow-2xl p-8'>
                <header>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className='text-2xl text-accent-gold font-serif'>{!initialData ? 'Adicionar Cântico' : `Editar: ${initialData.title}`}</h2>
                        <button onClick={handleClose}><X className='text-text-main hover:cursor-pointer hover:text-red-400 transition' width={40} height={40} /></button>
                    </div>
                </header>
                <section className='flex-1 overflow-y-auto modal-scroll-body pr-2 py-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        <div>
                            <label className='text-md text-card-text/60 mb-1.5 block' htmlFor="title">Título</label>
                            <input className='w-full bg-card-surface border border-border-subtle rounded-xl text-sm text-card-text/60 px-4 py-3 focus:outline-none focus:border-accent-gold placeholder:text-card-text/50' type="text" placeholder='Ex.: O Cordeiro que foi imolado' value={title} onChange={(e) => setTitle(e.target.value)} id='title' />
                        </div>
                        <div>
                            <label className='text-md text-card-text/60 mb-1.5 block' htmlFor="compositor">Compositor</label>
                            <input className='w-full bg-card-surface px-4 py-3 rounded-xl border border-border-subtle text-card-text/60 text-sm focus:outline-none focus:border-accent-gold placeholder:text-card-text/50' type="text" id='compositor' placeholder='A. Cartageno' value={composer} onChange={(e) => setComposer(e.target.value)} />
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label className='text-md text-card-text/60 mb-1.5 block' htmlFor="category">Categoria</label>
                        <input className='w-full bg-card-surface px-4 py-3 rounded-xl border border-border-subtle placeholder:text-card-text/50 text-card-text/60 text-sm focus:outline-none focus:border-accent-gold' type="text" id='category' placeholder='Páscoa' value={category} onChange={(e) => setCategory(e.target.value)} />
                    </div>
                    <label className='text-md text-card-text/60 mb-1.5 block' htmlFor="pdfUploader">Partitura (PDF)</label>
                    <div className='flex items-center justify-between gap-4 mb-4 bg-card-surface p-4 rounded-xl border border-dashed border-border-subtle hover:border-accent-gold transition'>
                        <div className='flex items-center justify-between gap-3'>
                            <FileUp className='text-accent-gold' />
                            <span className='text-card-text/50'>
                                {pdfFile
                                    ? pdfFile.name
                                    : existingUrl
                                        ? "Partitura existente carregada (.pdf)."
                                        : "Clicar ou arrastar o ficheiro .pdf"
                                }
                            </span>
                        </div>
                        <div className='flex items-center justify-end'>
                            <label className='text-accent-gold font-medium hover:cursor-pointer hover:underline'>{pdfFile || existingUrl ? "Substituir" : "Procurar"}
                                <input
                                    type='file'
                                    accept='application/pdf'
                                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                                    className='hidden'
                                />
                            </label>
                        </div>
                    </div>
                    <div className="flex items center justify-between mb-3 pt-2">
                        <label className='text-md text-card-text/60 mb-1.5 block' htmlFor="">Faixas de áudio por voz</label>
                        <button className='font-semibold text-sm text-accent-gold border border-accent-gold/50 hover:border-accent-gold cursor-pointer px-4 py-1 rounded-lg transition' onClick={handleAddTrack}>+ Adicionar Voz</button>
                    </div>
                    <section className='space-y-3 mb-1'>
                        {tracks.length === 0
                            ? <span className='text-md text-card-text/60 mb-1.5 block'>Nenhuma voz adicionada. Clica em "+ Adicionar voz" para começar</span>
                            : tracks.map(track =>
                                <div key={track.id} className={`flex flex-col gap-3 mb-4  p-4 rounded-xl border  border-border-subtle hover:border-accent-gold transition ${track.file ? 'bg-card-surface' : 'border-dashed'}`}>
                                    <div className='flex items-center justify-between w-full'>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                value={track.label}
                                                onChange={(e) => handleLabelChange(track.id, e.target.value)}
                                                placeholder='Nome da voz'
                                                className='w-36 p-1.5 placeholder:text-card-text/50 text-card-text text-md font-medium outline-none shadow-md px-4 rounded-lg border-b border-accent-gold/50'
                                            />
                                            {track.file
                                                ? <FileMusic className='text-accent-gold' />
                                                : <Upload className='text-card-text/50' />}
                                            <label className='text-card-text/50 hover:cursor-pointer'>{track.file ? track.file.name : "Clicar ou arrastar para adicionar ficheiro .mp3"}
                                                <input
                                                    type='file'
                                                    accept='audio/*'
                                                    onChange={(e) => handleFileChange(track.id, e.target.files?.[0] || null)}
                                                    className='hidden'
                                                />
                                            </label>
                                        </div>
                                        <button onClick={() => handleRemoveTrack(track.id)}>
                                            <X className='text-card-text/50 hover:text-red-400 hover:cursor-pointer transition' />
                                        </button>
                                    </div>
                                    {track.audioBuffer &&
                                        <div className='mt-3 w-full'>
                                            <WaveformVisualizer audioBuffer={track.audioBuffer} />
                                            <button
                                                type='button'
                                                onClick={() => toggleIntentionalDelay(track.id)}
                                                className={`self-start text-xs px-2.5 py-1 rounded-md transition flex items-center gap-1.5 hover:cursor-pointer ${track.isIntentionalDelay
                                                        ? 'text-accent-gold bg-accent-gold/10 border border-accent-gold/30 font-medium'
                                                        : 'text-card-text/60 hover:text-card-text border border-transparent'
                                                    }`}
                                            >
                                                {track.isIntentionalDelay ? '✓ Entrada intencional' : '+ Marcar como atraso intencional'}
                                            </button>
                                        </div>
                                    }
                                </div>
                            )
                        }
                    </section>
                </section>
                <footer>
                    <div className='pt-1 text-card-text/50 flex items-center gap-2'>
                        <span className={`${alignmentStatusColor}`}>
                            &#128712;
                        </span>
                        <span className={`${alignmentStatusColor}`}>
                            {alignmentStatusText}
                        </span>
                        {tracksToAnalyze.length >= 2 && isMisaligned && (
                            <button
                                type='button'
                                onClick={handleAlignTracks}
                                className='text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 px-3 py-1 rounded-lg font-medium transition cursor-pointer'

                            >
                                Alinhar faixas
                            </button>
                        )
                        }
                        {tracksToAnalyze.length > 0 && (
                            <button
                                type='button'
                                onClick={togglePlayAll}
                                className='flex items-center gap-2 bg-accent-gold/10 text-accent-gold border border-accent-gold/30 hover:bg-accent-gold/20 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer'
                            >
                                {isPlaying ? '⏸️ Parar Preview' : '▶️ Ouvir Cântico'}
                            </button>
                        )
                        }
                    </div>
                    {errorMessage &&
                        <p className='text-red-400 text-sm'>{errorMessage}</p>
                    }
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        className=
                        {`w-full py-3.5 rounded-xl mt-8 text-lg font-semibold ${!isFormValid
                            ? 'bg-card-surface text-card-text/30 cursor-not-allowed border border-border-subtle'
                            : 'bg-accent-gold text-black hover:brightness-110 cursor-pointer'
                            }`}>{
                            isSubmitting
                                ? 'A guardar cântico...'
                                : 'Guardar cântico'}
                    </button>
                </footer>
            </div>
        </div>
    )
}

export default SongModal
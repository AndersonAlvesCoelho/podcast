import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'

import { usePlayer } from '../../contexts/PlayerContexts';
import styles from './styles.module.scss';
import { ConvertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {

    const audioRef = useRef<HTMLAudioElement>(null); // pode manupular components nativos do HTML
    const [progress, setProgress] = useState(0);

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        hastNext,
        hastPrevious,
        isLooping,
        isShuffling,

        togglePlay,
        toggleLoop,
        toggShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        clearPlayerState

    } = usePlayer();

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }

    }, [isPlaying])

    function setProgressListener() {
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if (hastNext) {
            playNext();
        } else {
            clearPlayerState();
        }
    }

    const episode = episodeList[currentEpisodeIndex];

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                    />

                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''} >
                <div className={styles.progress}>
                    <span>{ConvertDurationToTimeString(progress)}</span>

                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04D361' }}
                                railStyle={{ backgroundColor: '#9F75FF' }}
                                handleStyle={{ borderColor: '#04D361', borderWidth: 4 }}
                            />
                        ) : < div className={styles.emptySlider} />}
                    </div>
                    <span>{ConvertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>
                {episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        loop={isLooping}
                        autoPlay
                        onEnded={handleEpisodeEnded}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedData={setProgressListener}
                    />
                )}

                {/* CONTROLLER PLAYER  */}
                <div className={styles.buttons}>
                    <button type="button" onClick={toggShuffle} className={isShuffling ? styles.isActive : ''} disabled={!episode || episodeList.length === 1}><img src="/shuffle.svg" alt="Embaralhar" /></button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hastPrevious}><img src="/play-previous.svg" alt="Tocar anterior" /></button>
                    <button
                        type="button"

                        className={styles.playButton}
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                        {isPlaying ? <img src="/pause.svg" alt="Tocar" /> : <img src="/play.svg" alt="Tocar" />}
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hastNext}><img src="/play-next.svg" alt="Tocar próximo" /></button>
                    <button type="button" onClick={toggleLoop} className={isLooping ? styles.isActive : ''} disabled={!episode}><img src="/repeat.svg" alt="Repetir" /></button>
                </div>
            </footer>
        </div >
    )
}
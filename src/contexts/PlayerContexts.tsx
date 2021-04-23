import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    hastNext: boolean;
    hastPrevious: boolean;
    isLooping: boolean;
    isShuffling: boolean;

    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggShuffle: () => void;
    clearPlayerState: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData);

// -------------------------------------------------------------------------

type PlayerContextProviderProps = {
    children: ReactNode;
}
export function PlayerContextProvider({ children }) {

    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    const hastNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
    const hastPrevious = currentEpisodeIndex > 0;

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }

    function toggShuffle() {
        setIsShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    function playNext() {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);

            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        } else if (hastNext) setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }

    function playPrevious() {
        if (hastPrevious) setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }

    function clearPlayerState() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    return (
        <PlayerContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                isPlaying,
                hastNext,
                hastPrevious,
                isLooping,
                isShuffling,

                play,
                playList,
                playNext,
                playPrevious,
                togglePlay,
                toggleLoop,
                toggShuffle,
                setPlayingState,
                clearPlayerState
            }}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}
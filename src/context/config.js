import { Audio } from "expo-av";
import { createContext, useState } from "react";
export const ConfigContext = createContext();

export default function ConfigContextProvider({ children }) {
  const [musics, setMusics] = useState([]);
  const [music, setMusic] = useState();
  const [isPlay, setIsPlay] = useState(false);
  const [bgMusicInfo, setBgMusicInfo] = useState();
  const [backgroudMusicState, setBackgroudMusicState] = useState(false);
  const [artists, setArtists] = useState([]);

  const stopSound = async () => {
    await music.stopAsync();
  };

  const playSound = async (item) => {
    if (music) {
      await music.stopAsync();
    }
    const { sound } = await Audio.Sound.createAsync({ uri: item.uri });
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
    });
    setBgMusicInfo(item);
    setMusic(sound);
    await sound.playAsync();
  };

  const contextValue = {
    musics,
    setMusics,
    music,
    setMusic,
    isPlay,
    setIsPlay,
    stopSound,
    bgMusicInfo,
    setBgMusicInfo,
    playSound,
    backgroudMusicState,
    setBackgroudMusicState,
    artists,
    setArtists,
  };

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
}

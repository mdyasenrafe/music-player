import { StatusBar } from "expo-status-bar";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function App() {
  const [musics, setMusics] = useState([]);
  const [sound, setSound] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredMusics, setFilteredMusics] = useState([]);
  const [isPlay, setIsPlay] = useState(false);

  useEffect(() => {
    getPermissionAsync();
  }, []);

  const getPermissionAsync = async () => {
    const permission = await MediaLibrary.getPermissionsAsync();
    if (permission.granted) {
      let media = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
      });
      media = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
        first: media.totalCount,
      });

      const songsWithArtistInfo = await Promise.all(
        media.assets.map(async (song) => {
          const { filename, duration, uri } = song;
          const assetInfo = await MediaLibrary.getAssetInfoAsync(song);

          const artist = assetInfo?.artist ?? "Unknown Artist";

          return {
            filename,
            artist,
            duration,
            uri,
          };
        })
      )
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log(err);
        });
      setMusics(songsWithArtistInfo);
    }
    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();
      console.log(status, canAskAgain);
    }
  };

  const playSound = async (music) => {
    console.log(music);
    const { sound } = await Audio.Sound.createAsync({ uri: music.uri });
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
    });
    setSound(sound);
    await sound.playAsync();
  };

  useEffect(() => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate((status) => {
        setIsPlay(status.isPlaying);
      });
    }
  }, [sound]);

  const stopSound = async () => {
    await sound.stopAsync();
  };

  const secondToMin = (second) => {
    let min = Math.floor(second / 60);
    let sec = Math.floor(second % 60);
    let hour = Math.floor(min / 60);
    return `${hour}:${min}:${sec}`;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          {musics.map((music) => {
            return (
              <View
                key={music.uri}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Text>{music.filename}</Text>
                <Text>{music.artist}</Text>

                <Text>{secondToMin(music.duration)}</Text>
                <View
                  style={{
                    marginLeft: 16,
                  }}
                >
                  {isPlay ? (
                    <TouchableOpacity onPress={stopSound}>
                      <Feather name="pause-circle" size={24} color="black" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => playSound(music)}>
                      <Feather name="play-circle" size={24} color="black" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
});

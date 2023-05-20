import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { Audio } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function Music() {
  const [musics, setMusics] = useState([]);
  const [sound, setSound] = useState(null);
  const [isPlay, setIsPlay] = useState(false);
  console.log(musics);

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
          {/* {musics.map((music) => {
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
          })} */}
          <Text style={styles.title}>Musics</Text>
          <FlatList
            data={musics}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.songItem}>
                <Text>{item.filename}</Text>
                <Text>{item.artist}</Text>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  albumArt: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 14,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  closeButtonText: {
    fontSize: 16,
    color: "blue",
  },
  albumArtContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: {
    width: "100%",
    paddingHorizontal: 16,
  },
  slider: {
    marginTop: 16,
  },
  durationText: {
    textAlign: "right",
  },
});

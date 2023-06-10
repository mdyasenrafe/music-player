import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MusicController from "./MusicController";
import { Audio } from "expo-av";
import MusicInfo from "expo-music-info";
import OwnText from "../components/text/OwnText";
import { Typography } from "../theme/Typography";

export default function Music() {
  const [musics, setMusics] = useState([]);
  const [isPlay, setIsPlay] = useState(false);
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    getPermissionAsync();
  }, []);

  const getPermissionAsync = async () => {
    setLoading(true);
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
          const { duration, uri, filename } = song;
          let metadata = await MusicInfo.getMusicInfoAsync(song.uri, {
            title: true,
            artist: true,
            album: true,
            genre: true,
            picture: true,
          });

          return {
            ...metadata,
            duration,
            uri,
            filename,
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
      setLoading(false);
    }
    if (!permission.granted && permission.canAskAgain) {
      setLoading(false);
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();
    }
  };

  const playSound = async (music) => {
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
  const tabDatas = ["Suggested", "Songs", "Artists", "Genres"];
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title}>Musics</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabDatas.map((tab, index) => (
            <TouchableOpacity key={index} onPress={() => setSelectedTab(index)}>
              <Text
                style={{
                  marginRight: 16,
                  fontSize: 16,
                  color: selectedTab === index ? "#FF8216" : "black",
                  fontFamily: Typography.regular,
                  fontWeight: "400",
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <View style={styles.loading_container}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={musics}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <MusicController
                item={item}
                stopSound={stopSound}
                playSound={playSound}
                isPlay={isPlay}
              />
            )}
            style={{ marginVertical: 26 }}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loading_container: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
});

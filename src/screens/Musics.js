import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MusicInfo from "expo-music-info";
import { Typography } from "../theme/Typography";
import useContextProvider from "../context/useContextProvider";
import Music from "../components/Music";

export default function Musics() {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const { music, setMusic, setBgMusicInfo, setIsPlay } = useContextProvider();

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

  const tabDatas = ["Suggested", "Songs", "Artists", "Genres"];

  useEffect(() => {
    if (music) {
      music.setOnPlaybackStatusUpdate((status) => {
        setIsPlay(status.isPlaying);
      });
    }
  }, [music]);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 16,
        }}
      >
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
      </View>
      <ScrollView>
        {loading ? (
          <View style={styles.loading_container}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          musics.map((music, index) => (
            <Music
              key={index}
              item={music}
              show={false}
              musics={musics}
              index={index}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    height: "100%",
  },
  loading_container: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
});

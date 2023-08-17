import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../theme/theme";
import useContextProvider from "../context/useContextProvider";
import MusicInfo from "expo-music-info";
import * as MediaLibrary from "expo-media-library";

export default function Splash({ navigation }) {
  const { setMusics, setArtists } = useContextProvider();
  const [loading, setLoading] = useState(true);

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
      let artists = {};
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
          //   {artists :[{metadata}] , "artist" : [{metadata}["artist"]]}
          if (metadata?.artist) {
            if (!artists[metadata.artist]) {
              artists[metadata.artist] = [];
              artists[metadata.artist].push(metadata);
            } else {
              artists[metadata.artist].push(metadata);
            }
          }
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
      setArtists(artists);

      setMusics(songsWithArtistInfo);
      setLoading(false);
    }
    if (!permission.granted && permission.canAskAgain) {
      setLoading(false);
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();
    }
  };

  useEffect(() => {
    if (!loading) {
      navigation.navigate("Music");
    }
  }, [loading]);
  return (
    <View style={styles.container}>
      {loading ? (
        <LoadingSpinner size={"large"} color={"#FF8216"} />
      ) : (
        <Text>Loaded</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
});

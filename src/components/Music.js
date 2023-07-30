import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import useContextProvider from "../context/useContextProvider";
import OwnText from "./text/OwnText";
import { useNavigation } from "@react-navigation/native";
import { secondToMin } from "../utils/MinFunction";

export default function Music({ item, show, musics, index }) {
  const { playSound, isPlay, stopSound } = useContextProvider();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={[
        styles.songItem,
        {
          marginBottom: show ? 0 : 16,
        },
      ]}
      onPress={() =>
        navigation.navigate("MusicController", {
          music: item,
          musics: musics,
          index: index,
        })
      }
    >
      <Image
        source={{
          uri: item?.picture?.pictureData
            ? item?.picture?.pictureData
            : "https://i.ibb.co/FDjxXYr/image.png",
        }}
        style={styles.albumArt}
      />
      <View style={styles.songInfo}>
        <View>
          <OwnText
            preset="p"
            style={{
              color: show ? "black" : "black",
            }}
          >
            {item?.title ? item?.title : item?.filename}
          </OwnText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: 20,
              alignItems: "center",
            }}
          >
            <OwnText
              preset="small"
              style={{
                color: "#616161",
              }}
            >
              {item?.artist
                ? item?.artist.length > 20
                  ? `${item?.artist.substring(0, 20)}...`
                  : item?.artist
                : "Unknown Artist"}
            </OwnText>
            <View style={styles.borderRight} />
            <OwnText
              preset="small"
              style={{
                color: "#616161",
              }}
            >
              {secondToMin(item?.duration)}mins
            </OwnText>
          </View>
        </View>
        {show && (
          <Feather
            name={isPlay ? "pause-circle" : "play-circle"}
            size={30}
            color="black"
            onPress={isPlay ? stopSound : () => playSound(item)}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  borderRight: {
    borderRightColor: "gray",
    borderRightWidth: 1,
    height: 15,
    marginHorizontal: 8,
  },
  albumArt: {
    width: 60,
    height: 60,
    marginRight: 16,
    borderRadius: 8,
  },
  songInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
  },
});

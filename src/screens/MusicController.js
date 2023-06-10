import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import OwnText from "../components/text/OwnText";

export default function MusicController({
  item,
  isPlay,
  playSound,
  stopSound,
}) {
  const secondToMin = (second) => {
    let min = Math.floor(second / 60);
    let sec = Math.floor(second % 60);
    let hour = Math.floor(min / 60);
    if (hour === 0) {
      if (min < 10) {
        min = `0${min}`;
      }
      if (sec < 10) {
        sec = `0${sec}`;
      }
      return `${min}:${sec} mins`;
    }

    return `${hour}:${min}:${sec} mins`;
  };

  return (
    <TouchableOpacity
      style={styles.songItem}
      onPress={isPlay ? () => stopSound() : () => playSound(item)}
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
          <OwnText preset="p">
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
              {secondToMin(item?.duration)}
            </OwnText>
          </View>
        </View>
        <View>
          <Feather
            name={isPlay ? "pause-circle" : "play-circle"}
            size={24}
            color="black"
          />
        </View>
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

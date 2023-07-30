import { StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import OwnText from "../components/text/OwnText";
import useContextProvider from "../context/useContextProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCREEN_WIDTH } from "../theme/theme";
import { useState, useEffect } from "react";
import { secondToMin } from "../utils/MinFunction";
import { Slider } from "@miblanchard/react-native-slider";

export default function MusicController({ navigation, route }) {
  const item = route.params.music;
  const musics = route.params.musics;
  const length = musics.length;
  const index = route.params.index;
  const [currentIndex, setCurrentIndex] = useState(index);
  const [currentItem, setCurrentItem] = useState(item);
  const { playSound, isPlay, setIsPlay, stopSound, music } =
    useContextProvider();
  const [musicDuration, setMusicDuration] = useState(0);

  useEffect(() => {
    playSound(item);
  }, []);

  useEffect(() => {
    if (music) {
      music.setOnPlaybackStatusUpdate((status) => {
        setIsPlay(status.shouldPlay);
        if (status.isPlaying) {
          setMusicDuration(status.positionMillis / 1000);
        }
        if (status.didJustFinish) {
          setIsPlay(false);
        }
      });
    }
  }, [music]);

  const playMusic = async (item) => {
    if (musicDuration !== 0) {
      await music.setPositionAsync(musicDuration * 1000);
      await music.playAsync();
    } else {
      playSound(item);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Feather name="chevron-down" size={24} color="black" />
      </View>
      <View style={{ alignItems: "center" }}>
        <Image
          source={{
            uri: currentItem?.picture?.pictureData
              ? currentItem?.picture?.pictureData
              : "https://i.ibb.co/FDjxXYr/image.png",
          }}
          style={{
            width: SCREEN_WIDTH - 32,
            height: 400,
            borderRadius: 8,
            marginBottom: 16,
            resizeMode: "contain",
            marginTop: 32,
          }}
        />
        <OwnText preset="h2">
          {currentItem?.title ? currentItem?.title : currentItem?.filename}
        </OwnText>
        <OwnText preset="p" style={{ color: "gray" }}>
          {currentItem?.artist ? currentItem?.artist : "Unknown"}
        </OwnText>
        <Slider
          value={musicDuration}
          containerStyle={styles.slider}
          animateTransitions
          minimumTrackTintColor="#FF8216"
          thumbStyle={styles.thumb}
          trackStyle={styles.track}
          onValueChange={async (value) => {
            console.log("value", value);
            setMusicDuration(value / 1000);
            await music.setPositionAsync(value * 1000);
          }}
          maximumValue={currentItem?.duration}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: SCREEN_WIDTH - 32,
            marginTop: 16,
          }}
        >
          <OwnText preset="p" style={{ color: "gray" }}>
            {musicDuration ? secondToMin(musicDuration) : "0:00"}
          </OwnText>
          <OwnText preset="p" style={{ color: "gray" }}>
            {currentItem?.duration
              ? secondToMin(currentItem?.duration)
              : "0:00"}
          </OwnText>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: SCREEN_WIDTH - 32,
            marginTop: 16,
            alignItems: "center",
          }}
        >
          <Feather name="skip-back" size={24} color="black" />
          <Feather
            onPress={async () => {
              await setMusicDuration(musicDuration - 10000);
              music.setPositionAsync(musicDuration * 1000 - 10000);
            }}
            name="rotate-ccw"
            size={30}
            color="black"
          />
          <TouchableOpacity
            onPress={isPlay ? () => stopSound() : () => playMusic(item)}
            style={{
              backgroundColor: "#FF8216",
              borderRadius: 100,
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <Ionicons
              name={isPlay ? "pause" : "play"}
              size={30}
              color="white"
            />
          </TouchableOpacity>
          <Feather
            onPress={async () => {
              await music.setPositionAsync(musicDuration * 1000 + 10000);
              setMusicDuration(musicDuration + 10000);
            }}
            name="rotate-cw"
            size={30}
            color="black"
          />
          <Feather
            name="skip-forward"
            size={24}
            color="black"
            onPress={() => {
              setCurrentIndex(currentIndex + 1);
              playSound(musics[currentIndex + 1]);
              setCurrentItem(musics[currentIndex + 1]);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    padding: 16,
  },
  thumb: {
    borderRadius: 20,
    height: 20,
    width: 20,
    backgroundColor: "#FF8216",
  },
  track: {
    borderRadius: 6,
    height: 10,
  },
  slider: {
    width: SCREEN_WIDTH - 32,
    marginTop: 16,
  },
});

import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../theme/Typography";
import useContextProvider from "../context/useContextProvider";
import Music from "../components/Music";
import OwnText from "../components/text/OwnText";

export default function Musics() {
  const [selectedTab, setSelectedTab] = useState(0);

  const { music, setIsPlay, musics, artists } = useContextProvider();

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
            <OwnText
              style={{
                marginRight: 16,
                fontSize: 16,
                color: selectedTab === index ? "#FF8216" : "black",
                fontFamily: Typography.regular,
                fontWeight: "400",
              }}
            >
              {tab}
            </OwnText>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 1
          ? musics.map((music, index) => (
              <Music
                key={index}
                item={music}
                musicController={false}
                index={index}
                directPlay={true}
              />
            ))
          : Object.keys(artists).map((artist, index) => (
              <OwnText>{artist}</OwnText>
            ))}
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

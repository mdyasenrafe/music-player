import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import useContextProvider from "../context/useContextProvider";
import { SCREEN_WIDTH } from "../theme/theme";
import MusicController from "../screens/MusicController";
import Musics from "../screens/Musics";
import Music from "../components/Music";

const Stack = createNativeStackNavigator();

export default function NavigationRoot() {
  const { music, bgMusicInfo, stopSound } = useContextProvider();

  return (
    <NavigationContainer>
      {/* {music && (
        <View style={styles.bottom_container}>
          <Music item={bgMusicInfo} show={true} />
        </View>
      )} */}
      <Stack.Navigator>
        <Stack.Screen
          name="Music"
          component={Musics}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MusicController"
          component={MusicController}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  albumArt: {
    width: 50,
    height: 50,
    marginRight: 16,
    borderRadius: 8,
  },
  bottom_container: {
    position: "absolute",
    bottom: 0,
    height: 100,
    zIndex: 999,
    width: SCREEN_WIDTH,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
});

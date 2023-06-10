import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Music from "./src/screens/Music";
import { useFonts } from "expo-font";

export default function App() {
  const Stack = createNativeStackNavigator();

  const [loaded] = useFonts({
    PoppinsRegular: require("./assets/fonts/PoppinsRegular.ttf"),
    PoppinsMedium: require("./assets/fonts/PoppinsMedium.ttf"),
    PoppinsBold: require("./assets/fonts/PoppinsBold.ttf"),
  });

  if (!loaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Music"
          component={Music}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

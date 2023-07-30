import { useFonts } from "expo-font";
import ConfigContextProvider from "./src/context/config";
import NavigationRoot from "./src/routes";

export default function App() {
  const [loaded] = useFonts({
    PoppinsRegular: require("./assets/fonts/PoppinsRegular.ttf"),
    PoppinsMedium: require("./assets/fonts/PoppinsMedium.ttf"),
    PoppinsBold: require("./assets/fonts/PoppinsBold.ttf"),
  });

  if (!loaded) return null;

  return (
    <ConfigContextProvider>
      <NavigationRoot />
    </ConfigContextProvider>
  );
}

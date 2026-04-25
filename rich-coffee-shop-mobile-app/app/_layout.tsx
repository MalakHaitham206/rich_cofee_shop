import { Stack } from "expo-router";
import { useFonts, ReenieBeanie_400Regular } from '@expo-google-fonts/reenie-beanie';
import { 
  useFonts as usePoppinsFonts, 
  Poppins_400Regular, 
  Poppins_500Medium,
  Poppins_600SemiBold, 
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { CartProvider } from "../src/core/context/CartContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loadedReenie, errorReenie] = useFonts({
    ReenieBeanie_400Regular,
  });

  const [loadedPoppins, errorPoppins] = usePoppinsFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const loaded = loadedReenie && loadedPoppins;
  const error = errorReenie || errorPoppins;

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </CartProvider>
    </GestureHandlerRootView>
  );
}

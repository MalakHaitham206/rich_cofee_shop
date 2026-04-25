import { View, Text, StyleSheet, Image, Pressable, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AppRoutes } from "../../../core/routes/app_routes";

export default function WelcomePage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { height } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Top Half: Dark Background with Logo */}
        <View style={styles.topContainer}>
          {/* We use the image you have in assets */}
         <View style={[styles.logoContainer, { width: width * 0.35, height: width * 0.35, borderRadius: (width * 0.35) / 2 }]}> 
            <Image
              source={require("../../../../assets/images/intro_page_images/logo_image.png")}
              style={[styles.logo, { width: width * 0.45, height: width * 0.45 }]}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={[styles.brandNameStyle, { fontSize: Math.max(12, width * 0.15) }]}>Rich Coffee</Text>
          </View>
        </View>

        {/* Bottom Half: White Background with Text & Controls */}
        <View style={styles.bottomContainer}>
          <Text style={styles.title}>
            Feel yourself like{"\n"}a barista!
          </Text>
          
          <Text style={styles.subtitle}>
            Magic coffee on order.
          </Text>
          {/* Next Button */}
          <Pressable
            style={({ pressed }) => [
              styles.arrow_container,
              pressed && styles.buttonPressed,
              { width: width * 0.69, height: height * 0.059, borderRadius: 16 }
            ]}
            onPress={() => router.push(AppRoutes.LOGIN as any)} 
          >
            <Text style={[styles.loginText, {fontSize: Math.max(12, width * 0.044)}]}>Login</Text>
             </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1F2123", // Match top background so the notch area is dark
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topContainer: {
    flex: 0.50,
    backgroundColor: "#1F2123", // Dark gray almost black
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    resizeMode: "contain",
  },
  loginText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "Poppins_400Regular", 
  },
  brandNameStyle: {
    fontFamily: "ReenieBeanie_400Regular",
    color: "#FFFFFF", // Dark slate
    textAlign: "center",
    marginTop: 36,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  arrow_container:{
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C67C4E",
    overflow: "hidden",
    elevation: 5,
    borderWidth: 1,
    position:"absolute"
    ,bottom:40,

    borderColor: "#C67C4E",
    overlayColor:"#000000b0",
    boxShadow:"0px 4px 6px 2px rgba(0, 0, 0, 0.25)",
    
  },
  bottomContainer: {
    flex: 0.45,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 32,
    color: "#1E293B",
    textAlign: "center",
    lineHeight: 40,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 40,
  },
  paginationContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 40, 
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E5E7EB", // Inactive gray
  },
  activeDot: {
    width: 28,
    backgroundColor: "#C67C4E", // Active brown
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});

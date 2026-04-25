import { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  useWindowDimensions,
  ActivityIndicator,
  ScrollView,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { AuthService } from "../api_services/auth_service";
import { AppRoutes } from "../../../core/routes/app_routes";
import { AuthInput } from "../../../core/components/AuthInput";

export default function RegisterPage() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorFields, setErrorFields] = useState<string[]>([]);
  
  const handleRegister = async () => {
    setErrorMessage("");
    setErrorFields([]);

    const errors: string[] = [];
    if (!name) errors.push("name");
    if (!email) errors.push("email");
    if (!password) errors.push("password");

    if (errors.length > 0) {
      setErrorMessage("Please fill in all required fields.");
      setErrorFields(errors);
      return;
    }

    setIsLoading(true);
    
    try {
      await AuthService.register(name.trim(), email.trim(), password);
      Alert.alert("Success", "Account created successfully. Please login.", [
        { text: "OK", onPress: () => router.replace(AppRoutes.LOGIN as any) }
      ]);
    } catch (error: any) {
      setErrorMessage(error.message);
      setErrorFields(["email", "password", "name"]); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header / Back Button */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
          {/* Title Area */}
          <View style={styles.titleContainer}>
            <Text style={{...styles.title, fontSize: width * 0.07}}>Sign up</Text>
            <Text style={{...styles.subtitle, fontSize: width * 0.04}}>Create an account here</Text>
          </View>

          {/* Form Area */}
          <View style={styles.formContainer}>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            {/* Name Input */}
            <AuthInput 
              iconName="user"
              placeholder="Create an account here" // Required to identically match the design
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              hasError={errorFields.includes("name")}
            />

            {/* Mobile Input */}
            <AuthInput 
              iconName="smartphone"
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
              hasError={errorFields.includes("mobile")}
            />

            {/* Email Input */}
            <AuthInput 
              iconName="mail"
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              hasError={errorFields.includes("email")}
            />

            {/* Password Input */}
            <AuthInput 
              iconName="lock"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              hasError={errorFields.includes("password")}
              isPassword={true}
            />

            <Text style={styles.termsText}>
              By signing up you agree with our Terms of Use
            </Text>
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <View style={styles.fabContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.fab,
              pressed && styles.fabPressed,
              isLoading && { opacity: 0.7 }
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <AntDesign name="arrow-right" size={24} color="#fff" />
            )}
          </Pressable>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { marginBottom: height * 0.05 }]}>
          <Text style={styles.footerText}>Already a member? </Text>
          <Pressable onPress={() => router.push(AppRoutes.LOGIN as any)}>
            <Text style={styles.signinText}>Sign in</Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  header: {
    height: 60,
    justifyContent: "center",
  },
  backButton: {
    padding: 8,
    marginLeft: -8, 
  },
  titleContainer: {
    marginTop: 20,
    alignItems: "flex-start",
    marginBottom: 40,
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    color: "#1E293B",
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    color: "#9CA3AF",
  },
  formContainer: {
    gap: 24,
    width: "100%",
  },
  errorText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#ED5151",
    marginBottom: -8,
  },
  termsText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#C67C4E",
    marginTop: 8,
  },
  fabContainer: {
    position: "absolute",
    bottom: 90,
    right: 24,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#C67C4E",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#C67C4E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabPressed: {
    transform: [{ scale: 0.96 }],
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 24,
    width: "100%",
    alignSelf: "center",
  },
  footerText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#9CA3AF",
  },
  signinText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#C67C4E",
  },
});
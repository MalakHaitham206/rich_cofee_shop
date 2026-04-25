import { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  useWindowDimensions,
  ActivityIndicator,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useNavigation } from "expo-router";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { AuthService } from "../api_services/auth_service";
import { AppRoutes } from "../../../core/routes/app_routes";
import { AuthInput } from "../../../core/components/AuthInput";


export default function LoginPage() {
  const router = useRouter();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const { height } = useWindowDimensions();
  
  const handleLogin = async () => {
    setErrorMessage("");
    setErrorFields([]);

    if (!email && !password) {
      setErrorMessage("Please fill in all fields.");
      setErrorFields(["email", "password"]);
      return;
    } else if (!email) {
      setErrorMessage("Email is required.");
      setErrorFields(["email"]);
      return;
    } else if (!password) {
      setErrorMessage("Password is required.");
      setErrorFields(["password"]);
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await AuthService.login(email.trim(), password);
      (navigation as any).reset({
        index: 0,
        routes: [{ name: "home" }], 
      });
    } catch (error: any) {
      setErrorMessage(error.message);
      setErrorFields(["email", "password"]); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header / Back Button */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() =>  {
            console.log("Back button pressed");
            router.replace(AppRoutes.WELCOME as any)
          }}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </Pressable>
        </View>

        {/* Title Area */}
        <View style={styles.titleContainer}>
          <Text style={
            {...styles.title, fontSize: width * 0.06}
          }>Sign in</Text>
          <Text style={
            {...styles.subtitle, fontSize: width * 0.04}
          }>Welcome back</Text>
        </View>

        {/* Form Area */}
        <View style={styles.formContainer}>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

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

          {/* Forgot Password */}
          <Pressable style={styles.forgotPasswordContainer} onPress={() => {}}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>
        </View>

        {/* Floating Action Button */}
        <View style={styles.fabContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.fab,
              pressed && styles.fabPressed,
              isLoading && { opacity: 0.7 }
            ]}
            onPress={handleLogin}
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
        <View style={[styles.footer, { marginBottom: height * 0.09 }]}>
          <Text style={styles.footerText}>New member? </Text>
          <Pressable onPress={() => router.push(AppRoutes.SIGNUP as any)}>
            <Text style={styles.signupText}>Sign up</Text>
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
    fontFamily: "Poppins_400Regular",
    marginTop: 60,
    alignItems: "flex-start",
    marginBottom: 40,
  },
  title: {
    fontFamily: "Poppins_500Medium",
    color: "#1E293B",
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#9CA3AF",
    marginBottom: 32,
  },
  formContainer: {
    gap: 32,
  },
  errorText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#ED5151",
    marginBottom: -16,
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  forgotPasswordText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#C67C4E",
    textDecorationLine: "underline",
  },
  fabContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 80, // Push it above the footer
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
    marginBottom: 24,
    marginRight: 16
  },
  fabPressed: {
    transform: [{ scale: 0.96 }],
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 24,
  },
  footerText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#9CA3AF",
  },
  signupText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#C67C4E",
  },
});

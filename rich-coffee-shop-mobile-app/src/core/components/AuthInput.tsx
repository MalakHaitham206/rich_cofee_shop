import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface AuthInputProps extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name'];
  hasError?: boolean;
  isPassword?: boolean;
}

export const AuthInput: React.FC<AuthInputProps> = ({ 
  iconName, 
  hasError = false, 
  isPassword = false, 
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(!isPassword);

  const iconColor = hasError ? "#ED5151" : "#1E293B";
  const dividerColor = hasError ? "#ED5151" : "#E5E7EB";

  return (
    <View style={[styles.inputWrapper, hasError && { borderBottomColor: "#ED5151" }]}>
      <Feather name={iconName} size={20} color={iconColor} style={styles.inputIcon} />
      <View style={[styles.inputDivider, { backgroundColor: dividerColor }]} />
      <TextInput
        style={styles.input}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={isPassword && !showPassword}
        {...props}
      />
      {isPassword && (
        <Pressable 
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#1E293B" />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 12,
  },
  inputIcon: {
    width: 24,
    textAlign: "center",
  },
  inputDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#1E293B",
    paddingVertical: 0, 
  },
  eyeIcon: {
    padding: 4,
  },
});

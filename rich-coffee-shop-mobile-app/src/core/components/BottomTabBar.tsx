import React from 'react';
import { View, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Octicons, Feather,MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { AppRoutes } from '../routes/app_routes';


export const BottomTabBar = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();
  
  const getIconColor = (route: string) => {
    return pathname === route ? "#C67C4E" : "#D1D5DB";
  };
  
  return (
    <View style={[styles.bottomTabContainer, { width: width * 0.9 }]}>
      <Pressable 
        style={styles.tabItem}
        onPress={() => router.push(AppRoutes.HOME as any)}
      >
        <Octicons name="home" size={24} color={getIconColor(AppRoutes.HOME)} />
      </Pressable>
      <Pressable
       style={styles.tabItem}
       onPress={() => router.push(AppRoutes.CART as any)}
      >
        <Feather name="shopping-cart" size={24} color={getIconColor(AppRoutes.CART)} />
      </Pressable>
      <Pressable 
        style={styles.tabItem}
        onPress={() => router.push(AppRoutes.PROFILE as any)}
      >
        <Feather name="user" size={24} color={getIconColor(AppRoutes.PROFILE)} />
      </Pressable>
      <Pressable 
        style={styles.tabItem}
        onPress={() => router.push(AppRoutes.HISTORY_ORDERS as any)}
      >
        <Ionicons name="receipt" size={24} color={getIconColor(AppRoutes.HISTORY_ORDERS)} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomTabContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFF",
    height: 64,
    borderRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});

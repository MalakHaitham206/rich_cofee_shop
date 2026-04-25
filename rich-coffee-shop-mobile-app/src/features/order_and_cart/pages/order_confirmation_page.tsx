import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable,  Platform } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppRoutes } from '../../../core/routes/app_routes';
import { AuthService } from '../../auth/api_services/auth_service';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Alex");

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await AuthService.getUserProfile();
        if (user && user.name) {
          setUserName(user.name.split(' ')[0]);
        }
      } catch (error) {
        console.error("Error loading user for confirmation page", error);
      }
    }
    loadUser();
  }, []);

  const handleBackToHome = () => {
    // Navigate home, so they can't "swipe back" to the empty cart
    router.replace(AppRoutes.HOME as any);
  };

  const handleGoToHistory = () => {
    // Navigate to history orders
    router.replace(AppRoutes.HISTORY_ORDERS as any);
  };

  return (
    <SafeAreaView  style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            onPress={handleBackToHome} 
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Feather name="arrow-left" size={24} color="#1E293B" />
          </Pressable>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          
          {/* Icon Placeholder for the Graphic */}
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="food-takeout-box-outline" size={120} color="#C67C4E" />
          </View>

          <Text style={styles.titleText}>Ordered</Text>
          <Text style={styles.subtitleText}>
            {userName}, your order has been successfully placed.
          </Text>

          <View style={styles.detailsBlock}>
            <Text style={styles.detailsText}>The order will be ready today</Text>
            <Text style={styles.detailsText}>to 18:10 at the address</Text>
            <Text style={styles.detailsText}>Baner, Pune</Text>
          </View>

          <View style={styles.footerBlock}>
            <Text style={styles.footerText}>Submit your personal QR code</Text>
            <Text style={styles.footerText}>at a coffee shop to receive an order.</Text>
          </View>

        </View>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <Pressable 
            style={({ pressed }) => [styles.historyButton, pressed && styles.pressed]}
            onPress={handleGoToHistory}
          >
            <Text style={styles.historyButtonText}>you order history</Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
    ...Platform.select({
      android: {
        paddingTop: 30,
      }
    })
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  iconContainer: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 28,
    color: '#1E293B',
    marginBottom: 16,
  },
  subtitleText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 40,
  },
  detailsBlock: {
    alignItems: 'center',
    marginBottom: 40,
  },
  detailsText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 24,
  },
  footerBlock: {
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  bottomContainer: {
    paddingBottom: 32,
  },
  historyButton: {
    backgroundColor: '#1E293B',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  }
});

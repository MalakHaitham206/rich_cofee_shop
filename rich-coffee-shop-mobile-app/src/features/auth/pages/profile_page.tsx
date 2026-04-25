import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AuthService } from '../api_services/auth_service';
import { ProfileInfoCard } from '../components/ProfileInfoCard';
import { BottomTabBar } from '../../../core/components/BottomTabBar';
import { ConfirmationModal } from '../../../core/components/ConfirmationModal';
import { AppRoutes } from '../../../core/routes/app_routes';

export default function ProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    setIsLogoutModalVisible(false);
    await AuthService.logout();
    router.replace(AppRoutes.WELCOME as any);
  };

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await AuthService.getUserProfile();
        setUserProfile(user);
      } catch (error) {
        console.error("Failed to load user profile", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
           <View style={styles.headerRightSpacer} />
          <Text style={styles.headerTitle}>Profile</Text>
           <Pressable 
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={24} color="#1E293B" />
          </Pressable>
            </View>

        {isLoading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#C67C4E" />
          </View>
        ) : (
          <View style={styles.content}>
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarCircle}>
                <Feather name="user" size={60} color="#334155" />
              </View>
              <Text style={styles.userNameText}>{userProfile?.name || 'Unknown User'}</Text>
            </View>

            {/* Info Cards Section */}
            <View style={styles.cardsSection}>
              <ProfileInfoCard 
                iconName="mail" 
                title="Email" 
                value={userProfile?.email || 'No email provided'} 
              />
              <ProfileInfoCard 
                iconName="map-pin" 
                title="Magic Coffee store address" 
                value="Baner Pune" 
              />
              <ProfileInfoCard 
                iconName="phone" 
                title="Phone number" 
                value="+91 ***** *****" 
              />
            </View>
          </View>
        )}

        {/* Bottom Tab Bar */}
        <BottomTabBar />

        {/* Logout Confirmation Modal */}
        <ConfirmationModal
          visible={isLogoutModalVisible}
          title="Log Out"
          message="Are you sure you want to log out?"
          iconName="log-out"
          confirmText="Log Out"
          cancelText="Cancel"
          onCancel={() => setIsLogoutModalVisible(false)}
          onConfirm={confirmLogout}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Light gray background to match design
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginRight: -20, 
    
  },
  pressed: {
    opacity: 0.7,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    color: '#001F3F', // Dark text for header
  },
  headerRightSpacer: {
    width: 40, // Match backButton width to perfectly center the title
  },
 
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  userNameText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    color: '#334155',
  },
  cardsSection: {
    gap: 0, // ProfileInfoCard handles its own marginBottom
  }
});

import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthService } from '../src/features/auth/api_services/auth_service';
import { AppRoutes } from '../src/core/routes/app_routes';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await AuthService.getToken();
        if (token) {
          router.replace(AppRoutes.HOME as any);
        } else {
          router.replace(AppRoutes.WELCOME as any);
        }
      } catch (error) {
        router.replace(AppRoutes.WELCOME as any);
      }
    }
    
    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#C67C4E" />
    </View>
  );
}

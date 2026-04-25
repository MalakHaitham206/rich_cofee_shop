import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  useWindowDimensions,
  ScrollView,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { AppRoutes } from "@/src/core/routes/app_routes";
import { AuthService } from "../../auth/api_services/auth_service";
import { HomeService } from "../api_services/home_data_service";

// Core components
import { PromoCard } from "../../../core/components/PromoCard";
import { CategoryChip } from "../../../core/components/CategoryChip";
import { ProductCard } from "../../../core/components/ProductCard";
import { SearchBar } from "../../../core/components/SearchBar";
import { ConfirmationModal } from "../../../core/components/ConfirmationModal";
import { BottomTabBar } from "../../../core/components/BottomTabBar";

export default function HomePage() {
  const router = useRouter();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<{id?: string, name: string}[]>([{ id: undefined, name: "All Menu" }]);
  const [products, setProducts] = useState<any[]>([]);
  const [userName, setUserName] = useState("Guest");
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  // Fetch Profile & Categories on mount
  useEffect(() => {
    async function loadAuth() {
      try {
        const token = await AuthService.getToken();
        if (!token) {
          router.replace(AppRoutes.LOGIN as any);
          return;
        }
        
        const user = await AuthService.getUserProfile();
        if (user && user.name) {
          setUserName(user.name);
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
      }
    }

    async function loadCategories() {
      try {
        const fetchedCategories = await HomeService.fetchCategories();
        setCategories([{ id: undefined, name: "All Menu" }, ...fetchedCategories]);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    }

    // Run both concurrently so they don't block each other
    loadAuth();
    loadCategories();
  }, []);

  // Fetch Products when category or search changes (with debounce)
  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const fetchedProducts = await HomeService.fetchProducts(activeCategoryId, searchQuery);
        setProducts(fetchedProducts);
        
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    const delayTimer = setTimeout(() => {
      loadProducts();
    }, 500); // 500ms debounce

    return () => clearTimeout(delayTimer);
  }, [activeCategoryId, searchQuery]);

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    setIsLogoutModalVisible(false);
    await AuthService.logout();
    router.replace(AppRoutes.WELCOME as any);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // padding for bottom nav
        bounces={false}
      >
        {/* TOP DARK HEADER SECTION */}
        <View style={styles.headerBackground}>
          <SafeAreaView edges={isLogoutModalVisible ? [] : ['top']}>
            <View style={styles.headerContent}>
              
              {/* Top Row: Greetings & Logout */}
              <View style={styles.topRow}>
                <View>
                  <Text style={styles.greetingText}>Hello</Text>
                  <Text style={styles.nameText}>{userName}</Text>
                </View>
                <Pressable onPress={handleLogout} style={styles.logoutButton}>
                  <Feather name="log-out" size={20} color="#C67C4E" />
                </Pressable>
              </View>

              {/* Search Bar Row */}
              <SearchBar 
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search “coffee”"
              />

            </View>
          </SafeAreaView>
        </View>

        {/* WHITE BODY SECTION (Overlaps header slightly via negative margin) */}
        <View style={styles.bodyContainer}>
          
          {/* Promo Card */}
          <PromoCard />

          {/* Categories Horizontal Scroll */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((cat, index) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <CategoryChip
                  key={cat.id || `all-${index}`}
                  name={cat.name}
                  isActive={isActive}
                  onPress={() => setActiveCategoryId(cat.id)}
                />
              );
            })}
          </ScrollView>

          {/* Products Grid */}
          <View style={styles.productGrid}>
            {isLoading ? (
               <ActivityIndicator size="large" color="#C67C4E" style={{ margin: 40, alignSelf: 'center', width: '100%' }} />
            ) : products.length === 0 ? (
               <Text style={{ textAlign: 'center', width: '100%', marginTop: 40, color: '#9CA3AF', fontFamily: "Poppins_400Regular" }}>No products found</Text>
            ) : (
            products.map((product) => {
              // Calculate card width dynamically (50% minus padding/gaps)
              const cardWidth = (width - 48 - 16) / 2; // 48 is total horizontal padding of body, 16 is gap
              return (
                <ProductCard 
                  key={product.id}
                  product={product}
                  cardWidth={cardWidth}
                />
              );
            })
            )}
          </View>
        </View>
      </ScrollView>

      {/* FLOATING BOTTOM TAB BAR */}
      <BottomTabBar />

      {/* CUSTOM LOGOUT MODAL */}
      <ConfirmationModal
        visible={isLogoutModalVisible}
        title="Logout"
        message="Are you sure you want to log out of your account?"
        iconName="log-out"
        confirmText="Logout"
        onCancel={() => setIsLogoutModalVisible(false)}
        onConfirm={confirmLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F9F9F9", // Light gray background for body
  },
  headerBackground: {
    backgroundColor: "#1E1E1E", // Dark header
    paddingBottom: 40, // Extra padding to allow promo card to overlap
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greetingText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#A0A0A0",
  },
  nameText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  logoutButton: {
    padding: 8,
  },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  categoriesContainer: {
    gap: 12,
    marginBottom: 24,
    paddingRight: 24, // extra padding at end of scroll
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 24,
  },
});
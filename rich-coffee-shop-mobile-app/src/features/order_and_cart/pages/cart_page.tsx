import React, { useState } from 'react';

import { SafeAreaView } from "react-native-safe-area-context";

import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useCart } from '../../../core/context/CartContext';
import { CartItemCard } from '../components/CartItemCard';
import { CheckoutBottomBar } from '../components/CheckoutBottomBar';
import { ConfirmationModal } from '../../../core/components/ConfirmationModal';
import { OrderService } from '../api_services/order_service';
import { AppRoutes } from '../../../core/routes/app_routes';

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, getCartTotal, clearCart } = useCart();
  
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const handleNextPress = () => {
    setIsCheckoutModalVisible(true);
  };

  const handleConfirmOrder = async () => {
    setIsCheckoutModalVisible(false);
    setIsSubmittingOrder(true);
    
    try {
      const formattedItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }));
      
      await OrderService.placeOrder(formattedItems);
      Alert.alert("Order Placed", "Your order has been placed successfully!");
      clearCart();
      router.replace(AppRoutes.ORDER_CONFIRMATION as any);
    } catch (error: any) {
      Alert.alert("Checkout Failed", error.message || "Something went wrong while placing your order.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            onPress={() => router.back()} 
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Feather name="arrow-left" size={24} color="#1E293B" />
          </Pressable>
          <Text style={styles.headerTitle}>My cart</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Cart Items List */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="shopping-bag" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>Your cart is empty</Text>
              <Text style={styles.emptySubtext}>Add some delicious coffee!</Text>
            </View>
          ) : (
            items.map((item) => (
              <CartItemCard 
                key={item.id} 
                item={item} 
                onRemove={() => removeFromCart(item.id)} 
              />
            ))
          )}
        </ScrollView>

        {/* Bottom Bar */}
        {items.length > 0 && (
          <CheckoutBottomBar 
            totalPrice={getCartTotal()} 
            onNextPress={handleNextPress} 
          />
        )}
        
        {/* Loading Overlay */}
        {isSubmittingOrder && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#C67C4E" />
              <Text style={styles.loadingText}>Placing Order...</Text>
            </View>
          </View>
        )}

        {/* Checkout Confirmation Modal */}
        <ConfirmationModal
          visible={isCheckoutModalVisible}
          title="Confirm Order"
          message="Are you sure you want to place this order? Once confirmed, your delicious coffee will be prepared!"
          iconName="shopping-cart"
          confirmText="Place Order"
          cancelText="Cancel"
          onCancel={() => setIsCheckoutModalVisible(false)}
          onConfirm={handleConfirmOrder}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9', // Light gray background matching design
    ...Platform.select({
      android: {
        paddingTop: 30,
      }
    })
  },
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    paddingHorizontal: 20,
   
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
   
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.7,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
  
    fontSize: 24,
    color: '#001F3F', // Dark blue text for header
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  emptyContainer: {
    marginTop: 180,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  emptyText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginTop: 16,
  },
  emptySubtext: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingBox: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1E293B',
  }
});
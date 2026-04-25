import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface OrderCardProps {
  order: any;
  isHistory: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, isHistory }) => {
  const router = useRouter();

  // Format the date string manually to match "24 June | 12:30 | by 18:10"
  const createdDate = new Date(order.created_at);
  const formattedDate = createdDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  });
  
  const timeOpts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
  const formattedTime = createdDate.toLocaleTimeString('en-GB', timeOpts);
  
  // Mock pickup time as 20 mins later
  const pickupDate = new Date(createdDate.getTime() + 20 * 60000);
  const pickupTime = pickupDate.toLocaleTimeString('en-GB', timeOpts);
  
  const dateTimeString = `${formattedDate} | ${formattedTime} | by ${pickupTime}`;

  // Get all product names
  const productNames = order.order_items?.map((item: any) => item.products?.name)
    .filter(Boolean)
    .join(', ') || "Coffee Order";

  return (
    <View style={styles.cardContainer}>
      {/* Top Row: Date & Price */}
      <View style={styles.topRow}>
        <Text style={styles.dateText}>{dateTimeString}</Text>
        <Text style={styles.priceText}>INR {Number(order.total_amount).toFixed(2)}</Text>
      </View>

      <View style={styles.contentRow}>
        {/* Left Side: Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Feather name="coffee" size={16} color="#9CA3AF" />
            <Text style={styles.infoText} numberOfLines={1}>{productNames}</Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={16} color="#9CA3AF" />
            <Text style={styles.infoText}>Baner, Pune</Text>
          </View>
        </View>

        {/* Right Side: Reorder Button (only for history) */}
        {isHistory && (
          <Pressable 
            style={({ pressed }) => [styles.orderButton, pressed && styles.pressed]}
            onPress={() => {
              // Note: Ideally this would copy the order items to the cart and navigate to cart.
              // For now, it's just a UI button that could navigate to the menu.
              console.log("Re-order button pressed");
            }}
          >
            <Text style={styles.orderButtonText}>Order</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#9CA3AF',
  },
  priceText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#4B5563',
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#1E293B',
  },
  orderButton: {
    backgroundColor: '#C67C4E',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  orderButtonText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#FFFFFF',
  }
});

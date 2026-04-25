import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { CartItem } from '../../../core/context/CartContext';

interface CartItemCardProps {
  item: CartItem;
  onRemove: () => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item, onRemove }) => {
  const { width } = useWindowDimensions();
  
  const imageUrl = item.product.image_url || 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop';

  const renderRightActions = () => {
    return (
      <Pressable style={styles.deleteButtonContainer} onPress={onRemove}>
        <View style={styles.deleteButton}>
          <Feather name="trash-2" size={24} color="#ED5151" />
        </View>
      </Pressable>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={[styles.cardContainer, { width: width * 0.9 }]}>
        {/* Left: Image */}
        <Image source={{ uri: imageUrl }} style={styles.image} />
        
        {/* Middle: Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.nameText} numberOfLines={1}>{item.product.name}</Text>
          <Text style={styles.variationText} numberOfLines={1}>{item.variationText}</Text>
          <Text style={styles.quantityText}>x {item.quantity}</Text>
        </View>
        
        {/* Right: Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.currencyText}>INR</Text>
          <Text style={styles.priceValueText}>{(Number(item.product.price) * item.quantity).toFixed(2)}</Text>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  nameText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 2,
  },
  variationText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  quantityText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#1E293B',
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 12,
  },
  currencyText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#1E293B',
    marginBottom: -4,
  },
  priceValueText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1E293B',
  },
  deleteButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: 16,
    marginRight: 16, // offset the self alignment
  },
  deleteButton: {
    backgroundColor: '#FFEAEA',
    width: 56,
    height: 92,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useCart, Product } from '../context/CartContext';
import { useRouter } from 'expo-router';
import { AppRoutes } from '../routes/app_routes';

interface ProductCardProps {
  product: Product;
  cardWidth: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, cardWidth }) => {
  const imageUrl = product.image_url || 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop';
  
  const { addToCart, isInCart } = useCart();
  const router = useRouter();
  
  const [isAdding, setIsAdding] = useState(false);
  const isProductInCart = isInCart(product.id);

  const handlePress = () => {
    if (isProductInCart) {
      router.push(AppRoutes.CART as any);
    } else {
      setIsAdding(true);
      setTimeout(() => {
        addToCart(product);
        setIsAdding(false);
      }, 500); // simulate network delay
    }
  };

  return (
    <View style={[styles.productCard, { width: cardWidth }]}>
      {/* Image and Rating */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.productImage} />
        <View style={styles.ratingBadge}>
          <AntDesign name="star" size={10} color="#F59E0B" />
          <Text style={styles.ratingText}>4.8</Text>
        </View>
      </View>

      {/* Product Info */}
      <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
      <Text style={styles.productDesc} numberOfLines={1}>{product.description || 'Delicious'}</Text>
      
      {/* Price and Add Button */}
      <View style={styles.priceRow}>
        <Text style={styles.productPrice}>₹ {product.price}</Text>
        <Pressable 
          style={styles.addButton} 
          onPress={handlePress}
          disabled={isAdding}
        >
          {isAdding ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : isProductInCart ? (
            <Feather name="shopping-cart" size={16} color="#fff" />
          ) : (
            <Feather name="plus" size={16} color="#fff" />
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 10,
    color: "#FFF",
  },
  productName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 4,
  },
  productDesc: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#1E293B",
  },
  addButton: {
    backgroundColor: "#C67C4E",
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export const PromoCard = () => {
  return (
    <View style={styles.promoCardContainer}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop' }} 
        style={styles.promoImageBg} 
      />
      <View style={styles.promoOverlay}>
        <View style={styles.promoTag}>
          <Text style={styles.promoTagText}>Promo</Text>
        </View>
        <Text style={styles.promoTitle}>Buy one get{"\n"}one FREE</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  promoCardContainer: {
    height: 140,
    borderRadius: 16,
    backgroundColor: "#EAD6C8",
    marginTop: -40, // Pull it up into the dark header
    overflow: "hidden",
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  promoImageBg: {
    position: 'absolute',
    top: 0,
    right: -40, // Shift image to right
    width: '60%',
    height: '100%',
    opacity: 0.8,
  },
  promoOverlay: {
    padding: 20,
    justifyContent: "center",
    height: "100%",
  },
  promoTag: {
    backgroundColor: "#ED5151",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  promoTagText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: "#FFF",
  },
  promoTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    color: "#1E293B",
    lineHeight: 32,
  },
});

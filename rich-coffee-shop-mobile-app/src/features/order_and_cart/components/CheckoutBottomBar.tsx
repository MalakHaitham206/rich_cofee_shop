import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CheckoutBottomBarProps {
  totalPrice: number;
  onNextPress: () => void;
}

export const CheckoutBottomBar: React.FC<CheckoutBottomBarProps> = ({ totalPrice, onNextPress }) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 24) }]}>
      <View style={[styles.innerContainer, { width: width * 0.9 }]}>
        
        {/* Total Price Section */}
        <View style={styles.priceSection}>
          <Text style={styles.totalPriceLabel}>Total Price</Text>
          <Text style={styles.totalPriceValue}>EGP {totalPrice.toFixed(2)}</Text>
        </View>

        {/* Next Button Section */}
        <Pressable 
          style={({ pressed }) => [
            styles.nextButton,
            { width: width * 0.45 },
            pressed && styles.nextButtonPressed
          ]}
          onPress={onNextPress}
        >
          <Feather name="shopping-cart" size={18} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    alignItems: 'center',
    
    // Shadows
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSection: {
    flex: 1,
    justifyContent: 'center',
  },
  totalPriceLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  totalPriceValue: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    color: '#C67C4E', // Orange color matching design
  },
  nextButton: {
    backgroundColor: '#C67C4E',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

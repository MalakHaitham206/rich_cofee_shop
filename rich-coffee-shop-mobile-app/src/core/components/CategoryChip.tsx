import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface CategoryChipProps {
  name: string;
  isActive: boolean;
  onPress: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ name, isActive, onPress }) => {
  return (
    <Pressable 
      style={[styles.categoryChip, isActive && styles.activeCategoryChip]}
      onPress={onPress}
    >
      <Text style={[styles.categoryText, isActive && styles.activeCategoryText]}>
        {name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  activeCategoryChip: {
    backgroundColor: "#C67C4E",
  },
  categoryText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#1E293B",
  },
  activeCategoryText: {
    color: "#FFF",
    fontFamily: "Poppins_600SemiBold",
  },
});

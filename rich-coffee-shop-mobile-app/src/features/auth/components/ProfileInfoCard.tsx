import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ProfileInfoCardProps {
  iconName: keyof typeof Feather.glyphMap;
  title: string;
  value: string;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ iconName, title, value }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.iconWrapper}>
        <Feather name={iconName} size={20} color="#1E293B" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.valueText}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    width: "92%",
    marginHorizontal: 16,

  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
  
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  valueText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#1E293B',
  }
});

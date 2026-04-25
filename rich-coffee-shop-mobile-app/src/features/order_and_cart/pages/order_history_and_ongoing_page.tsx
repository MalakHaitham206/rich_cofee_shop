import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrderService } from '../api_services/order_service';
import { OrderCard } from '../components/OrderCard';
import { BottomTabBar } from '../../../core/components/BottomTabBar';

type TabType = 'ongoing' | 'history';

export default function OrderHistoryAndOngoingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('ongoing');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await OrderService.getOrders();
      setOrders(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  // The backend assigns 'pending' to new orders. We treat 'pending' as On going.
  const ongoingOrders = orders.filter(o => o.status === 'pending');
  // Everything else is History (or if we want to show all in history for demo purposes, we can).
  // I will strictly adhere to the logic: 'pending' -> ongoing, others -> history.
  const historyOrders = orders.filter(o => o.status !== 'pending');

  const displayOrders = activeTab === 'ongoing' ? ongoingOrders : historyOrders;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Order</Text>
        </View>

        {/* Custom Tabs */}
        <View style={styles.tabContainer}>
          <Pressable 
            style={[styles.tabButton, activeTab === 'ongoing' && styles.activeTabButton]}
            onPress={() => setActiveTab('ongoing')}
          >
            <Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>
              On going
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.tabButton, activeTab === 'history' && styles.activeTabButton]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
              History
            </Text>
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {isLoading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#C67C4E" />
            </View>
          ) : error ? (
            <View style={styles.centerContent}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable onPress={fetchOrders} style={styles.retryButton}>
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : displayOrders.length === 0 ? (
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>
                No orders found in {activeTab === 'ongoing' ? 'On going' : 'History'}.
              </Text>
            </View>
          ) : (
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {displayOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  isHistory={activeTab === 'history'} 
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Fixed Bottom Tab Bar */}
        <BottomTabBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    color: '#001F3F',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#1E293B',
  },
  tabText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: '#D1D5DB', // Inactive text color
  },
  activeTabText: {
    color: '#1E293B', // Active text color
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 100, // Space for BottomTabBar
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#9CA3AF',
  },
  errorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#EF4444',
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#C67C4E',
    borderRadius: 8,
  },
  retryText: {
    fontFamily: 'Poppins_500Medium',
    color: '#FFFFFF',
  }
});

import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { GradientHeader, ActionCard, StatCard, PassCard } from '../components/UI';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function PassengerHomeScreen({ navigation }: any) {
    const { user, signOut, passes, travelRecords } = useAuth();

    const activePass = passes.find(p => p.status === 'active');
    const totalTrips = travelRecords.length;
    const totalSpent = travelRecords.reduce((sum, r) => sum + r.fare, 0);
    const savings = totalTrips * 15 - totalSpent; // Compared to individual tickets

    const menuItems = [
        { icon: '🎫', label: 'Apply for\nBus Pass', screen: 'ApplyPass', color: '#7B2FBE' },
        { icon: '📊', label: 'Travel\nAnalytics', screen: 'Analytics', color: '#3B82F6' },
        { icon: '🔍', label: 'View QR\nCode', screen: 'QRCode', color: '#10B981' },
        { icon: '📋', label: 'Travel\nHistory', screen: 'History', color: '#F59E0B' },
        { icon: '💰', label: 'Recharge\nBalance', screen: 'Recharge', color: '#EF4444' },
        { icon: '❓', label: 'Help &\nSupport', screen: 'Help', color: '#6366F1' },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <GradientHeader
                title={`Hello, ${user?.name?.split(' ')[0] || 'User'}!`}
                subtitle="Welcome to DigiPass 2.0"
                rightAction={
                    <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                }
            />

            <View style={styles.content}>
                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <StatCard value={totalTrips.toString()} label="Total Trips" icon="🚌" color="#7B2FBE" />
                    <StatCard value={`₹${totalSpent.toFixed(0)}`} label="Spent" icon="💸" color="#F59E0B" />
                    <StatCard value={`₹${savings > 0 ? savings.toFixed(0) : '0'}`} label="Saved" icon="🎉" color="#10B981" />
                </View>

                {/* Active Pass Card */}
                {activePass && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Active Pass</Text>
                        <PassCard pass={activePass} onPress={() => navigation.navigate('PassDetails')} />
                    </View>
                )}

                {/* Quick Actions Grid */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        {menuItems.map((item, index) => (
                            <ActionCard
                                key={index}
                                icon={item.icon}
                                label={item.label}
                                color={item.color}
                                onPress={() => {
                                    if (item.screen === 'Recharge') {
                                        Alert.alert('Recharge', 'Recharge feature coming soon!');
                                    } else if (item.screen === 'Help') {
                                        Alert.alert('Help & Support', 'Contact: support@digipass.com\nPhone: 1800-DIGIPASS\n\nFAQ:\n• How to apply for a pass?\n  Go to Apply for Bus Pass\n• How to generate QR?\n  Go to View QR Code after getting a pass');
                                    } else {
                                        navigation.navigate(item.screen);
                                    }
                                }}
                            />
                        ))}
                    </View>
                </View>

                {/* Recent Trips */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Trips</Text>
                    {travelRecords.slice(0, 3).map((record, index) => (
                        <View key={record.id} style={styles.tripCard}>
                            <View style={styles.tripLeft}>
                                <Text style={styles.tripIcon}>🚌</Text>
                                <View>
                                    <Text style={styles.tripRoute}>{record.from} → {record.to}</Text>
                                    <Text style={styles.tripDate}>Bus {record.busNo} • {record.date}</Text>
                                </View>
                            </View>
                            <Text style={styles.tripFare}>₹{record.fare.toFixed(2)}</Text>
                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.viewAllBtn}
                        onPress={() => navigation.navigate('History')}
                    >
                        <Text style={styles.viewAllText}>View All Trips →</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.lg, marginTop: -SPACING.md },
    logoutBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.full,
    },
    logoutText: { color: COLORS.white, fontWeight: '600', fontSize: FONT_SIZE.sm },
    statsRow: {
        flexDirection: 'row',
        marginBottom: SPACING.lg,
        gap: SPACING.xs,
    },
    section: { marginBottom: SPACING.lg },
    sectionTitle: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    tripCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        ...SHADOWS.sm,
    },
    tripLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        flex: 1,
    },
    tripIcon: { fontSize: 24 },
    tripRoute: { fontWeight: '700', color: COLORS.text, fontSize: FONT_SIZE.md },
    tripDate: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, marginTop: 2 },
    tripFare: { fontWeight: '800', color: COLORS.primary, fontSize: FONT_SIZE.lg },
    viewAllBtn: {
        alignItems: 'center',
        paddingVertical: SPACING.md,
    },
    viewAllText: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: FONT_SIZE.md,
    },
});

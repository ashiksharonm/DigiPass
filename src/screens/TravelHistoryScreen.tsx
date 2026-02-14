import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { GradientHeader } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export default function TravelHistoryScreen({ navigation }: any) {
    const { travelRecords } = useAuth();

    const totalFare = travelRecords.reduce((sum, r) => sum + r.fare, 0);
    const totalTrips = travelRecords.length;

    return (
        <View style={styles.container}>
            <GradientHeader
                title="Travel History"
                subtitle={`${totalTrips} trips • ₹${totalFare.toFixed(2)} total`}
                showBack
                onBack={() => navigation.goBack()}
            />

            <View style={styles.content}>
                {/* Summary Stats */}
                <View style={styles.summaryRow}>
                    <View style={[styles.summaryCard, { backgroundColor: '#EDE9FE' }]}>
                        <Text style={styles.summaryIcon}>🚌</Text>
                        <Text style={[styles.summaryValue, { color: COLORS.primary }]}>{totalTrips}</Text>
                        <Text style={styles.summaryLabel}>Trips</Text>
                    </View>
                    <View style={[styles.summaryCard, { backgroundColor: '#FEF3C7' }]}>
                        <Text style={styles.summaryIcon}>💰</Text>
                        <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>₹{totalFare.toFixed(0)}</Text>
                        <Text style={styles.summaryLabel}>Spent</Text>
                    </View>
                    <View style={[styles.summaryCard, { backgroundColor: '#D1FAE5' }]}>
                        <Text style={styles.summaryIcon}>📊</Text>
                        <Text style={[styles.summaryValue, { color: '#10B981' }]}>₹{(totalFare / Math.max(totalTrips, 1)).toFixed(0)}</Text>
                        <Text style={styles.summaryLabel}>Avg/Trip</Text>
                    </View>
                </View>

                {/* Trip List */}
                <Text style={styles.sectionTitle}>All Trips</Text>
                {travelRecords.map((record, index) => (
                    <View key={record.id} style={styles.tripCard}>
                        <View style={styles.tripLeft}>
                            <View style={styles.dateContainer}>
                                <Text style={styles.dateDay}>{record.date.split('-')[2]}</Text>
                                <Text style={styles.dateMonth}>
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
                                        parseInt(record.date.split('-')[1]) - 1
                                    ]}
                                </Text>
                            </View>
                            <View style={styles.tripInfo}>
                                <Text style={styles.tripRoute}>{record.from} → {record.to}</Text>
                                <View style={styles.tripMeta}>
                                    <Text style={styles.tripBus}>🚌 Bus {record.busNo}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.tripRight}>
                            <Text style={styles.tripFare}>₹{record.fare.toFixed(2)}</Text>
                            <Text style={styles.tripStatus}>✓ Verified</Text>
                        </View>
                    </View>
                ))}

                {travelRecords.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📋</Text>
                        <Text style={styles.emptyTitle}>No Travel History</Text>
                        <Text style={styles.emptySubtitle}>Your travel records will appear here</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.lg },

    summaryRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    summaryCard: {
        flex: 1,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        ...SHADOWS.sm,
    },
    summaryIcon: { fontSize: 20, marginBottom: 4 },
    summaryValue: { fontWeight: '800', fontSize: FONT_SIZE.xl },
    summaryLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2, fontWeight: '600' },

    sectionTitle: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },

    tripCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        ...SHADOWS.sm,
    },
    tripLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
    dateContainer: {
        backgroundColor: COLORS.accent,
        borderRadius: BORDER_RADIUS.sm,
        padding: SPACING.sm,
        alignItems: 'center',
        minWidth: 45,
    },
    dateDay: { fontWeight: '800', fontSize: FONT_SIZE.xl, color: COLORS.primary },
    dateMonth: { fontSize: FONT_SIZE.xs, fontWeight: '600', color: COLORS.primary },
    tripInfo: { flex: 1 },
    tripRoute: { fontWeight: '700', color: COLORS.text, fontSize: FONT_SIZE.md },
    tripMeta: { flexDirection: 'row', gap: SPACING.sm, marginTop: 4 },
    tripBus: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary },
    tripRight: { alignItems: 'flex-end' },
    tripFare: { fontWeight: '800', fontSize: FONT_SIZE.lg, color: COLORS.primary },
    tripStatus: { fontSize: FONT_SIZE.xs, color: COLORS.success, fontWeight: '600', marginTop: 4 },

    emptyState: { alignItems: 'center', padding: SPACING.xxl },
    emptyIcon: { fontSize: 48 },
    emptyTitle: { fontWeight: '800', fontSize: FONT_SIZE.xl, color: COLORS.text, marginTop: SPACING.md },
    emptySubtitle: { color: COLORS.textSecondary, marginTop: SPACING.sm },
});

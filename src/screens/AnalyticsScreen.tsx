import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { GradientHeader } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { getMonthlySpending, getTopRoutes } from '../services/mockData';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - SPACING.lg * 2 - SPACING.lg * 2;
const BAR_WIDTH = CHART_WIDTH / 8;

export default function AnalyticsScreen({ navigation }: any) {
    const { travelRecords } = useAuth();
    const monthlyData = getMonthlySpending();
    const topRoutes = getTopRoutes();
    const maxSpending = Math.max(...monthlyData.map(d => d.amount));

    const totalSpent = travelRecords.reduce((s, r) => s + r.fare, 0);
    const totalTrips = travelRecords.length;
    const avgPerTrip = totalTrips > 0 ? totalSpent / totalTrips : 0;
    const savingsVsTicket = totalTrips * 15 - totalSpent;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <GradientHeader
                title="Travel Analytics"
                subtitle="Your travel insights & patterns"
                showBack
                onBack={() => navigation.goBack()}
            />

            <View style={styles.content}>
                {/* Overview Stats */}
                <View style={styles.overviewGrid}>
                    <View style={[styles.overviewCard, { backgroundColor: '#EDE9FE' }]}>
                        <Text style={styles.overviewIcon}>🚌</Text>
                        <Text style={[styles.overviewValue, { color: COLORS.primary }]}>{totalTrips}</Text>
                        <Text style={styles.overviewLabel}>Total Trips</Text>
                    </View>
                    <View style={[styles.overviewCard, { backgroundColor: '#FEF3C7' }]}>
                        <Text style={styles.overviewIcon}>💸</Text>
                        <Text style={[styles.overviewValue, { color: '#F59E0B' }]}>₹{totalSpent.toFixed(0)}</Text>
                        <Text style={styles.overviewLabel}>Total Spent</Text>
                    </View>
                    <View style={[styles.overviewCard, { backgroundColor: '#D1FAE5' }]}>
                        <Text style={styles.overviewIcon}>💰</Text>
                        <Text style={[styles.overviewValue, { color: '#10B981' }]}>₹{savingsVsTicket > 0 ? savingsVsTicket.toFixed(0) : '0'}</Text>
                        <Text style={styles.overviewLabel}>Saved</Text>
                    </View>
                    <View style={[styles.overviewCard, { backgroundColor: '#DBEAFE' }]}>
                        <Text style={styles.overviewIcon}>📊</Text>
                        <Text style={[styles.overviewValue, { color: '#3B82F6' }]}>₹{avgPerTrip.toFixed(0)}</Text>
                        <Text style={styles.overviewLabel}>Avg/Trip</Text>
                    </View>
                </View>

                {/* Monthly Spending Chart */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Monthly Spending</Text>
                    <Text style={styles.chartSubtitle}>Last 6 months</Text>

                    <View style={styles.chart}>
                        {/* Y-axis labels */}
                        <View style={styles.yAxis}>
                            <Text style={styles.yLabel}>₹{maxSpending}</Text>
                            <Text style={styles.yLabel}>₹{(maxSpending / 2).toFixed(0)}</Text>
                            <Text style={styles.yLabel}>₹0</Text>
                        </View>

                        {/* Bars */}
                        <View style={styles.barsContainer}>
                            {monthlyData.map((data, index) => {
                                const barHeight = (data.amount / maxSpending) * 120;
                                return (
                                    <View key={index} style={styles.barColumn}>
                                        <View style={styles.barWrapper}>
                                            <LinearGradient
                                                colors={COLORS.gradient.card as any}
                                                style={[styles.bar, { height: barHeight }]}
                                            />
                                        </View>
                                        <Text style={styles.barLabel}>{data.month}</Text>
                                        <Text style={styles.barValue}>₹{data.amount}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>

                {/* Top Routes */}
                <View style={styles.routesCard}>
                    <Text style={styles.chartTitle}>Top Routes</Text>
                    <Text style={styles.chartSubtitle}>Most frequently traveled</Text>

                    {topRoutes.map((route, index) => {
                        const maxTrips = Math.max(...topRoutes.map(r => r.trips));
                        const percentage = (route.trips / maxTrips) * 100;
                        return (
                            <View key={index} style={styles.routeItem}>
                                <View style={styles.routeHeader}>
                                    <Text style={styles.routeRank}>#{index + 1}</Text>
                                    <Text style={styles.routeName}>{route.route}</Text>
                                    <Text style={styles.routeTrips}>{route.trips} trips</Text>
                                </View>
                                <View style={styles.progressBar}>
                                    <LinearGradient
                                        colors={[
                                            index === 0 ? '#7B2FBE' : index === 1 ? '#3B82F6' : index === 2 ? '#10B981' : '#F59E0B',
                                            index === 0 ? '#A855F7' : index === 1 ? '#60A5FA' : index === 2 ? '#34D399' : '#FCD34D',
                                        ]}
                                        style={[styles.progressFill, { width: `${percentage}%` }]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Travel Time Insights */}
                <View style={styles.insightCard}>
                    <Text style={styles.chartTitle}>Travel Insights</Text>
                    <View style={styles.insightGrid}>
                        <View style={styles.insightItem}>
                            <Text style={styles.insightEmoji}>🌅</Text>
                            <Text style={styles.insightValue}>68%</Text>
                            <Text style={styles.insightLabel}>Morning Trips</Text>
                        </View>
                        <View style={styles.insightItem}>
                            <Text style={styles.insightEmoji}>🌆</Text>
                            <Text style={styles.insightValue}>32%</Text>
                            <Text style={styles.insightLabel}>Evening Trips</Text>
                        </View>
                        <View style={styles.insightItem}>
                            <Text style={styles.insightEmoji}>📅</Text>
                            <Text style={styles.insightValue}>Mon-Fri</Text>
                            <Text style={styles.insightLabel}>Peak Days</Text>
                        </View>
                        <View style={styles.insightItem}>
                            <Text style={styles.insightEmoji}>⏰</Text>
                            <Text style={styles.insightValue}>8:30 AM</Text>
                            <Text style={styles.insightLabel}>Usual Time</Text>
                        </View>
                    </View>
                </View>

                {/* Savings Comparison */}
                <View style={styles.savingsCard}>
                    <LinearGradient
                        colors={COLORS.gradient.dark as any}
                        style={styles.savingsGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.savingsTitle}>💡 Pass vs Individual Tickets</Text>
                        <View style={styles.savingsComparison}>
                            <View style={styles.savingsItem}>
                                <Text style={styles.savingsLabel}>With Pass</Text>
                                <Text style={styles.savingsValue}>₹{totalSpent.toFixed(0)}</Text>
                            </View>
                            <View style={styles.savingsVs}>
                                <Text style={styles.savingsVsText}>VS</Text>
                            </View>
                            <View style={styles.savingsItem}>
                                <Text style={styles.savingsLabel}>Without Pass</Text>
                                <Text style={styles.savingsValue}>₹{(totalTrips * 15).toFixed(0)}</Text>
                            </View>
                        </View>
                        <View style={styles.savingsBanner}>
                            <Text style={styles.savingsBannerText}>
                                You saved ₹{savingsVsTicket > 0 ? savingsVsTicket.toFixed(0) : '0'} with DigiPass! 🎉
                            </Text>
                        </View>
                    </LinearGradient>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.lg },

    overviewGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    overviewCard: {
        width: (width - SPACING.lg * 2 - SPACING.sm) / 2 - 1,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        ...SHADOWS.sm,
    },
    overviewIcon: { fontSize: 24, marginBottom: 4 },
    overviewValue: { fontWeight: '800', fontSize: FONT_SIZE.xl },
    overviewLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2, fontWeight: '600' },

    chartCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        ...SHADOWS.md,
    },
    chartTitle: { fontWeight: '800', fontSize: FONT_SIZE.xl, color: COLORS.text },
    chartSubtitle: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, marginTop: 2, marginBottom: SPACING.lg },

    chart: { flexDirection: 'row' },
    yAxis: { justifyContent: 'space-between', paddingRight: SPACING.sm, paddingBottom: 40 },
    yLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textLight },
    barsContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
    barColumn: { alignItems: 'center' },
    barWrapper: { justifyContent: 'flex-end', height: 120 },
    bar: { width: BAR_WIDTH - 8, borderRadius: 4 },
    barLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 4, fontWeight: '600' },
    barValue: { fontSize: 8, color: COLORS.textLight, marginTop: 2 },

    routesCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        ...SHADOWS.md,
    },
    routeItem: { marginBottom: SPACING.md },
    routeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    routeRank: {
        fontWeight: '800',
        color: COLORS.primary,
        width: 30,
        fontSize: FONT_SIZE.md,
    },
    routeName: { flex: 1, fontWeight: '600', color: COLORS.text, fontSize: FONT_SIZE.sm },
    routeTrips: { fontWeight: '700', color: COLORS.primary, fontSize: FONT_SIZE.sm },
    progressBar: {
        height: 8,
        backgroundColor: COLORS.accent,
        borderRadius: 4,
        overflow: 'hidden',
        marginLeft: 30,
    },
    progressFill: { height: '100%', borderRadius: 4 },

    insightCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        ...SHADOWS.md,
    },
    insightGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginTop: SPACING.md,
    },
    insightItem: {
        width: (width - SPACING.lg * 2 - SPACING.lg * 2 - SPACING.sm) / 2 - 1,
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
    },
    insightEmoji: { fontSize: 24, marginBottom: 4 },
    insightValue: { fontWeight: '800', fontSize: FONT_SIZE.lg, color: COLORS.primary },
    insightLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },

    savingsCard: {
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        marginBottom: SPACING.xxl,
        ...SHADOWS.lg,
    },
    savingsGradient: { padding: SPACING.lg },
    savingsTitle: { fontWeight: '800', fontSize: FONT_SIZE.lg, color: COLORS.white, marginBottom: SPACING.lg },
    savingsComparison: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    savingsItem: { alignItems: 'center', flex: 1 },
    savingsLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FONT_SIZE.sm },
    savingsValue: { color: COLORS.white, fontWeight: '800', fontSize: FONT_SIZE.xxxl, marginTop: 4 },
    savingsVs: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: BORDER_RADIUS.full,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    savingsVsText: { color: COLORS.white, fontWeight: '800', fontSize: FONT_SIZE.sm },
    savingsBanner: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
    },
    savingsBannerText: { color: COLORS.white, fontWeight: '700', fontSize: FONT_SIZE.md },
});

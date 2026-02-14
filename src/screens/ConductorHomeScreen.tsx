import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { GradientHeader, ActionCard, StatCard } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export default function ConductorHomeScreen({ navigation }: any) {
    const { user, signOut } = useAuth();
    const [verificationsToday, setVerificationsToday] = useState(12);
    const [validPasses, setValidPasses] = useState(10);
    const [invalidPasses, setInvalidPasses] = useState(2);

    const recentScans = [
        { name: 'Ashik Sharon', route: '17D', time: '10:30 AM', status: 'valid' },
        { name: 'Priya Kumar', route: '5C', time: '10:15 AM', status: 'valid' },
        { name: 'Raj Mohan', route: '17D', time: '9:45 AM', status: 'invalid' },
        { name: 'Lakshmi S', route: '17D', time: '9:30 AM', status: 'valid' },
        { name: 'Kumar R', route: '21G', time: '9:00 AM', status: 'valid' },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <GradientHeader
                title={`Hello, Conductor!`}
                subtitle={user?.name || 'Welcome to DigiPass'}
                rightAction={
                    <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                }
            />

            <View style={styles.content}>
                {/* Today's Stats */}
                <View style={styles.statsRow}>
                    <StatCard value={verificationsToday.toString()} label="Scanned" icon="📷" color="#7B2FBE" />
                    <StatCard value={validPasses.toString()} label="Valid" icon="✅" color="#10B981" />
                    <StatCard value={invalidPasses.toString()} label="Invalid" icon="❌" color="#EF4444" />
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    <ActionCard
                        icon="📷"
                        label="Scan QR\nCode"
                        color="#7B2FBE"
                        onPress={() => navigation.navigate('Scanner')}
                    />
                    <ActionCard
                        icon="🔍"
                        label="Verify\nUser"
                        color="#3B82F6"
                        onPress={() => navigation.navigate('Scanner')}
                    />
                    <ActionCard
                        icon="🚌"
                        label="Bus\nDetails"
                        color="#10B981"
                        onPress={() => Alert.alert('Bus Details', 'Bus: 17D\nRoute: MGR Nagar → Nungambakkam\nCapacity: 52 seats\nStatus: In Service')}
                    />
                    <ActionCard
                        icon="❓"
                        label="Help &\nSupport"
                        color="#F59E0B"
                        onPress={() => Alert.alert('Help', 'Contact Depot: 044-2345-6789\nEmergency: 112')}
                    />
                </View>

                {/* Recent Scans */}
                <Text style={styles.sectionTitle}>Recent Verifications</Text>
                {recentScans.map((scan, index) => (
                    <View key={index} style={styles.scanCard}>
                        <View style={styles.scanLeft}>
                            <View style={[styles.scanStatus, { backgroundColor: scan.status === 'valid' ? '#D1FAE5' : '#FEE2E2' }]}>
                                <Text style={styles.scanStatusIcon}>
                                    {scan.status === 'valid' ? '✅' : '❌'}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.scanName}>{scan.name}</Text>
                                <Text style={styles.scanRoute}>Bus {scan.route} • {scan.time}</Text>
                            </View>
                        </View>
                        <View style={[styles.scanBadge, { backgroundColor: scan.status === 'valid' ? '#D1FAE5' : '#FEE2E2' }]}>
                            <Text style={[styles.scanBadgeText, { color: scan.status === 'valid' ? '#10B981' : '#EF4444' }]}>
                                {scan.status.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.lg },
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
        marginTop: -SPACING.md,
    },
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
        marginBottom: SPACING.lg,
    },

    scanCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        ...SHADOWS.sm,
    },
    scanLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    scanStatus: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanStatusIcon: { fontSize: 18 },
    scanName: { fontWeight: '700', color: COLORS.text },
    scanRoute: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, marginTop: 2 },
    scanBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.full,
    },
    scanBadgeText: { fontWeight: '800', fontSize: FONT_SIZE.xs, letterSpacing: 0.5 },
});

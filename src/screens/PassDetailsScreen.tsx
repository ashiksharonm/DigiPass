import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { GradientHeader, InfoRow, PrimaryButton } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export default function PassDetailsScreen({ navigation }: any) {
    const { passes, user } = useAuth();
    const pass = passes[0];

    if (!pass) {
        return (
            <View style={styles.container}>
                <GradientHeader title="Pass Details" showBack onBack={() => navigation.goBack()} />
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>🎫</Text>
                    <Text style={styles.emptyTitle}>No Active Pass</Text>
                    <Text style={styles.emptySubtitle}>Apply for a bus pass to get started</Text>
                    <View style={styles.emptyButton}>
                        <PrimaryButton title="APPLY NOW" onPress={() => navigation.navigate('ApplyPass')} />
                    </View>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <GradientHeader title="Bus Pass Details" showBack onBack={() => navigation.goBack()} />

            <View style={styles.content}>
                {/* Pass Card Visual */}
                <View style={styles.passVisual}>
                    <View style={styles.passHeader}>
                        <Text style={styles.passLogo}>🚌 DigiPass</Text>
                        <View style={[styles.statusBadge, { backgroundColor: pass.status === 'active' ? '#10B981' : '#EF4444' }]}>
                            <Text style={styles.statusText}>{pass.status.toUpperCase()}</Text>
                        </View>
                    </View>

                    <View style={styles.passBody}>
                        <View style={styles.passengerSection}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{pass.passengerName.charAt(0)}</Text>
                            </View>
                            <View>
                                <Text style={styles.passengerName}>{pass.passengerName}</Text>
                                <Text style={styles.passId}>ID: {pass.id.toUpperCase()}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.routeVisual}>
                        <View style={styles.routePoint}>
                            <View style={styles.routeDot} />
                            <Text style={styles.routeText}>{pass.journeyFrom}</Text>
                        </View>
                        <View style={styles.routeLine}>
                            <Text style={styles.routeLineText}>🚌 Bus {pass.busNo}</Text>
                        </View>
                        <View style={styles.routePoint}>
                            <View style={[styles.routeDot, { backgroundColor: COLORS.success }]} />
                            <Text style={styles.routeText}>{pass.journeyTo}</Text>
                        </View>
                    </View>
                </View>

                {/* Details Card */}
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>Pass Information</Text>
                    <InfoRow label="Name of Passenger" value={pass.passengerName} />
                    <InfoRow label="Journey From" value={pass.journeyFrom} />
                    <InfoRow label="Journey To" value={pass.journeyTo} />
                    <InfoRow label="Bus No." value={pass.busNo} />
                    <InfoRow label="Pass Type" value={pass.passType.toUpperCase()} />
                    <InfoRow label="Amount Paid" value={`₹${pass.amountPaid.toFixed(2)}`} />
                    <InfoRow label="Balance" value={`₹${pass.balance.toFixed(2)}`} />
                    <InfoRow label="Created" value={pass.createdAt} />
                    <InfoRow label="Expires" value={pass.expiresAt} />
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <PrimaryButton title="VIEW QR CODE" onPress={() => navigation.navigate('QRCode')} />
                    <View style={{ height: SPACING.md }} />
                    <PrimaryButton title="RETURN TO HOME" onPress={() => navigation.goBack()} variant="outline" />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.lg },

    passVisual: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        ...SHADOWS.lg,
        borderWidth: 2,
        borderColor: COLORS.accent,
        borderStyle: 'dashed',
    },
    passHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        paddingBottom: SPACING.md,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.accent,
    },
    passLogo: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: COLORS.primary },
    statusBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.full,
    },
    statusText: { color: COLORS.white, fontWeight: '800', fontSize: FONT_SIZE.xs, letterSpacing: 1 },

    passBody: { marginBottom: SPACING.lg },
    passengerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { color: COLORS.white, fontWeight: '800', fontSize: FONT_SIZE.xxl },
    passengerName: { fontWeight: '800', fontSize: FONT_SIZE.xl, color: COLORS.text },
    passId: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, marginTop: 2 },

    routeVisual: {
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.lg,
    },
    routePoint: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    routeDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.primary },
    routeText: { fontWeight: '700', color: COLORS.text, fontSize: FONT_SIZE.lg },
    routeLine: {
        marginLeft: 6,
        borderLeftWidth: 2,
        borderLeftColor: COLORS.primary,
        paddingLeft: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    routeLineText: { color: COLORS.textSecondary, fontWeight: '600' },

    detailsCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        marginTop: SPACING.lg,
        ...SHADOWS.md,
    },
    detailsTitle: {
        fontWeight: '800',
        fontSize: FONT_SIZE.xl,
        color: COLORS.text,
        marginBottom: SPACING.md,
    },

    actions: { marginTop: SPACING.lg, paddingBottom: SPACING.xxl },

    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xxl,
    },
    emptyIcon: { fontSize: 64, marginBottom: SPACING.lg },
    emptyTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.text },
    emptySubtitle: { color: COLORS.textSecondary, marginTop: SPACING.sm, marginBottom: SPACING.lg },
    emptyButton: { width: '100%' },
});

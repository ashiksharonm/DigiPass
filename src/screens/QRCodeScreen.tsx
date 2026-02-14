import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { GradientHeader, PrimaryButton } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import QRCode from 'react-native-qrcode-svg';

const { width } = Dimensions.get('window');

export default function QRCodeScreen({ navigation }: any) {
    const { passes, user } = useAuth();
    const pass = passes[0];
    const [refreshKey, setRefreshKey] = useState(0);
    const [timer, setTimer] = useState(60);
    const pulseAnim = new Animated.Value(1);

    useEffect(() => {
        // Auto-refresh QR every 60 seconds for security
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    setRefreshKey(k => k + 1);
                    return 60;
                }
                return prev - 1;
            });
        }, 1000);

        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.02, duration: 1500, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
            ])
        ).start();

        return () => clearInterval(interval);
    }, []);

    if (!pass) {
        return (
            <View style={styles.container}>
                <GradientHeader title="QR Code" showBack onBack={() => navigation.goBack()} />
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>🎫</Text>
                    <Text style={styles.emptyTitle}>No Active Pass</Text>
                    <Text style={styles.emptySubtitle}>Apply for a bus pass to generate QR code</Text>
                    <View style={styles.emptyButton}>
                        <PrimaryButton title="APPLY NOW" onPress={() => navigation.navigate('ApplyPass')} />
                    </View>
                </View>
            </View>
        );
    }

    const qrData = JSON.stringify({
        passId: pass.id,
        passenger: pass.passengerName,
        from: pass.journeyFrom,
        to: pass.journeyTo,
        bus: pass.busNo,
        type: pass.passType,
        expires: pass.expiresAt,
        token: `${refreshKey}-${Date.now()}`,
    });

    return (
        <View style={styles.container}>
            <GradientHeader
                title="Scan Your QR Code"
                subtitle="Show this to the conductor"
                showBack
                onBack={() => navigation.goBack()}
            />

            <View style={styles.content}>
                <Animated.View style={[styles.qrContainer, { transform: [{ scale: pulseAnim }] }]}>
                    <LinearGradient
                        colors={['#FFFFFF', '#F5F0FF']}
                        style={styles.qrCard}
                    >
                        <View style={styles.qrHeader}>
                            <Text style={styles.qrLogo}>🚌 DigiPass</Text>
                            <View style={styles.timerBadge}>
                                <Text style={styles.timerText}>⏱ {timer}s</Text>
                            </View>
                        </View>

                        <View style={styles.qrCodeWrapper}>
                            <View style={styles.qrBorder}>
                                <QRCode
                                    value={qrData}
                                    size={width * 0.5}
                                    color={COLORS.primaryDark}
                                    backgroundColor="white"
                                />
                            </View>
                        </View>

                        <View style={styles.qrInfo}>
                            <Text style={styles.qrPassenger}>{pass.passengerName}</Text>
                            <Text style={styles.qrRoute}>{pass.journeyFrom} → {pass.journeyTo}</Text>
                            <View style={styles.qrDetails}>
                                <View style={styles.qrDetailItem}>
                                    <Text style={styles.qrDetailLabel}>Bus</Text>
                                    <Text style={styles.qrDetailValue}>{pass.busNo}</Text>
                                </View>
                                <View style={styles.qrDetailItem}>
                                    <Text style={styles.qrDetailLabel}>Type</Text>
                                    <Text style={styles.qrDetailValue}>{pass.passType.toUpperCase()}</Text>
                                </View>
                                <View style={styles.qrDetailItem}>
                                    <Text style={styles.qrDetailLabel}>Valid Till</Text>
                                    <Text style={styles.qrDetailValue}>{pass.expiresAt}</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                <View style={styles.refreshNote}>
                    <Text style={styles.refreshNoteText}>
                        🔒 QR code auto-refreshes every 60 seconds for security
                    </Text>
                </View>

                <PrimaryButton
                    title="VIEW PASS DETAILS"
                    onPress={() => navigation.navigate('PassDetails')}
                    variant="outline"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { flex: 1, padding: SPACING.lg, alignItems: 'center', justifyContent: 'center' },

    qrContainer: { width: '100%', marginBottom: SPACING.lg },
    qrCard: {
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        alignItems: 'center',
        ...SHADOWS.lg,
    },
    qrHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: SPACING.lg,
    },
    qrLogo: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.primary },
    timerBadge: {
        backgroundColor: COLORS.accent,
        paddingHorizontal: SPACING.md,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.full,
    },
    timerText: { fontWeight: '700', color: COLORS.primary, fontSize: FONT_SIZE.sm },

    qrCodeWrapper: { marginVertical: SPACING.md },
    qrBorder: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 3,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        backgroundColor: COLORS.white,
    },

    qrInfo: { alignItems: 'center', marginTop: SPACING.lg, width: '100%' },
    qrPassenger: { fontWeight: '800', fontSize: FONT_SIZE.xxl, color: COLORS.text },
    qrRoute: { color: COLORS.textSecondary, fontSize: FONT_SIZE.md, marginTop: 4, fontWeight: '600' },
    qrDetails: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: SPACING.lg,
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
    },
    qrDetailItem: { alignItems: 'center' },
    qrDetailLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '600' },
    qrDetailValue: { fontSize: FONT_SIZE.md, fontWeight: '800', color: COLORS.primary, marginTop: 2 },

    refreshNote: {
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.lg,
        width: '100%',
    },
    refreshNoteText: { textAlign: 'center', color: COLORS.textSecondary, fontSize: FONT_SIZE.sm },

    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxl },
    emptyIcon: { fontSize: 64, marginBottom: SPACING.lg },
    emptyTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.text },
    emptySubtitle: { color: COLORS.textSecondary, marginTop: SPACING.sm, marginBottom: SPACING.lg },
    emptyButton: { width: '100%' },
});

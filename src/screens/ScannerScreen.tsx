import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert, Animated, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { GradientHeader, PrimaryButton, InfoRow } from '../components/UI';

const { width } = Dimensions.get('window');

export default function ScannerScreen({ navigation }: any) {
    const [scanning, setScanning] = useState(true);
    const [scanResult, setScanResult] = useState<any>(null);
    const scanLineAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animate scan line
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
                Animated.timing(scanLineAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
            ])
        ).start();

        // Simulate scan after 3 seconds in demo mode
        if (scanning) {
            const timer = setTimeout(() => {
                handleScanResult();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [scanning]);

    const handleScanResult = () => {
        // Simulate a successful scan
        const isValid = Math.random() > 0.2; // 80% chance valid
        setScanResult({
            valid: isValid,
            passenger: {
                name: 'Ashik Sharon',
                passId: 'PASS-17D-2024-001',
                from: 'MGR Nagar',
                to: 'Nungambakkam',
                busNo: '17D',
                passType: 'MONTHLY',
                amountPaid: '₹500.00',
                expiresAt: '2024-03-01',
                status: isValid ? 'ACTIVE' : 'EXPIRED',
            },
        });
        setScanning(false);
    };

    const handleRescan = () => {
        setScanResult(null);
        setScanning(true);
    };

    const scanLineTranslate = scanLineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width * 0.6],
    });

    return (
        <View style={styles.container}>
            <GradientHeader
                title="QR Scanner"
                subtitle={scanning ? 'Point at passenger\'s QR code' : 'Scan Result'}
                showBack
                onBack={() => navigation.goBack()}
            />

            <View style={styles.content}>
                {scanning ? (
                    /* Scanner View */
                    <View style={styles.scannerSection}>
                        <View style={styles.scannerFrame}>
                            <View style={styles.scannerBox}>
                                {/* Corner markers */}
                                <View style={[styles.corner, styles.cornerTL]} />
                                <View style={[styles.corner, styles.cornerTR]} />
                                <View style={[styles.corner, styles.cornerBL]} />
                                <View style={[styles.corner, styles.cornerBR]} />

                                {/* Scan line */}
                                <Animated.View
                                    style={[
                                        styles.scanLine,
                                        { transform: [{ translateY: scanLineTranslate }] },
                                    ]}
                                />

                                {/* QR placeholder */}
                                <View style={styles.qrPlaceholder}>
                                    <Text style={styles.qrPlaceholderIcon}>📷</Text>
                                    <Text style={styles.qrPlaceholderText}>Camera Preview</Text>
                                    <Text style={styles.qrPlaceholderSub}>(Demo: Auto-scans in 3s)</Text>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.scanInstruction}>
                            Position the QR code within the frame
                        </Text>

                        <TouchableOpacity style={styles.manualScan} onPress={handleScanResult}>
                            <LinearGradient
                                colors={COLORS.gradient.primary as any}
                                style={styles.manualScanGradient}
                            >
                                <Text style={styles.manualScanText}>📷 Tap to Simulate Scan</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                ) : (
                    /* Result View */
                    <View style={styles.resultSection}>
                        {/* Status Banner */}
                        <View style={[styles.statusBanner, {
                            backgroundColor: scanResult?.valid ? '#D1FAE5' : '#FEE2E2'
                        }]}>
                            <Text style={styles.statusIcon}>
                                {scanResult?.valid ? '✅' : '❌'}
                            </Text>
                            <Text style={[styles.statusTitle, {
                                color: scanResult?.valid ? '#10B981' : '#EF4444'
                            }]}>
                                {scanResult?.valid ? 'PASS VERIFIED!' : 'INVALID PASS!'}
                            </Text>
                            <Text style={styles.statusSubtitle}>
                                {scanResult?.valid
                                    ? 'This passenger has a valid active pass'
                                    : 'This pass has expired or is invalid'}
                            </Text>
                        </View>

                        {/* Passenger Details */}
                        {scanResult?.passenger && (
                            <View style={styles.detailsCard}>
                                <View style={styles.passengerHeader}>
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>
                                            {scanResult.passenger.name.charAt(0)}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={styles.passengerName}>{scanResult.passenger.name}</Text>
                                        <Text style={styles.passId}>{scanResult.passenger.passId}</Text>
                                    </View>
                                </View>

                                <InfoRow label="Journey From" value={scanResult.passenger.from} />
                                <InfoRow label="Journey To" value={scanResult.passenger.to} />
                                <InfoRow label="Bus No." value={scanResult.passenger.busNo} />
                                <InfoRow label="Pass Type" value={scanResult.passenger.passType} />
                                <InfoRow label="Amount Paid" value={scanResult.passenger.amountPaid} />
                                <InfoRow label="Expires" value={scanResult.passenger.expiresAt} />
                                <InfoRow label="Status" value={scanResult.passenger.status} />
                            </View>
                        )}

                        {/* Actions */}
                        <View style={styles.actions}>
                            <PrimaryButton title="SCAN AGAIN" onPress={handleRescan} />
                            <View style={{ height: SPACING.md }} />
                            <PrimaryButton
                                title="RETURN TO HOME"
                                onPress={() => navigation.goBack()}
                                variant="outline"
                            />
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { flex: 1, padding: SPACING.lg },

    // Scanner
    scannerSection: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    scannerFrame: {
        width: width * 0.7,
        height: width * 0.7,
        marginBottom: SPACING.lg,
    },
    scannerBox: {
        flex: 1,
        backgroundColor: 'rgba(123, 47, 190, 0.05)',
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: COLORS.primary,
    },
    cornerTL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 },
    cornerTR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 },
    cornerBL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 },
    cornerBR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 },
    scanLine: {
        position: 'absolute',
        left: 10,
        right: 10,
        height: 2,
        backgroundColor: '#EF4444',
        top: 10,
    },
    qrPlaceholder: { alignItems: 'center' },
    qrPlaceholderIcon: { fontSize: 48, marginBottom: SPACING.sm },
    qrPlaceholderText: { fontWeight: '700', color: COLORS.textSecondary },
    qrPlaceholderSub: { color: COLORS.textLight, fontSize: FONT_SIZE.sm, marginTop: 4 },
    scanInstruction: {
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
        fontWeight: '600',
    },
    manualScan: {
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        width: '100%',
        ...SHADOWS.md,
    },
    manualScanGradient: {
        paddingVertical: SPACING.md + 2,
        alignItems: 'center',
    },
    manualScanText: { color: COLORS.white, fontWeight: '800', fontSize: FONT_SIZE.lg },

    // Result
    resultSection: { flex: 1 },
    statusBanner: {
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    statusIcon: { fontSize: 48, marginBottom: SPACING.sm },
    statusTitle: { fontWeight: '900', fontSize: FONT_SIZE.xxl, marginBottom: 4 },
    statusSubtitle: { color: COLORS.textSecondary, textAlign: 'center' },

    detailsCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        ...SHADOWS.md,
    },
    passengerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        marginBottom: SPACING.lg,
        paddingBottom: SPACING.md,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.accent,
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
    passId: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm },

    actions: { marginTop: SPACING.sm },
});

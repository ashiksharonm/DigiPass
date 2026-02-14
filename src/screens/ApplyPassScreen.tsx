import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { GradientHeader, PrimaryButton } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { ROUTES, PASS_PRICES, BusPass, BusRoute } from '../services/mockData';

export default function ApplyPassScreen({ navigation }: any) {
    const { user, addPass } = useAuth();
    const [step, setStep] = useState(1);
    const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
    const [passType, setPassType] = useState<'weekly' | 'monthly' | 'annual'>('monthly');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleApply = async () => {
        if (!selectedRoute || !paymentMethod) return;

        setIsProcessing(true);
        // Simulate Razorpay Gateway
        Alert.alert('Razorpay Secure', 'Redirecting to payment gateway...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        const passInfo = PASS_PRICES[passType];
        const now = new Date();
        const expiry = new Date(now);
        expiry.setDate(expiry.getDate() + passInfo.days);

        const newPass: BusPass = {
            id: 'pass-' + Date.now(),
            userId: user?.id || '',
            passengerName: user?.name || '',
            journeyFrom: selectedRoute.from,
            journeyTo: selectedRoute.to,
            busNo: selectedRoute.routeNo,
            passType,
            amountPaid: passInfo.price,
            balance: 500 - passInfo.price,
            status: 'active',
            createdAt: now.toISOString().split('T')[0],
            expiresAt: expiry.toISOString().split('T')[0],
            qrData: `DIGIPASS-${Date.now()}-${user?.name}-${selectedRoute.routeNo}-${passType}`,
        };

        addPass(newPass);
        setIsProcessing(false);

        Alert.alert(
            '🎉 Pass Created!',
            `Your ${passInfo.label} for Bus ${selectedRoute.routeNo} is now active!`,
            [{ text: 'View Pass', onPress: () => navigation.navigate('PassDetails') }]
        );
    };

    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Import MapsService
    const { MapsService } = require('../services/MapsService');

    const handleUseCurrentLocation = async () => {
        setIsLoadingLocation(true);
        const location = await MapsService.getCurrentLocation();
        setIsLoadingLocation(false);

        if (location) {
            // In a real app, we would reverse geocode here to get the stop name
            // For now, we'll simulate finding the nearest stop based on coordinates
            const nearestStop = "T. Nagar"; // Simulated nearest stop
            Alert.alert(
                'Location Found',
                `Nearest Stop: ${nearestStop}\n\nWe set 'T. Nagar' as your starting point.`,
                [{ text: 'OK' }]
            );
            // Logic to filter routes starting from T. Nagar could involve setting a state variable
            // For this demo, we'll just show the alert
        }
    };

    const renderStep1 = () => (
        <View>
            <Text style={styles.stepTitle}>Select Bus Route</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
                <Text style={{ ...styles.stepSubtitle, marginBottom: 0 }}>Choose your regular commute route</Text>
                <TouchableOpacity onPress={handleUseCurrentLocation} disabled={isLoadingLocation}>
                    <Text style={{ color: COLORS.primary, fontWeight: '700' }}>
                        {isLoadingLocation ? 'Locating...' : '📍 Near Me'}
                    </Text>
                </TouchableOpacity>
            </View>

            {ROUTES.map(route => (
                <TouchableOpacity
                    key={route.id}
                    style={[styles.routeCard, selectedRoute?.id === route.id && styles.routeCardSelected]}
                    onPress={() => setSelectedRoute(route)}
                    activeOpacity={0.7}
                >
                    <View style={styles.routeHeader}>
                        <View style={[styles.routeBadge, selectedRoute?.id === route.id && styles.routeBadgeSelected]}>
                            <Text style={styles.routeBadgeText}>{route.routeNo}</Text>
                        </View>
                        <View style={styles.routeInfo}>
                            <Text style={styles.routeName}>{route.from} → {route.to}</Text>
                            <Text style={styles.routeStops}>{route.stops.length} stops • ₹{route.fare}/trip</Text>
                        </View>
                        {selectedRoute?.id === route.id && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                </TouchableOpacity>
            ))}

            <View style={styles.buttonContainer}>
                <PrimaryButton
                    title="NEXT →"
                    onPress={() => setStep(2)}
                    disabled={!selectedRoute}
                />
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View>
            <Text style={styles.stepTitle}>Choose Pass Type</Text>
            <Text style={styles.stepSubtitle}>Select validity period for your pass</Text>

            {Object.entries(PASS_PRICES).map(([key, plan]) => (
                <TouchableOpacity
                    key={key}
                    style={[styles.planCard, passType === key && styles.planCardSelected]}
                    onPress={() => setPassType(key as any)}
                    activeOpacity={0.7}
                >
                    <LinearGradient
                        colors={passType === key ? (COLORS.gradient.card as any) : [COLORS.white, COLORS.white]}
                        style={styles.planGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.planInfo}>
                            <Text style={[styles.planLabel, passType === key && styles.planLabelActive]}>{plan.label}</Text>
                            <Text style={[styles.planDays, passType === key && styles.planDaysActive]}>{plan.days} days validity</Text>
                        </View>
                        <View style={styles.planPriceContainer}>
                            <Text style={[styles.planPrice, passType === key && styles.planPriceActive]}>₹{plan.price}</Text>
                            {key === 'annual' && <Text style={[styles.planSaving, passType === key && styles.planSavingActive]}>Save 17%!</Text>}
                            {key === 'monthly' && <Text style={[styles.planSaving, passType === key && styles.planSavingActive]}>Popular</Text>}
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            ))}

            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Order Summary</Text>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Route</Text>
                    <Text style={styles.summaryValue}>{selectedRoute?.routeNo} — {selectedRoute?.from} → {selectedRoute?.to}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Pass Type</Text>
                    <Text style={styles.summaryValue}>{PASS_PRICES[passType].label}</Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryTotal]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>₹{PASS_PRICES[passType].price}</Text>
                </View>
            </View>

            <View style={styles.navigationButtons}>
                <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <PrimaryButton title="PROCEED TO PAY →" onPress={() => setStep(3)} />
                </View>
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View>
            <Text style={styles.stepTitle}>Payment</Text>
            <Text style={styles.stepSubtitle}>Choose your payment method</Text>

            <Text style={styles.paymentSectionTitle}>💳 Cards</Text>
            <View style={styles.paymentOptions}>
                {['Visa', 'Mastercard'].map(method => (
                    <TouchableOpacity
                        key={method}
                        style={[styles.paymentOption, paymentMethod === method && styles.paymentOptionSelected]}
                        onPress={() => setPaymentMethod(method)}
                    >
                        <Text style={styles.paymentIcon}>{method === 'Visa' ? '💳' : '💳'}</Text>
                        <Text style={[styles.paymentText, paymentMethod === method && styles.paymentTextSelected]}>{method}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.paymentSectionTitle}>🏦 Net Banking</Text>
            <View style={styles.paymentOptions}>
                {['SBI', 'HDFC', 'ICICI', 'Axis'].map(method => (
                    <TouchableOpacity
                        key={method}
                        style={[styles.paymentOption, paymentMethod === method && styles.paymentOptionSelected]}
                        onPress={() => setPaymentMethod(method)}
                    >
                        <Text style={styles.paymentIcon}>🏦</Text>
                        <Text style={[styles.paymentText, paymentMethod === method && styles.paymentTextSelected]}>{method}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.paymentSectionTitle}>📱 UPI</Text>
            <View style={styles.paymentOptions}>
                {['GPay', 'PhonePe', 'Paytm'].map(method => (
                    <TouchableOpacity
                        key={method}
                        style={[styles.paymentOption, paymentMethod === method && styles.paymentOptionSelected]}
                        onPress={() => setPaymentMethod(method)}
                    >
                        <Text style={styles.paymentIcon}>📱</Text>
                        <Text style={[styles.paymentText, paymentMethod === method && styles.paymentTextSelected]}>{method}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.totalBanner}>
                <Text style={styles.totalBannerLabel}>Amount to Pay</Text>
                <Text style={styles.totalBannerValue}>₹{PASS_PRICES[passType].price}</Text>
            </View>

            <View style={{ alignItems: 'center', marginBottom: SPACING.md }}>
                <Text style={{ color: COLORS.textSecondary, fontSize: 10 }}>🔒 Secured by Razorpay</Text>
            </View>

            <View style={styles.navigationButtons}>
                <TouchableOpacity style={styles.backButton} onPress={() => setStep(2)}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <PrimaryButton
                        title={isProcessing ? "PROCESSING..." : "PAY NOW 💰"}
                        onPress={handleApply}
                        disabled={!paymentMethod}
                        loading={isProcessing}
                    />
                </View>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <GradientHeader
                title="Apply for Pass"
                subtitle={`Step ${step} of 3`}
                showBack
                onBack={() => step > 1 ? setStep(step - 1) : navigation.goBack()}
            />

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                {[1, 2, 3].map(s => (
                    <View key={s} style={styles.progressStep}>
                        <View style={[styles.progressDot, s <= step && styles.progressDotActive]}>
                            <Text style={[styles.progressDotText, s <= step && styles.progressDotTextActive]}>
                                {s < step ? '✓' : s}
                            </Text>
                        </View>
                        <Text style={[styles.progressLabel, s <= step && styles.progressLabelActive]}>
                            {s === 1 ? 'Route' : s === 2 ? 'Plan' : 'Pay'}
                        </Text>
                    </View>
                ))}
                <View style={styles.progressLine}>
                    <View style={[styles.progressLineFill, { width: `${((step - 1) / 2) * 100}%` }]} />
                </View>
            </View>

            <View style={styles.content}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.lg },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.xxl,
        paddingVertical: SPACING.lg,
        position: 'relative',
    },
    progressStep: { alignItems: 'center', zIndex: 10 },
    progressDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressDotActive: { backgroundColor: COLORS.primary },
    progressDotText: { fontWeight: '700', color: COLORS.textSecondary, fontSize: FONT_SIZE.sm },
    progressDotTextActive: { color: COLORS.white },
    progressLabel: { marginTop: 4, fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '600' },
    progressLabelActive: { color: COLORS.primary },
    progressLine: {
        position: 'absolute',
        left: 60,
        right: 60,
        top: 32,
        height: 3,
        backgroundColor: COLORS.accent,
    },
    progressLineFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },

    stepTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
    stepSubtitle: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, marginBottom: SPACING.lg },

    routeCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        borderWidth: 2,
        borderColor: 'transparent',
        ...SHADOWS.sm,
    },
    routeCardSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.accent },
    routeHeader: { flexDirection: 'row', alignItems: 'center' },
    routeBadge: {
        backgroundColor: COLORS.surfaceVariant,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm,
        marginRight: SPACING.md,
    },
    routeBadgeSelected: { backgroundColor: COLORS.primary },
    routeBadgeText: { fontWeight: '800', color: COLORS.primary, fontSize: FONT_SIZE.md },
    routeInfo: { flex: 1 },
    routeName: { fontWeight: '700', color: COLORS.text, fontSize: FONT_SIZE.md },
    routeStops: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, marginTop: 2 },
    checkmark: { fontSize: 24, color: COLORS.primary, fontWeight: 'bold' },

    planCard: {
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.md,
        borderWidth: 2,
        borderColor: 'transparent',
        overflow: 'hidden',
        ...SHADOWS.sm,
    },
    planCardSelected: { borderColor: COLORS.primary },
    planGradient: {
        padding: SPACING.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    planInfo: {},
    planLabel: { fontWeight: '800', fontSize: FONT_SIZE.xl, color: COLORS.text },
    planLabelActive: { color: COLORS.white },
    planDays: { color: COLORS.textSecondary, marginTop: 4 },
    planDaysActive: { color: 'rgba(255,255,255,0.8)' },
    planPriceContainer: { alignItems: 'flex-end' },
    planPrice: { fontWeight: '800', fontSize: FONT_SIZE.xxl, color: COLORS.primary },
    planPriceActive: { color: COLORS.white },
    planSaving: {
        fontSize: FONT_SIZE.xs,
        fontWeight: '700',
        color: COLORS.success,
        backgroundColor: '#D1FAE5',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.full,
        marginTop: 4,
    },
    planSavingActive: { backgroundColor: 'rgba(255,255,255,0.3)', color: COLORS.white },

    summaryCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginVertical: SPACING.lg,
        ...SHADOWS.md,
    },
    summaryTitle: { fontWeight: '800', fontSize: FONT_SIZE.lg, color: COLORS.text, marginBottom: SPACING.md },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.accent,
    },
    summaryLabel: { color: COLORS.textSecondary },
    summaryValue: { fontWeight: '600', color: COLORS.text, flex: 1, textAlign: 'right' },
    summaryTotal: { borderBottomWidth: 0, marginTop: SPACING.sm },
    totalLabel: { fontWeight: '800', fontSize: FONT_SIZE.lg, color: COLORS.text },
    totalValue: { fontWeight: '800', fontSize: FONT_SIZE.xxl, color: COLORS.primary },

    paymentSectionTitle: {
        fontWeight: '700',
        fontSize: FONT_SIZE.lg,
        color: COLORS.text,
        marginTop: SPACING.md,
        marginBottom: SPACING.sm,
    },
    paymentOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 2,
        borderColor: COLORS.accent,
        ...SHADOWS.sm,
    },
    paymentOptionSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.accent },
    paymentIcon: { fontSize: 18 },
    paymentText: { fontWeight: '600', color: COLORS.textSecondary },
    paymentTextSelected: { color: COLORS.primary, fontWeight: '800' },

    totalBanner: {
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: SPACING.lg,
    },
    totalBannerLabel: { color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
    totalBannerValue: { color: COLORS.white, fontWeight: '800', fontSize: FONT_SIZE.xxxl },

    buttonContainer: { marginTop: SPACING.lg },
    navigationButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        marginTop: SPACING.md,
    },
    backButton: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
    },
    backButtonText: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZE.md },
});

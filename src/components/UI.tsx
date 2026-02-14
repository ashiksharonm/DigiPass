import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

interface HeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    onBack?: () => void;
    rightAction?: React.ReactNode;
}

export function GradientHeader({ title, subtitle, showBack, onBack, rightAction }: HeaderProps) {
    return (
        <LinearGradient colors={COLORS.gradient.header as any} style={styles.header}>
            <View style={styles.headerContent}>
                {showBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                )}
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>{title}</Text>
                    {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
                </View>
                {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
            </View>
            {/* Decorative circles */}
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
            <View style={[styles.circle, styles.circle3]} />
        </LinearGradient>
    );
}

interface ActionCardProps {
    icon: string;
    label: string;
    onPress: () => void;
    color?: string;
}

export function ActionCard({ icon, label, onPress, color }: ActionCardProps) {
    return (
        <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.7}>
            <LinearGradient
                colors={color ? [color, color + '99'] : (COLORS.gradient.card as any)}
                style={styles.actionCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Text style={styles.actionIcon}>{icon}</Text>
                <Text style={styles.actionLabel}>{label}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

interface InfoRowProps {
    label: string;
    value: string;
}

export function InfoRow({ label, value }: InfoRowProps) {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );
}

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'filled' | 'outline';
}

export function PrimaryButton({ title, onPress, loading, disabled, variant = 'filled' }: PrimaryButtonProps) {
    if (variant === 'outline') {
        return (
            <TouchableOpacity
                style={[styles.outlineButton, disabled && styles.disabledButton]}
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.7}
            >
                <Text style={styles.outlineButtonText}>{loading ? 'Loading...' : title}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            <LinearGradient
                colors={disabled ? ['#CBD5E1', '#94A3B8'] : (COLORS.gradient.primary as any)}
                style={styles.primaryButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={styles.primaryButtonText}>{loading ? 'Loading...' : title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: any;
    icon?: string;
}

export function InputField({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, icon }: InputFieldProps) {
    const [focused, setFocused] = React.useState(false);
    const RNTextInput = require('react-native').TextInput;

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{icon ? `${icon} ${label}` : label}</Text>
            <RNTextInput
                style={[styles.input, focused && styles.inputFocused]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder || label}
                placeholderTextColor={COLORS.textLight}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoCapitalize="none"
            />
        </View>
    );
}

interface StatCardProps {
    value: string;
    label: string;
    icon: string;
    color?: string;
}

export function StatCard({ value, label, icon, color }: StatCardProps) {
    return (
        <View style={[styles.statCard, { borderLeftColor: color || COLORS.primary }]}>
            <Text style={styles.statIcon}>{icon}</Text>
            <Text style={[styles.statValue, { color: color || COLORS.primary }]}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

interface PassCardProps {
    pass: any;
    onPress?: () => void;
}

export function PassCard({ pass, onPress }: PassCardProps) {
    const isActive = pass.status === 'active';
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <LinearGradient
                colors={isActive ? (COLORS.gradient.dark as any) : ['#6B7280', '#9CA3AF']}
                style={styles.passCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.passCardHeader}>
                    <Text style={styles.passCardTitle}>🚌 DigiPass</Text>
                    <View style={[styles.statusBadge, { backgroundColor: isActive ? '#10B981' : '#EF4444' }]}>
                        <Text style={styles.statusText}>{isActive ? 'ACTIVE' : 'EXPIRED'}</Text>
                    </View>
                </View>
                <View style={styles.passCardBody}>
                    <Text style={styles.passName}>{pass.passengerName}</Text>
                    <Text style={styles.passRoute}>{pass.journeyFrom} → {pass.journeyTo}</Text>
                    <View style={styles.passDetails}>
                        <Text style={styles.passDetail}>Bus: {pass.busNo}</Text>
                        <Text style={styles.passDetail}>{pass.passType.toUpperCase()}</Text>
                    </View>
                </View>
                <View style={styles.passCardFooter}>
                    <Text style={styles.passExpiry}>Expires: {pass.expiresAt}</Text>
                    <Text style={styles.passAmount}>₹{pass.amountPaid}</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    // Header
    header: {
        paddingTop: 50,
        paddingBottom: SPACING.xl,
        paddingHorizontal: SPACING.lg,
        borderBottomLeftRadius: BORDER_RADIUS.xl,
        borderBottomRightRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        position: 'relative',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: '800',
        color: COLORS.white,
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: FONT_SIZE.md,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    backButton: {
        marginRight: SPACING.md,
        padding: SPACING.xs,
    },
    backText: {
        fontSize: 24,
        color: COLORS.white,
        fontWeight: 'bold',
    },
    rightAction: {
        marginLeft: SPACING.md,
    },
    circle: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    circle1: {
        width: 120,
        height: 120,
        top: -30,
        right: -20,
    },
    circle2: {
        width: 80,
        height: 80,
        top: 10,
        right: 60,
    },
    circle3: {
        width: 60,
        height: 60,
        bottom: -20,
        left: -10,
    },

    // Action Card
    actionCard: {
        width: (width - SPACING.lg * 2 - SPACING.md) / 2,
        marginBottom: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        ...SHADOWS.md,
    },
    actionCardGradient: {
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
    },
    actionIcon: {
        fontSize: 32,
        marginBottom: SPACING.sm,
    },
    actionLabel: {
        fontSize: FONT_SIZE.md,
        fontWeight: '700',
        color: COLORS.white,
        textAlign: 'center',
    },

    // Info Row
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.accent,
    },
    infoLabel: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
        fontWeight: '700',
        flex: 1,
        textAlign: 'right',
    },

    // Primary Button
    primaryButton: {
        paddingVertical: SPACING.md + 2,
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '800',
        color: COLORS.white,
        letterSpacing: 1,
    },
    outlineButton: {
        paddingVertical: SPACING.md + 2,
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    outlineButtonText: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: 1,
    },
    disabledButton: {
        opacity: 0.5,
    },

    // Input Field
    inputContainer: {
        marginBottom: SPACING.md,
    },
    inputLabel: {
        fontSize: FONT_SIZE.sm,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: FONT_SIZE.lg,
        color: COLORS.text,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    inputFocused: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.white,
    },

    // Stat Card
    statCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        borderLeftWidth: 4,
        ...SHADOWS.sm,
        flex: 1,
        alignItems: 'center',
    },
    statIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    statValue: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '800',
    },
    statLabel: {
        fontSize: FONT_SIZE.xs,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 2,
    },

    // Pass Card
    passCard: {
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
    },
    passCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    passCardTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '800',
        color: COLORS.white,
    },
    statusBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.full,
    },
    statusText: {
        fontSize: FONT_SIZE.xs,
        fontWeight: '800',
        color: COLORS.white,
        letterSpacing: 1,
    },
    passCardBody: {
        marginBottom: SPACING.md,
    },
    passName: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: 4,
    },
    passRoute: {
        fontSize: FONT_SIZE.md,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: SPACING.sm,
    },
    passDetails: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    passDetail: {
        fontSize: FONT_SIZE.sm,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
    },
    passCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
        paddingTop: SPACING.md,
    },
    passExpiry: {
        fontSize: FONT_SIZE.sm,
        color: 'rgba(255,255,255,0.7)',
    },
    passAmount: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '800',
        color: COLORS.white,
    },
});

import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
    KeyboardAvoidingView, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { InputField, PrimaryButton } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export default function SignUpScreen({ navigation }: any) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // Role is always passenger for sign up
    const role = 'passenger';
    // const [role, setRole] = useState<'passenger' | 'conductor'>('passenger');
    const { signUp, isLoading } = useAuth();

    // Import auth to check config
    const { auth } = require('../services/firebase');

    const checkFirebaseConfig = () => {
        if (auth.app.options.apiKey === "YOUR_API_KEY") {
            Alert.alert(
                'Configuration Required',
                'Please update src/services/firebase.ts with your Firebase configuration details.'
            );
            return false;
        }
        return true;
    };

    const handleSignUp = async () => {
        if (!checkFirebaseConfig()) return;

        if (!name || !email || !phone || !password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        const success = await signUp({ name, email, phone, address, gender, role }, password);
        if (!success) {
            Alert.alert('Error', 'Failed to create account');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <LinearGradient colors={COLORS.gradient.primary as any} style={styles.headerSection}>
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerIcon}>📝</Text>
                    <Text style={styles.headerTitle}>SIGN UP TO{'\n'}GET STARTED!</Text>
                </View>
            </LinearGradient>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.formSection}
            >
                <View style={styles.formCard}>
                    {/* Role Selection Removed - Passengers Only */}
                    {/* 
                    <Text style={styles.sectionLabel}>I AM A</Text>
                    <View style={styles.roleSelector}>
                       ...
                    </View> 
                    */}

                    <InputField label="Full Name" icon="👤" value={name} onChangeText={setName} placeholder="Enter your full name" />
                    <InputField label="Email" icon="📧" value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" />
                    <InputField label="Mobile Number" icon="📱" value={phone} onChangeText={setPhone} placeholder="+91 XXXXX XXXXX" keyboardType="phone-pad" />
                    <InputField label="Address" icon="🏠" value={address} onChangeText={setAddress} placeholder="Enter your address" />

                    {/* Gender Selection */}
                    <Text style={styles.fieldLabel}>⚧ GENDER</Text>
                    <View style={styles.genderSelector}>
                        {['Male', 'Female', 'Other'].map(g => (
                            <TouchableOpacity
                                key={g}
                                style={[styles.genderButton, gender === g && styles.genderButtonActive]}
                                onPress={() => setGender(g)}
                            >
                                <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>{g}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <InputField label="Password" icon="🔒" value={password} onChangeText={setPassword} placeholder="Create a password" secureTextEntry />
                    <InputField label="Confirm Password" icon="🔐" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm your password" secureTextEntry />

                    <View style={styles.buttonContainer}>
                        <PrimaryButton title="REGISTER" onPress={handleSignUp} loading={isLoading} />
                    </View>

                    <View style={styles.signInLink}>
                        <Text style={styles.signInText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.signInLinkText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { flexGrow: 1 },
    headerSection: {
        paddingTop: 50,
        paddingBottom: 30,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
        position: 'relative',
    },
    circle: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.12)',
    },
    circle1: { width: 120, height: 120, top: -20, right: -20 },
    circle2: { width: 80, height: 80, bottom: -20, left: -10 },
    backBtn: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, zIndex: 10 },
    backText: { color: COLORS.white, fontSize: FONT_SIZE.lg, fontWeight: '600' },
    headerContent: { alignItems: 'center', padding: SPACING.md, zIndex: 10 },
    headerIcon: { fontSize: 36, marginBottom: SPACING.sm },
    headerTitle: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: '900',
        color: COLORS.white,
        textAlign: 'center',
        lineHeight: 32,
    },
    formSection: { flex: 1, padding: SPACING.lg },
    formCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        ...SHADOWS.lg,
    },
    sectionLabel: {
        fontSize: FONT_SIZE.sm,
        fontWeight: '700',
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
        letterSpacing: 1,
    },
    roleSelector: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    roleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 2,
        borderColor: COLORS.accent,
        backgroundColor: COLORS.surfaceVariant,
    },
    roleButtonActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.accent,
    },
    roleIcon: { fontSize: 24 },
    roleText: { fontWeight: '600', color: COLORS.textSecondary },
    roleTextActive: { color: COLORS.primary, fontWeight: '800' },
    fieldLabel: {
        fontSize: FONT_SIZE.sm,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    genderSelector: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    genderButton: {
        flex: 1,
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 2,
        borderColor: COLORS.accent,
        alignItems: 'center',
    },
    genderButtonActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.accent,
    },
    genderText: { fontWeight: '600', color: COLORS.textSecondary },
    genderTextActive: { color: COLORS.primary, fontWeight: '800' },
    buttonContainer: { marginTop: SPACING.lg },
    signInLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING.lg,
    },
    signInText: { color: COLORS.textSecondary },
    signInLinkText: { color: COLORS.primary, fontWeight: '700', textDecorationLine: 'underline' },
});

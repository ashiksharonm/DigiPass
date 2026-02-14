import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
    KeyboardAvoidingView, Platform, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { InputField, PrimaryButton } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../services/firebase';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'passenger' | 'conductor'>('passenger');
    // Import CONDUCTORS
    const { CONDUCTORS } = require('../data/conductors');
    const { GOOGLE_WEB_CLIENT_ID } = require('../services/firebase');
    const { signIn, signUp, isLoading } = useAuth();

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: GOOGLE_WEB_CLIENT_ID,
        iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
        androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .catch(error => Alert.alert('Login Error', error.message));
        }
    }, [response]);

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

    const handleSignIn = async () => {
        if (!checkFirebaseConfig()) return;

        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // Conductor Login Logic
        if (role === 'conductor') {
            const validConductor = CONDUCTORS.find((c: any) => c.email === email && c.password === password);
            if (validConductor) {
                const success = await signIn(email, password);
                if (!success) {
                    Alert.alert('Login Failed', 'Conductor credentials found locally but Firebase Auth failed. Please ensure this user exists in Firebase Authentication.');
                }
                return;
            } else {
                Alert.alert('Access Denied', 'Invalid Conductor credentials. Please use the credentials provided by the administration.');
                return;
            }
        }

        // Passenger Login
        const success = await signIn(email, password);
        if (!success) {
            Alert.alert('Error', 'Invalid credentials. Please checking your email/password.');
        }
    };

    const handleDemoPassenger = async () => {
        // Workaround: Try to sign in. If fails (doesn't exist), create it.
        const success = await signIn('passenger@demo.com', 'password123');
        if (!success) {
            // Attempt to create the demo user
            const created = await signUp(
                { email: 'passenger@demo.com', name: 'Demo Passenger', role: 'passenger' },
                'password123'
            );
            if (created) {
                // Auto-login handled by AuthContext
                Alert.alert('Demo Account Created', 'You are now logged in as the Demo Passenger.');
            } else {
                Alert.alert('Demo Error', 'Could not create demo account. Please check console.');
            }
        }
    };

    const handleDemoConductor = async () => {
        const success = await signIn('conductor@demo.com', 'password123');
        if (!success) Alert.alert('Demo Error', 'Demo account not found. Please Sign Up first.');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {/* Header with decorative circles */}
            <LinearGradient colors={COLORS.gradient.primary as any} style={styles.headerSection}>
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
                <View style={[styles.circle, styles.circle3]} />
                <View style={styles.logoContainer}>
                    <Text style={styles.logoIcon}>🚌</Text>
                    <Text style={styles.welcomeText}>WELCOME TO{'\n'}DIGIPASS!</Text>
                </View>
            </LinearGradient>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.formSection}
            >
                <View style={styles.formCard}>
                    {/* Role Selector */}
                    <View style={{ flexDirection: 'row', backgroundColor: COLORS.surfaceVariant, padding: 4, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.lg }}>
                        <TouchableOpacity
                            style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: BORDER_RADIUS.md, backgroundColor: role === 'passenger' ? COLORS.white : 'transparent', ...((role === 'passenger' ? SHADOWS.sm : {})) }}
                            onPress={() => setRole('passenger')}
                        >
                            <Text style={{ fontWeight: '700', color: role === 'passenger' ? COLORS.primary : COLORS.textSecondary }}>Passenger</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: BORDER_RADIUS.md, backgroundColor: role === 'conductor' ? COLORS.white : 'transparent', ...((role === 'conductor' ? SHADOWS.sm : {})) }}
                            onPress={() => setRole('conductor')}
                        >
                            <Text style={{ fontWeight: '700', color: role === 'conductor' ? COLORS.primary : COLORS.textSecondary }}>Conductor</Text>
                        </TouchableOpacity>
                    </View>

                    <InputField
                        label="Email"
                        icon="📧"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                    />
                    <InputField
                        label="Password"
                        icon="🔒"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                            title="SIGN IN"
                            onPress={handleSignIn}
                            loading={isLoading}
                        />
                    </View>

                    {/* Social Login - Temporarily Disabled via Workaround
                    {role === 'passenger' && (
                        <>
                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>or continue with</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <View style={styles.socialButtons}>
                                <TouchableOpacity style={styles.socialButton} onPress={() => promptAsync()} disabled={!request}>
                                    <Text style={styles.socialButtonText}>G</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )} 
                    */}

                    {/* Sign Up Link */}
                    <View style={styles.signUpLink}>
                        <Text style={styles.signUpText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={styles.signUpLinkText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Demo Buttons */}
                <View style={styles.demoSection}>
                    <Text style={styles.demoTitle}>Quick Demo Access</Text>
                    <Text style={styles.demosubtitle}>(Requires 'passenger@demo.com' / 'conductor@demo.com')</Text>
                    <View style={styles.demoButtons}>
                        <TouchableOpacity style={styles.demoButton} onPress={handleDemoPassenger}>
                            <LinearGradient
                                colors={['#10B981', '#059669']}
                                style={styles.demoButtonGradient}
                            >
                                <Text style={styles.demoButtonIcon}>🧑‍💼</Text>
                                <Text style={styles.demoButtonText}>Passenger</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.demoButton} onPress={handleDemoConductor}>
                            <LinearGradient
                                colors={['#3B82F6', '#2563EB']}
                                style={styles.demoButtonGradient}
                            >
                                <Text style={styles.demoButtonIcon}>👨‍✈️</Text>
                                <Text style={styles.demoButtonText}>Conductor</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    headerSection: {
        paddingTop: 60,
        paddingBottom: 40,
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
    circle1: { width: 150, height: 150, top: -30, right: -30 },
    circle2: { width: 100, height: 100, top: 20, right: 60 },
    circle3: { width: 80, height: 80, bottom: -20, left: -20 },
    logoContainer: {
        alignItems: 'center',
        zIndex: 10,
    },
    logoIcon: {
        fontSize: 48,
        marginBottom: SPACING.sm,
    },
    welcomeText: {
        fontSize: FONT_SIZE.xxxl,
        fontWeight: '900',
        color: COLORS.white,
        textAlign: 'center',
        lineHeight: 40,
    },
    formSection: {
        flex: 1,
        padding: SPACING.lg,
    },
    formCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        ...SHADOWS.lg,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: SPACING.md,
    },
    forgotPasswordText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: FONT_SIZE.sm,
    },
    buttonContainer: {
        marginTop: SPACING.sm,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.accent,
    },
    dividerText: {
        paddingHorizontal: SPACING.md,
        color: COLORS.textSecondary,
        fontSize: FONT_SIZE.sm,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.lg,
    },
    socialButton: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.surfaceVariant,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.sm,
    },
    socialButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    signUpLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING.lg,
    },
    signUpText: {
        color: COLORS.textSecondary,
    },
    signUpLinkText: {
        color: COLORS.primary,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    demoSection: {
        marginTop: SPACING.lg,
        alignItems: 'center',
    },
    demoTitle: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    demosubtitle: {
        fontSize: 10,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    demoButtons: {
        flexDirection: 'column', // Stack vertically for better layout
        gap: SPACING.md,
        width: '100%',
    },
    demoButton: {
        flex: 1,
        borderRadius: BORDER_RADIUS.lg,
        ...SHADOWS.sm,
    },
    demoButtonGradient: {
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.sm,
    },
    demoButtonIcon: {
        fontSize: 20,
    },
    demoButtonText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: FONT_SIZE.md,
    },
});

import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/assets/mainColor/colors.js";
import { customCard, dvmBtn } from "@/assets/themes/style";
import { useState, useContext } from "react";
import { useFonts, IBMPlexSans_400Regular, IBMPlexSans_700Bold } from '@expo-google-fonts/ibm-plex-sans';
import Loading from "./components/card/loading";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useMutation } from "@tanstack/react-query";
import { LoginHandaler } from "../assets/api/authFetch";
import { useAlertStore } from "@/assets/store/aleartStore.js";
import { useRouter } from "expo-router";
import { AuthContext } from "./hook/authContex.jsx"; // <-- import your AuthProvider context

export default function Login() {
    const [fontsLoaded] = useFonts({
        IBMPlexSans_400Regular,
        IBMPlexSans_700Bold,
    });

    const { setUserData } = useContext(AuthContext);
    const { setSuccess, setError } = useAlertStore();
    const router = useRouter();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [focus, setFocus] = useState(null);

    // -------------------------------
    // Mutation for login
    // -------------------------------
    const mutation = useMutation({
        mutationFn: (data) => LoginHandaler(data),
        onError: (err) => {
            setError(err?.message || "Login failed");
        },
        onSuccess: async (data) => {
            setSuccess(data?.message || "Login successful");

            if (data?.jwt) {
                const userObject = data.user || { id: "temp_id", email: formData.email };

                await setUserData(userObject, data.jwt);
                router.replace("/");
            }
        },
    });

    // -------------------------------
    // Validation
    // -------------------------------
    const validatedForm = () => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!formData.email.trim()) {
            setError("Email is required");
            return false;
        }
        if (!emailPattern.test(formData.email)) {
            setError("Invalid email format");
            return false;
        }
        if (!formData.password.trim()) {
            setError("Password is required");
            return false;
        }
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return false;
        }
        return true;
    };

    const handleLogin = () => {
        if (validatedForm()) {
            mutation.mutate(formData);
        }
    };

    // -------------------------------
    // Render UI
    // -------------------------------
    if (!fontsLoaded) return <Loading />;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAwareScrollView
                    enableOnAndroid
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.container}>
                        <View style={[styles.form, customCard.cardNormal]}>
                            <Text style={styles.text}>Login</Text>

                            {/* Email Input */}
                            <TextInput
                                onFocus={() => setFocus('email')}
                                onBlur={() => setFocus(null)}
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                style={[
                                    styles.input,
                                    { borderColor: focus === 'email' ? Colors.primary : "#E5E7EB" }
                                ]}
                                placeholder="Email"
                                placeholderTextColor={Colors.textPrimary}
                            />

                            {/* Password Input */}
                            <TextInput
                                onFocus={() => setFocus('password')}
                                onBlur={() => setFocus(null)}
                                value={formData.password}
                                onChangeText={(text) => setFormData({ ...formData, password: text })}
                                style={[
                                    styles.input,
                                    { borderColor: focus === 'password' ? Colors.primary : "#E5E7EB" }
                                ]}
                                secureTextEntry
                                placeholder="Password"
                                placeholderTextColor={Colors.textPrimary}
                            />

                            {/* Login Button */}
                            <Pressable onPress={handleLogin} style={[dvmBtn.btnPrimary, styles.loginBtn]}>
                                {mutation.isPending ? (
                                    <ActivityIndicator color="white" size={20} />
                                ) : (
                                    <Text style={styles.loginText}>Login</Text>
                                )}
                            </Pressable>

                            {/* Forget Password */}
                            <Pressable style={{ alignSelf: "center" }}>
                                <Text style={{ color: Colors.textPrimary }}>Forget Password?</Text>
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

// -------------------------------
// Styles
// -------------------------------
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        padding: 15,
        backgroundColor: Colors.bgPrimary,
        justifyContent: "center",
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "100%",
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: Colors.textPrimary,
        alignSelf: "center",
        fontSize: 30,
        fontFamily: "IBMPlexSans_700Bold",
    },
    form: {
        width: "100%",
        padding: 15,
        marginTop: 15,
        gap: 25,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 15,
        width: "100%",
        paddingVertical: 15,
        paddingHorizontal: 20,
        color: Colors.textPrimary,
        fontWeight: "bold",
    },
    loginBtn: {
        alignSelf: "center",
        width: "60%",
        marginTop: 15,
        height: "13%",
    },
    loginText: {
        color: Colors.textPrimary,
        fontWeight: "900",
    },
});
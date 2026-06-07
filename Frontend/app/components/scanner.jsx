import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, Pressable, Button, Vibration } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors } from "@/assets/mainColor/colors.js";
import { shadowStyles } from "@/assets/themes/style.js";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useMutation } from "@tanstack/react-query";
import { checkInviteLink } from "@/assets/api/fetchData.js";
import Error from "./card/error.jsx";
import { useModalStore } from '@/assets/store/modalStore.js';
import { Audio } from 'expo-av';
import Octicons from '@expo/vector-icons/Octicons.js';

const { width } = Dimensions.get('window');

export default function Scanner() {
    const [permission, requestPermission] = useCameraPermissions();
    const { openModal, setQrToken } = useModalStore();

    const [scanned, setScanned] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const router = useRouter();
    const scanLock = useRef(false);
    const lastScanTime = useRef(0);
    const sound = useRef(new Audio.Sound());

    const playSound = async (status) => {
        try {
            await sound.current.unloadAsync();
            if (status === 'success') {
                await sound.current.loadAsync(require('@/assets/sounds/success1.mp3'));
            } else {
                await sound.current.loadAsync(require('@/assets/sounds/error2.mp3'));
            }
            await sound.current.playAsync();
        } catch (e) {
            console.log("Error playing sound", e);
        }
    };

    const mutation = useMutation({
        mutationFn: (data) => checkInviteLink(data),
        onSuccess: (data, variables) => {
            Vibration.vibrate(100);   // Short vibration
            playSound("success");              // Ti sound

            setQrToken(variables, data.gId);
            openModal("forInviteConfirm");
        },
        onError: (error) => {
            Vibration.vibrate(100);
            playSound("error");
            setErrorMessage(
                error?.response?.data?.message || error?.message || "Invalid QR Code"
            );
        },
        onSettled: () => {
            // Unlock scanning for next attempt
            scanLock.current = false;
            setScanned(false);
        }
    });

    // Scan handler with debounce + lock
    const handleScan = useCallback(({ data }) => {
        const now = Date.now();
        if (scanned || mutation.isPending || scanLock.current || now - lastScanTime.current < 500) return;

        lastScanTime.current = now;
        scanLock.current = true;
        setScanned(true);

        mutation.mutate(data);
    }, [scanned, mutation]);

    const refreshCamera = () => {
        setErrorMessage(null);
        setScanned(false);
        mutation.reset();
        scanLock.current = false;
    };

    if (!permission) return <View />;
    if (!permission?.granted) {
        return (
            <View style={styles.btnContainer}>
                <Text style={styles.message}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={handleScan}
            />

            {/* Overlay */}
            <View style={styles.overlay}>
                <View style={styles.unfocusedContainer}></View>

                <View style={styles.middleContainer}>
                    <View style={styles.unfocusedContainer}></View>

                    <View style={styles.focusedContainer}>
                        <View style={[styles.cornor, styles.leftCornor]} />
                        <View style={[styles.cornor, styles.rightCornor]} />
                        <View style={[styles.cornor, styles.bottomLeft]} />
                        <View style={[styles.cornor, styles.bottomRight]} />
                    </View>

                    <View style={styles.unfocusedContainer}></View>
                </View>

                <View style={styles.unfocusedContainer}>
                    <View style={styles.infoBox}>
                        <Text style={styles.text}>
                            Scan QR to join a team!
                        </Text>
                    </View>
                </View>
            </View>

            <Pressable style={styles.backBtn} onPress={() => router.back()}>
                <Octicons
                    name="arrow-left"
                    size={40}
                    color={Colors.primary}
                />
            </Pressable>

            {errorMessage && (
                <Error
                    message={errorMessage}
                    fn={refreshCamera}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    btnContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    unfocusedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleContainer: { flexDirection: 'row', height: 250 },
    focusedContainer: {
        width: 250,
        height: 250,
        backgroundColor: 'transparent',
        position: "relative",
    },
    infoBox: {
        width: 250,
        backgroundColor: "rgba(0,0,0,0.6)",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        borderRadius: 10
    },
    text: { color: 'white', fontWeight: 'bold' },
    cornor: { width: 40, height: 40, position: "absolute" },
    leftCornor: {
        borderTopWidth: shadowStyles.borderWidth.lg,
        borderLeftWidth: shadowStyles.borderWidth.lg,
        borderColor: Colors.primary,
        borderTopLeftRadius: 20,
        top: 0,
        left: 0,
    },
    rightCornor: {
        borderTopWidth: shadowStyles.borderWidth.lg,
        borderRightWidth: shadowStyles.borderWidth.lg,
        borderColor: Colors.primary,
        borderTopRightRadius: 20,
        top: 0,
        right: 0
    },
    bottomLeft: {
        borderBottomWidth: shadowStyles.borderWidth.lg,
        borderLeftWidth: shadowStyles.borderWidth.lg,
        borderColor: Colors.primary,
        borderBottomLeftRadius: 20,
        bottom: 0,
        left: 0,
    },
    bottomRight: {
        borderBottomWidth: shadowStyles.borderWidth.lg,
        borderRightWidth: shadowStyles.borderWidth.lg,
        borderColor: Colors.primary,
        borderBottomEndRadius: 20,
        bottom: 0,
        right: 0,
    },
    backBtn: { position: "absolute", top: 50, left: 20 }
});

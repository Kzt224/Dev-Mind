import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/assets/mainColor/colors.js";
import { customCard } from "@/assets/themes/style.js";
import { useContext, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateuserInfo, updatePassword } from "@/assets/api/fetchUser.js";
import Loading from "../card/loading.jsx";
import Error from "../card/error.jsx";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getSettinInfoIcon } from "../../../assets/libs/GetIcon.js";
import { dvmBtn } from "../../../assets/themes/style.js";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { checkMandatoryFields } from "../../../assets/helper/mandatory.js";
import { useAlertStore } from "@/assets/store/aleartStore.js";
import { useNavBarHeight } from "../../hook/navHeighContex.jsx";
import { useBottomBarHeight } from "../../hook/barHeighContex.jsx";
import { LanguageContext } from "../../hook/languageContex.jsx";
import Feather from '@expo/vector-icons/Feather';

export default function AccountDetail() {

    const { id } = useLocalSearchParams();
    const { NavBarHeight } = useNavBarHeight();
    const { bottomBarHeight } = useBottomBarHeight();
    const { t } = useContext(LanguageContext);
    const { data: item, isLoading, isError, refetch } = useQuery({
        queryKey: ['userInfo', id],
        queryFn: () => getUserById(id),
        enabled: !!id
    });
    const { setSuccess, setError } = useAlertStore();
    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [upPass, setPassword] = useState({
        password: ""
    });
    const user = item?.user;
    const [validateFail, setValidateFail] = useState([]);
    const queryClient = useQueryClient();

    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        if (user) {
            setFormData(user);
            setOriginalData(user);
        }
    }, [user]);
    const mutation = useMutation({
        mutationFn: (formData) => {
            return updateuserInfo(formData);
        },
        onSuccess: (data) => {
            setSuccess(data?.message || "success");
            queryClient.invalidateQueries(['userInfo', id]);
        }
    });
    const upPasswMutation = useMutation({
        mutationFn: (data) => {
            return updatePassword(data?.password);
        },
        onSuccess: (data) => {
            if (data?.message) {
                setSuccess(data?.message || "success")
            }
        },
        onError: (error) => {
            setError(error?.message);
        },
    })
    const validate = (formData) => {
        const missingFields = checkMandatoryFields(formData);
        if (missingFields.length > 0) {
            setValidateFail(missingFields);
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        try {
            const check = validate(formData);
            if (check) {
                mutation.mutate(formData)
            }
        } catch (error) {
            console.error(error);
        }
    };


    if (isLoading) return <Loading />;
    if (isError) return <Error fn={refetch} />;

    const isChanged =
        JSON.stringify(formData) !== JSON.stringify(originalData);

    const handleChangePassword = () => {
        try {
            if (upPass?.password.trim() === '') {
                setValidateFail(upPass?.password)
            }
            upPasswMutation.mutate(upPass);
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: Colors.bgPrimary,
                    padding: 15,
                }}

            >
                <ScrollView showsVerticalScrollIndicator={false}
                    style={{ marginBottom: bottomBarHeight }}
                >
                    <KeyboardAwareScrollView
                        enableOnAndroid={true}
                        keyboardShouldPersistTaps="handled"
                        extraScrollHeight={20}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}
                    >
                        {/* user information part */}
                        <View style={[styles.card, customCard["cardNormal"]]}>
                            <Text
                                style={{
                                    color: Colors.primary,
                                    fontWeight: "bold",
                                    fontSize: 16
                                }}
                            >
                                {t["Your Info"]}
                            </Text>

                            {Object.entries(formData)?.map(([key, value]) => (
                                <View style={styles.info} key={key}>
                                    <MaterialIcons
                                        name={getSettinInfoIcon(key)}
                                        size={24}
                                        color={Colors.textPrimary}
                                    />

                                    <TextInput
                                        placeholder={`Enter ${key}`}
                                        placeholderTextColor={Colors.textSecondary}
                                        keyboardType={key === "phone" ? "numeric" : ""}
                                        style={[
                                            { borderBottomColor: validateFail?.includes(key) ? Colors.danger : Colors.gray },
                                            styles.input,
                                        ]}
                                        value={value != null ? value.toString() : ''}
                                        onChangeText={(text) => {
                                            setValidateFail([]);
                                            setFormData(prev => {
                                                if (prev[key] === text) return prev;
                                                return {
                                                    ...prev,
                                                    [key]: text
                                                };
                                            });
                                        }}
                                    />
                                </View>
                            ))}

                            <Pressable
                                style={[
                                    { alignSelf: "flex-end", marginTop: 15 },
                                    isChanged
                                        ? dvmBtn["btnPrimary"]
                                        : dvmBtn["btnDisable"]
                                ]}
                                disabled={!isChanged}
                                onPress={handleSubmit}
                            >
                                {mutation.isPending ? (
                                    <ActivityIndicator size={35} color={Colors.primary} />
                                ) : (
                                    <Text
                                        style={{
                                            color: isChanged
                                                ? Colors.textPrimary
                                                : Colors.primary,
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {t["Submit"]}
                                    </Text>
                                )}

                            </Pressable>
                        </View>

                        <View
                            style={[
                                styles.card,
                                { marginTop: 15 },
                                customCard["cardNormal"]
                            ]}
                        >
                            <Text
                                style={{
                                    color: Colors.primary,
                                    fontWeight: "bold",
                                    fontSize: 16
                                }}
                            >
                                {t["Update password"]}
                            </Text>

                            <View style={styles.info}>
                                <MaterialIcons
                                    name="key"
                                    size={26}
                                    color={Colors.textPrimary}
                                />

                                <TextInput
                                    placeholder="Enter password"
                                    placeholderTextColor={Colors.textSecondary}
                                    value={upPass?.password}
                                    style={[{ borderBottomColor: Colors.gray }, styles.input]}
                                    onChangeText={(text) => setPassword({ ...upPass, password: text })}
                                    secureTextEntry={!showPassword}
                                />
                                <Pressable onPress={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: 20
                                    }}
                                >
                                    {showPassword ? (
                                        <Feather name="eye-off"
                                            size={23} color={Colors.textPrimary} />
                                    ) : (
                                        <Feather name="eye"
                                            size={23} color={Colors.textPrimary} />
                                    )}
                                </Pressable>
                            </View>

                            <Pressable
                                onPress={handleChangePassword}
                                style={[
                                    {
                                        alignSelf: "flex-end",
                                        marginTop: 15
                                    },
                                    upPass?.password === "" ?
                                        dvmBtn["btnDisable"] : dvmBtn['btnPrimary']
                                ]}
                            >
                                <Text
                                    style={{
                                        color: upPass?.password === '' ? Colors.primary : Colors.textPrimary,
                                        fontWeight: "bold"
                                    }}
                                >
                                    {t["Submit"]}
                                </Text>
                            </Pressable>
                        </View>
                    </KeyboardAwareScrollView>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "column",
        padding: 15,
        gap: 15
    },
    info: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        width: "100%"
    },
    input: {
        borderBottomWidth: 1,
        width: "80%",
        color: Colors.textPrimary
    }
});
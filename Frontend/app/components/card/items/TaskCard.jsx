import Entypo from "@expo/vector-icons/Entypo";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { getTaskEndDate } from "../../../../assets/helper/calculateDate";
import { Colors } from "../../../../assets/mainColor/colors";
import Progress from "../../progress";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts, Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { customCard } from "../../../../assets/themes/style";
import { useRouter } from "expo-router";
import ActionButton from "../../button/actionBtn";
import { useState } from "react";


export default function TaskCard({ data }) {
    const [activeId, setActiveId] = useState(null);
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });
    const router = useRouter();

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color={Colors.primary} />;
    }
    const handleNavigate = (item) => {
        if (!item) return;

        router.push({
            pathname: `/taskDetail`,
            params: { id: JSON.parse(item.id) },
        });
    };
    const onToggle = (id) => {
        setActiveId(prevId => (prevId === id ? null : id));
    }
    const calculatedText = (text) => {
        if (!text) return '';
        let result = '';
        if (text.length > 27) {
            result = text.slice(0, 27) + "...";
        } else {
            result = text;
        }
        return result;
    }
    return (
        <View >
            {data.map((d) => (
                <Pressable onPress={() => handleNavigate(d)} key={d?.id} style={[styles.itemContainer, customCard['cardNormal']]}>
                    <View style={styles.upperContainer}>
                        <Text style={{
                            color: Colors.textPrimary,
                            fontFamily: "Inter_700Bold",
                            fontSize: 20,
                        }}>{calculatedText(d?.name)}</Text>
                        {/* action button */}
                        <ActionButton
                            useFor={"task"}
                            item={d}
                            activeId={activeId}
                            onToggle={() => onToggle(d?.id)}
                        />
                    </View>
                    <View style={styles.middleContainer}>
                        <View style={styles.innerLeftConitainer}>
                            <Text
                                style={{
                                    color: Colors.textSecondary,
                                    fontFamily: "Inter_700Bold",
                                    fontSize: 16,
                                }}
                            >Progress</Text>
                            <View style={styles.dateContainer}>
                                <Text style={{ fontWeight: "bold", fontSize: 12 }}>{getTaskEndDate(d?.endDate)}</Text>
                            </View>
                        </View>
                        <View style={styles.innerRightContiner}>
                            <Text style={{ color: Colors.textSecondary, fontWeight: "bold" }}>Status: {(d?.status).charAt(0).toUpperCase() + d?.status?.slice(1).toLowerCase()}</Text>
                        </View>
                    </View>
                    <Progress pg={d?.progress} />
                    <View style={styles.bottomContainer}>
                        <View style={styles.checkContainer}>
                            <FontAwesome name="check-circle" size={22} color={Colors.success} />
                            <Text style={{ color: Colors.textSecondary, fontWeight: "bold" }}>AI Health Check</Text>
                        </View>
                        <Text style={{ color: Colors.textSecondary, fontWeight: "bold" }}>{d?.progress}%</Text>
                    </View>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        padding: 15,
        marginTop: 15,
        flexDirection: "col",
        alignItems: "center",
    },
    upperContainer: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center"
    },
    middleContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 8
    },
    innerLeftConitainer: {
        display: "flex",
        flexDirection: "row",
        gap: 8
    },
    dateContainer: {
        backgroundColor: Colors.bgWarning,
        padding: 4,
        borderRadius: 8
    },
    bottomContainer: {
        display: "flex",
        width: "100%",
        marginTop: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    checkContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.bgSuccess,
        padding: 3,
        gap: 8,
        paddingHorizontal: 5,
        borderRadius: 10
    }
})
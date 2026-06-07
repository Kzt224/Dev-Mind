import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../../assets/mainColor/colors";
import { customCard } from "../../../../assets/themes/style";
import { useFonts, Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import tepImage from "@/assets/images/bgImages/applogo.png";
import { useRouter } from "expo-router";

export default function ProjectCard({ data }) {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });
    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color={Colors.primary} />;
    }
    const router = useRouter();

    const projectStatus = (progress) => {
        if (!progress) return 'Not Start';
        if (progress > 0) {
            return "In Progress";
        } else if (progress === 100) {
            return "Finished"
        } else {
            return "Not Start";
        }
    }

    const handleNavigate = (item) => {
        if (!item) return;

        router.push({
            pathname: `/projectDetail`,
            params: { id: JSON.parse(item.id) },
        });
    };
    return (

        <View style={{ padding: 15 }}>
            <ScrollView>
                {data?.map((d) => (
                    <Pressable onPress={() => handleNavigate(d)} key={d?.id} style={[styles.itemContainer, customCard['cardNormal']]}>
                        <View style={styles.upperContainer}>
                            <View style={{ width: "85%" }}>
                                <Text style={{
                                    color: Colors.textPrimary,
                                    fontFamily: "Inter_700Bold",
                                    fontSize: 20,
                                }}>{d?.name}</Text>
                            </View>
                            <Pressable >
                                <Entypo name="dots-three-vertical" size={20} color={Colors.textPrimary} />
                            </Pressable>
                        </View>
                        <View style={styles.middleContainer}>
                            <View style={styles.innerLeftConitainer}>
                                <View style={[styles.checkContainer, {
                                    backgroundColor: Colors.cardBlue
                                }]}>
                                    <Text style={{ color: Colors.primary, fontWeight: "bold" }}>Frontend</Text>
                                </View>
                                <View style={[styles.checkContainer, {
                                    backgroundColor: Colors.cardRose
                                }]}>
                                    <Text style={{ color: Colors.tagUrgentText, fontWeight: "bold" }}>Urgent</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.bottomContainer}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View style={[styles.imageContainer, { position: "relative" }]}>
                                    <Image source={tepImage} style={{ width: 45, height: 45, borderRadius: 50 }} />
                                </View>
                                <View style={[styles.secondImageContainer, { left: 35 }]}>
                                    <View style={styles.imageContainer}>
                                        <Image source={tepImage} style={{ width: 45, height: 45, borderRadius: 50 }} />
                                    </View>
                                </View>
                                <View style={[styles.secondImageContainer, { left: 65 }]}>
                                    <View style={[styles.imageContainer, { backgroundColor: Colors.bgPrimary }]}>
                                        <Text style={{ color: Colors.textPrimary, alignSelf: "center" }}>5+</Text>
                                    </View>
                                </View>
                            </View>
                            <Pressable style={[styles.checkContainer, {
                                backgroundColor: Colors.bgWarning
                            }]}>
                                <Text style={{ color: Colors.warning, fontWeight: "bold" }}>{projectStatus(d?.progress)}</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
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
        alignItems: "baseline",
    },
    middleContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
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
        padding: 8,
        gap: 8,
        paddingHorizontal: 10,
        borderRadius: 10
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: 55,
        borderColor: Colors.primary,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center"
    },
    secondImageContainer: {
        position: "absolute",
        width: 53,
        height: 53,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: Colors.bgPrimary,
        alignItems: "baseline",
        justifyContent: "center"
    }
})
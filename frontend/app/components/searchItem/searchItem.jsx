import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../assets/mainColor/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getTaskEndDate } from "../../../assets/helper/calculateDate";
import { useRouter } from "expo-router";
import { useSearchStore } from "@/assets/store/searchStore";

export default function SearchItem({ item, icon, iconBg, icnColor, link }) {
    const router = useRouter();
    const { closeModal } = useSearchStore();

    const handleNavigate = (data) => {
        if (!data) return;
        let goPath = '';
        if (data.title === 'Projects') {
            goPath = "/projectDetail"
        } else if (data.title === 'Tasks') {
            goPath = "/taskDetail"
        }
        closeModal();
        router.push({
            pathname: goPath,
            params: { id: JSON.parse(data.id) },
        })
    }
    return (
        <>
            {item?.length > 0 && (
                <View style={styles.projectContainer}>
                    <View style={styles.projectHeader}>
                        <View>
                            <Text style={{ color: Colors.textPrimary, fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>{item[0]?.title}</Text>
                        </View>
                        <Pressable onPress={() => {
                            closeModal();
                            router.push(link);
                        }}>
                            <Text style={{ color: Colors.primary }}>See all</Text>
                        </Pressable>
                    </View>
                    {/* Item */}
                    {item?.map((i, index) => (
                        <Pressable onPress={() => handleNavigate(i)} style={styles.projectSt} key={index}>
                            <View style={styles.pjLeftContainer}>
                                <View style={[{ borderRadius: 10, backgroundColor: iconBg }, styles.icnContanier]}>
                                    <MaterialIcons name={icon} size={25} color={icnColor} />
                                </View>
                                <View style={{ flexDirection: "column", gap: 4 }}>
                                    <Text style={{ color: Colors.textPrimary, fontSize: 16, fontWeight: "bold" }}>{i?.name}</Text>
                                    <Text style={{ color: Colors.textSecondary, fontSize: 13, fontWeight: "bold" }}>{getTaskEndDate((i?.description).replace('End: ', ''))}</Text>
                                </View>
                            </View>
                            <Pressable>
                                <AntDesign name="right" size={20} color={Colors.textPrimary} />
                            </Pressable>
                        </Pressable>
                    ))}
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    projectContainer: {
        gap: 10,
        borderBottomWidth: 1,
        paddingVertical: 20,
        borderColor: Colors.gray
    },
    projectHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    projectSt: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10
    },
    pjLeftContainer: {
        flexDirection: "row",
        gap: 15
    },
    icnContanier: {
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center"
    }
})
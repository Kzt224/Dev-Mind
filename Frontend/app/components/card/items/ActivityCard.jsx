import { View, Text, StyleSheet, Pressable } from "react-native";
import { customCard } from "../../../../assets/themes/style";
import ProgressBar from "../../progressBar";
import { Colors } from "../../../../assets/mainColor/colors";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useContext } from "react";
import { AuthContext } from "../../../hook/authContex";
import { getAllTask } from "../../../../assets/api/fetchData";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export default function ActivityCard() {

    const { dailyInsight, cacheProject } = useContext(AuthContext);
    const router = useRouter();
    const totalProject = cacheProject?.result?.length || 0;
    const activeProject = cacheProject?.result?.filter((p) => p.progress > 0).length || 0;
    const { data, isLoading, isError, refetch, isSuccess } = useQuery({
        queryKey: ["tasks"],
        queryFn: () => getAllTask(),
    });
    const calculatedInsight = (text) => {
        if (!text) return '';
        let result = '';
        if (text.length > 60) {
            result = text.slice(0, 70) + "...";
        } else {
            result = text;
        }
        return result;
    }
    return (
        <>
            {/* project acative status */}
            <View style={[
                customCard['cardNormal'],
                styles.card,
                { backgroundColor: Colors.cardGreen, alignItems: "center" }]}>
                <Text style={styles.cardHeader}>Active Project</Text>
                <ProgressBar progress={Number((activeProject % totalProject) || 0)} size={80} strokeWidth={5} />
                <Text style={{ color: Colors.textSecondary }}> {activeProject + '/' + totalProject} Projects</Text>
            </View>
            {/* Ai noticed app */}
            <View style={[customCard['cardNormal'], styles.card,
            { backgroundColor: Colors.cardBlue },
            ]}>
                <Text style={styles.cardHeader}>AI Insight</Text>
                <Text style={styles.bodyText}>
                    {calculatedInsight(dailyInsight)}
                </Text>
                <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Text style={{ color: Colors.primary }}>Show More</Text>
                    <AntDesign name="right" size={12} color={Colors.primary} />
                </Pressable>
            </View>
            {/* assigned task list */}
            <View style={[customCard['cardNormal'], styles.card,
            { backgroundColor: Colors.cardRose }]}>
                <Text style={styles.cardHeader}>My Sprint</Text>
                {data?.slice(0, 3)?.map((d, index) => (
                    <Text key={d?.id} style={{ color: Colors.textSecondary }}>{index + 1 + '.' + d.name}  </Text>
                ))}
                <Pressable onPress={() => router.push("/task")} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Text style={{ color: Colors.primary }}>Show More</Text>
                    <AntDesign name="right" size={12} color={Colors.primary} />
                </Pressable>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        display: "flex",
        gap: 8,
        flexDirection: "column",
        width: 160,
        height: 155,
        margin: 7,
        padding: 10
    },
    cardHeader: {
        color: Colors.textPrimary,
        fontWeight: "900",
        fontSize: 17
    },
    bodyText: {
        color: Colors.textSecondary
    }
})


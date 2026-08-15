import { useEffect, useState } from "react";
import { Modal, StyleSheet, View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { useSearchStore } from "@/assets/store/searchStore";
import { Colors } from "../../../assets/mainColor/colors";
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import SearchItem from "../searchItem/searchItem";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function SearchForm() {
    const { openModal, closeModal, isVisible } = useSearchStore();
    const queryClient = useQueryClient();
    const { searchQuery, setQuery } = useSearchStore();
    const projects = useQuery({
        queryKey: ['project'],
        queryFn: () => [],
        enabled: isVisible,
        staleTime: Infinity
    });
    const tasks = useQuery({
        queryKey: ['tasks'],
        queryFn: () => [],
        enabled: isVisible,
        staleTime: Infinity
    })

    const projectResults =
        (projects?.data?.result || [])?.map((project) => ({
            id: project?.id,
            title: "Projects",
            name: project?.name,
            description: `End: ${project.endDate}`,
        }));

    const taskResults =
        (tasks.data || [])?.map((task) => ({
            id: task?.id,
            title: "Tasks",
            name: task?.name,
            description: `End: ${task.endDate}`,
        }));
    const q = searchQuery.trim().toLowerCase();

    const displayedProjects = q
        ? projectResults?.filter(item =>
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
        )
        : projectResults.slice(0, 3);

    const displayedTasks = q
        ? taskResults?.filter(item =>
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
        )
        : taskResults.slice(0, 3);
    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeModal}
        >
            <Pressable onPress={closeModal} style={styles.overlay}>
                <View style={styles.item}>
                    <View style={styles.bar}></View>
                    {/* search input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Search Projects, Tasks, Members..."
                        placeholderTextColor={Colors.textSecondary}
                        onChangeText={(text) => setQuery(text)}
                        value={searchQuery}
                    />
                    <View style={[styles.icon, styles.icnCommon]}>
                        <Ionicons name="search" size={24} color={Colors.textPrimary} />
                    </View>
                    {(searchQuery && searchQuery !== '') && (
                        <Pressable onPress={() => setQuery('')} style={[styles.icnCommon, styles.iconCross]}>
                            <Entypo name="cross" size={22} color={Colors.textPrimary} />
                        </Pressable>
                    )}
                    <ScrollView showsVerticalScrollIndicator={false}
                        style={{ flex: 1, width: "100%" }}>
                        {/* recent  */}
                        <View style={styles.rsContainer}>
                            <Text style={{ color: Colors.textPrimary, fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Recent searches</Text>
                            <View style={styles.rsInnerContainer}>
                                <View style={styles.rsInnerLeftContainer}>
                                    <Entypo name="back-in-time" size={24} color={Colors.textSecondary} />
                                    <Text style={{ color: Colors.textSecondary }}>Hello</Text>
                                </View>
                                <Pressable onPress={() => { }}>
                                    <Entypo name="cross" size={25} color={Colors.textSecondary} />
                                </Pressable>
                            </View>
                        </View>
                        {/* project */}
                        <SearchItem
                            item={displayedProjects}
                            icon={"folder-open"}
                            link={"/project"}
                            icnColor={Colors.waiting}
                            iconBg={Colors.waitingBg}
                        />
                        {/* tasks */}
                        <SearchItem
                            item={displayedTasks}
                            icon={"task"}
                            link={"/task"}
                            icnColor={Colors.warning}
                            iconBg={Colors.bgWarning}
                        />
                        {/* group */}
                        {/* <SearchItem
                            title={'Members'}
                            name={"Mg Mg"}
                            description={"Mg Mg joined on: 7Month ago"}
                            icon={"account-box"}
                            icnColor={Colors.waiting}
                            iconBg={Colors.waitingBg}
                        /> */}
                    </ScrollView>
                </View>
            </Pressable>
        </Modal>
    );
}
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)"
    },
    item: {
        width: "97%",
        height: "90%",
        backgroundColor: Colors.bgPrimary,
        borderRadius: 15,
        alignItems: "center",
        paddingHorizontal: 10
    },
    bar: {
        width: 100,
        height: 2,
        borderWidth: 2,
        borderColor: Colors.textPrimary,
        backgroundColor: Colors.textPrimary,
        borderRadius: 10,
        marginBottom: 10
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.gray,
        width: "100%",
        borderRadius: 15,
        position: "relative",
        paddingLeft: 55,
        color: Colors.textPrimary,
        padding: 10,
        fontSize: 16,
        marginTop: 5
    },
    icon: {
        left: 30,
        top: 30
    },
    iconCross: {
        right: 30,
        top: 32
    },
    icnCommon: {
        position: "absolute",
    },
    rsContainer: {
        width: "100%",
        paddingBottom: 20,
        marginTop: 15,
        gap: 5,
        borderBottomWidth: 1,
        borderColor: Colors.gray
    },
    rsInnerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 4
    },
    rsInnerLeftContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
})
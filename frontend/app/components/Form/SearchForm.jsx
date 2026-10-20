import { useContext, useEffect, useState } from "react";
import { Modal, StyleSheet, View, Text, Pressable, TextInput, ScrollView, ActivityIndicator } from "react-native";
import { useSearchStore } from "@/assets/store/searchStore";
import { Colors } from "../../../assets/mainColor/colors";
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import SearchItem from "../searchItem/searchItem";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProject, getAllTask } from "../../../assets/api/fetchData";
import { getSearchHistory } from "../../../assets/db/searchHistory.model";
import useHistoryMutation from "../../hook/historyMutation";
import { AuthContext } from "../../hook/authContex";
import History from "../searchItem/history";

export default function SearchForm() {
    const { closeModal, isVisible } = useSearchStore();
    const { user } = useContext(AuthContext);
    const { searchQuery, setQuery } = useSearchStore();
    const { mutate: createHistory, isPending } = useHistoryMutation();
    const projects = useQuery({
        queryKey: ['project'],
        queryFn: getAllProject,
        enabled: isVisible,
        staleTime: Infinity
    });
    const { data: history = [], isLoading, isError } = useQuery({
        queryKey: ['history'],
        queryFn: () => getSearchHistory(user?.id),
        enabled: isVisible && !!user?.id,
    })
    const tasks = useQuery({
        queryKey: ['tasks'],
        queryFn: getAllTask,
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
        (tasks?.data || [])?.map((task) => ({
            id: task?.id,
            title: "Tasks",
            name: task?.name,
            description: `End: ${task.endDate}`,
        }));
    const q = searchQuery.trim().toLowerCase();

    const displayedProjects = q
        ? projectResults?.filter(item =>
            item?.name?.toLowerCase()?.includes(q) ||
            item?.description?.toLowerCase()?.includes(q)
        )
        : projectResults?.slice(0, 3);

    const displayedTasks = q
        ? taskResults?.filter(item =>
            item?.name?.toLowerCase()?.includes(q) ||
            item?.description?.toLowerCase()?.includes(q)
        )
        : taskResults?.slice(0, 3);

    const handleSearch = () => {
        const keyword = searchQuery?.trim();
        if (!keyword) return '';
        createHistory({ userId: user?.id, content: keyword })
    }

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeModal}
        >
            <Pressable onPress={closeModal} style={styles.overlay}>
                <Pressable onPress={(e) => e.stopPropagation()} style={styles.item}>
                    <View style={styles.bar}></View>
                    {/* search input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Search Projects, Tasks, Members..."
                        placeholderTextColor={Colors.textSecondary}
                        onChangeText={(text) => setQuery(text)}
                        onSubmitEditing={handleSearch}
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
                        {isLoading && (
                            <ActivityIndicator />
                        )}
                        {/* recent search history */}
                        <History history={history} />
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
                </Pressable>
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

})
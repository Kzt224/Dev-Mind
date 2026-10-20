import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../assets/mainColor/colors";
import Entypo from "@expo/vector-icons/Entypo";
import { useEffect, useState } from "react";
import { useSearchStore } from "@/assets/store/searchStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSearchHistory } from "../../../assets/db/searchHistory.model";

export default function History({ history = [] }) {
    const [strLen, setStrLength] = useState(5);
    const [seeMore, setSeeMore] = useState(true);

    const { setQuery } = useSearchStore();
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (data) => deleteSearchHistory(data.id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["history"],
            });
        },
    });

    useEffect(() => {
        setStrLength(seeMore ? 5 : history.length);
    }, [history, seeMore]);

    const handleSeeMore = () => {
        setSeeMore(false);
        setStrLength(history.length);
    };

    const handleSeeLess = () => {
        setSeeMore(true);
        setStrLength(5);
    };

    const handleRecentSearch = (item) => {
        setQuery(item.content);
    };

    const handleDeleteHistory = (item) => {
        deleteMutation.mutate(item);
    };

    const displayedHistory = history.slice(0, strLen);

    return (
        <View style={styles.rsContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Recent searches
                </Text>

                {history.length > 5 && (
                    <Pressable
                        onPress={seeMore ? handleSeeMore : handleSeeLess}
                    >
                        <Text style={styles.seeMore}>
                            {seeMore ? "See more" : "See less"}
                        </Text>
                    </Pressable>
                )}
            </View>

            {displayedHistory.map((item) => (
                <Pressable
                    key={item.id}
                    onPress={() => handleRecentSearch(item)}
                    style={styles.rsInnerContainer}
                >
                    <View style={styles.rsInnerLeftContainer}>
                        <Entypo
                            name="back-in-time"
                            size={24}
                            color={Colors.textSecondary}
                        />

                        <Text
                            style={styles.historyText}
                            numberOfLines={1}
                        >
                            {item.content}
                        </Text>
                    </View>

                    <Pressable
                        hitSlop={8}
                        onPress={(event) => {
                            event.stopPropagation();
                            handleDeleteHistory(item);
                        }}
                    >
                        <Entypo
                            name="cross"
                            size={25}
                            color={Colors.textSecondary}
                        />
                    </Pressable>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    rsContainer: {
        width: "100%",
        paddingBottom: 20,
        marginTop: 15,
        gap: 5,
        borderBottomWidth: 1,
        borderColor: Colors.gray,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    title: {
        color: Colors.textPrimary,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },

    seeMore: {
        color: Colors.primary,
    },

    rsInnerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 4,
    },

    rsInnerLeftContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1,
    },

    historyText: {
        color: Colors.textSecondary,
        flex: 1,
    },
});
import { View, Text } from "react-native";
import { useModalStore } from "@/assets/store/modalStore";
import { Colors } from "../../../assets/mainColor/colors";
import { useQuery, useQueryErrorResetBoundary } from "@tanstack/react-query";
import { getGroupMember } from '@/assets/api/fetchData.js';
import Loading from "../card/loading";
import Error from "../card/error";
import Dropdown from "../card/items/dropDown";
import { useState } from "react";

export default function GroupLeftForm() {
    const { step, inputData, setInputData, clearInputData } = useModalStore();
    const [showDropdown, setShowDropdown] = useState(false);
    const { data: memberList, isLoading, isError, refetch } = useQuery({
        queryKey: ['member'],
        queryFn: () => getGroupMember(inputData?.group?.groupId),
        enabled: !!inputData?.group?.groupId
    });

    const isAdmin = inputData?.group?.role === "ADMIN";
    if (isLoading) {
        return (
            <Loading />
        );
    }
    if (isError) {
        return (
            <Error fn={refetch} />
        );
    }
    const member = memberList?.result?.filter((m) => m.role !== "ADMIN") ?? [];
    return (
        <View>
            {step === 1 && (
                <Text style={{ color: Colors.danger, fontWeight: "bold", }}>Sure!. You want to left from team</Text>
            )}
            {(step === 2 && isAdmin) && (
                <View>
                    <Text style={{ color: Colors.primary, fontWeight: "bold", marginBottom: 10, fontSize: 16 }}>Give admin permission to one user</Text>
                    <Dropdown
                        key={1}
                        placeholder={"User Name"}
                        value={inputData["User Name"]}
                        data={member}
                        visible={showDropdown}
                        onToggle={() => setShowDropdown(!showDropdown)}
                        onSelect={(member) => {
                            setInputData("User Name", member?.user?.name);
                            setInputData("User Id", member?.user?.id)
                            setShowDropdown(false);
                        }}
                    />
                </View>
            )}
            {(step === 2 && !isAdmin) && (
                <Text style={{ color: Colors.textPrimary, fontWeight: "bold" }}>You are unfinished assigned task</Text>
            )}
        </View>
    );
}
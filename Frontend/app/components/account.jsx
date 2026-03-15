import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { customCard } from "@/assets/themes/style.js";
import { Colors } from "@/assets/mainColor/colors.js";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useContext, useState } from "react";
import { AuthContext } from "../hook/authContex";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { settingList } from "../../assets/helper/settingList";
import { useRouter } from "expo-router";
import { useNavBarHeight } from "../hook/navHeighContex";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import Loading from "./card/loading";
import {getUserById} from "@/assets/api/fetchUser.js";
export default function Account() {

  const { user } = useContext(AuthContext);
  const { NavBarHeight } = useNavBarHeight();
  const router = useRouter();
  const { data: account, isLoading, isError } = useQuery({
    queryKey: ['userInfo', user?.id],
    queryFn: () => getUserById(user?.id),
    enabled: !!user?.id
  });
  const profile = account?.user;
  const handleNavigate = (link) => {
    if (!link) return;
    router.push({
      pathname: `/components/setting/${link}`,
      params: { id: user?.id || 0 }
    })
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, padding: 15, backgroundColor: Colors.bgPrimary }}>
        {/* loading */}
        {isLoading && <Loading/>}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* profile image box */}
          <View style={[styles.ppImageContainer, { marginTop: NavBarHeight }]}>
            <View style={styles.imgContainer}>
              <View style={styles.img}>
                <Text style={{ color: Colors.white, fontSize: 27, fontWeight: "bold" }}>
                  {profile?.name.slice(0, 1).toUpperCase()}
                </Text>
              </View>
              {/* upload button */}
              <Pressable style={{
                position: "absolute",
                bottom: 6,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: 15,
                borderWidth: 2,
                borderColor: Colors.gray,
                alignItems: "center",
                justifyContent: "center"
              }}>
                <View style={{
                  width: 30,
                  height: 30,
                  backgroundColor: Colors.waiting,
                  alignItems: "center",
                  padding: 3,
                  justifyContent: "center",
                  borderRadius: 15,
                }}>
                  <FontAwesome name="camera" size={15} color={Colors.white} />
                </View>
              </Pressable>
            </View>
            <View style={{
              marginTop: 10, display: 'flex', flexDirection: "row",
              alignItems: "center",
              gap: 8,
              justifyContent: "center"
            }}>
              <Text
                style={{
                  color: Colors.textPrimary,
                  padding: 5,
                  fontSize: 20,
                  fontWeight: "bold"
                }}
              >
                {profile?.name}
              </Text>
            </View>
          </View>
          {/* user detail and setting */}
          <View style={[{ paddingHorizontal: 15, paddingBottom: 15 }, customCard['cardNormal']]}>
            {settingList?.map((i) => (
              <Pressable onPress={() => handleNavigate(i?.link)} style={styles.list} key={i.id}>
                <View style={[styles.icon, {
                  backgroundColor: Colors[i?.bg],
                }]}>
                  <MaterialIcons name={i?.icon} size={30} color={Colors[i?.color]} />
                </View>
                <View style={styles.listText}>
                  <Text style={{ color: Colors.textPrimary, fontWeight: "bold" }}>{i?.name}</Text>
                  <Text style={{ color: Colors.textSecondary, fontSize: 13 }}>{i?.description}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  ppImageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    position: "relative",
  },
  imgContainer: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    position: "relative"
  },
  img: {
    width: 100,
    height: 100,
    borderWidth: 3,
    borderRadius: 100,
    borderColor: Colors.gray,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  list: {
    display: "flex",
    flexDirection: "row",
    gap: 25,
    marginTop: 20
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: 'center'
  },
  listText: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start"
  }
})
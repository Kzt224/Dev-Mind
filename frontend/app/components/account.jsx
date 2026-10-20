import { ScrollView } from "react-native";
import { Colors } from "@/assets/mainColor/colors.js";
import { useContext } from "react";
import { AuthContext } from "../hook/authContex";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import Loading from "./card/loading";
import { getUserById } from "@/assets/api/fetchUser.js";
import Error from "./card/error.jsx";
import { useLocalSearchParams } from "expo-router";
import CurrentUserProfile from "./setting/currentUserProfile.jsx";
import CollabUserProfile from "./setting/collabUserProfile.jsx";


export default function Account() {

  const { user } = useContext(AuthContext);
  const { profileId } = useLocalSearchParams();
  const { data: account, isLoading, isError, refetch } = useQuery({
    queryKey: ['userInfo', user?.id],
    queryFn: () => getUserById(user?.id),
    enabled: !!user?.id
  });
  const profile = account?.user;
  if (isError) {
    return (
      <Error fn={refetch} />
    );
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, padding: 15, backgroundColor: Colors.bgPrimary }}>
        {/* loading */}
        {isLoading && <Loading />}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* profile image box */}
          {(!profileId || (profileId == profile?.id)) ? (
            <CurrentUserProfile account={account} />
          ) :
            (
              <CollabUserProfile collabUserId={profileId} />
            )
          }
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider >
  );
}

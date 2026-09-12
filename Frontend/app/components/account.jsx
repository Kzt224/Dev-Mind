import { Image, Pressable, ScrollView, StyleSheet, Text, Animated, Easing, View } from "react-native";
import { Colors } from "@/assets/mainColor/colors.js";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../hook/authContex";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import Loading from "./card/loading";
import { getUserById } from "@/assets/api/fetchUser.js";
import * as ImagePicker from "expo-image-picker";
import { imageUploader } from "../../assets/libs/imageUploader.js";
import useProfileMutation from "../hook/profileMutation.jsx";
import { LinearGradient } from "expo-linear-gradient";
import Error from "./card/error.jsx";
import SettingList from "./setting/settingList.jsx";
import ImageView from "react-native-image-viewing"
import { compressImage } from "../../assets/helper/compressImage.js";


export default function Account() {

  const { user } = useContext(AuthContext);
  const rotateAnim = useState(new Animated.Value(0))[0];
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(null);
  const [visable, setVisable] = useState(false);
  const { mutate: uploadProfile, isPending } = useProfileMutation();
  const { data: account, isLoading, isError, refetch } = useQuery({
    queryKey: ['userInfo', user?.id],
    queryFn: () => getUserById(user?.id),
    enabled: !!user?.id
  });
  useEffect(() => {
    if (account) {
      setImage(account?.user?.profilePicture)
    }
  }, [])
  useEffect(() => {

    if (!isPending) {
      rotateAnim.stopAnimation();
      rotateAnim.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [isPending, uploading]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const profile = account?.user;
  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      setUploading(true);
      const compressed = await compressImage(result.assets[0].uri);
      const response = await imageUploader(compressed);
      setUploading(false);
      if (response) {
        uploadProfile(response);
      }
    }
  }
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
          <View style={styles.ppImageContainer}>
            <View style={styles.imgContainer}>
              {(isPending || uploading) && (
                <Animated.View
                  style={[
                    styles.gradientAnimated,
                    {
                      transform: [{ rotate }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={["#9f744c", "#5a983b", "#6a3419"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBorderWrapper}
                  />
                </Animated.View>
              )}
              <View style={[styles.img]}>
                {image ?
                  (
                    <>
                      <Pressable onPress={() => setVisable(true)}>
                        <Image source={{ uri: image }} style={{ width: 95, height: 95, borderRadius: 50 }} />
                      </Pressable>
                      <ImageView
                        images={[{ uri: image }]}
                        visible={visable}
                        onRequestClose={() => setVisable(false)}
                        imageIndex={0} />
                    </>
                  )
                  : (
                    <Text style={{ color: Colors.white, fontSize: 27, fontWeight: "bold" }}>
                      {profile?.name.slice(0, 1).toUpperCase()}
                    </Text>
                  )}
              </View>
              {/* upload button */}
              <Pressable onPress={handlePickImage} style={{
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
          <SettingList />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider >
  );
}

const styles = StyleSheet.create({
  gradientAnimated: {
    position: "absolute",
    width: 104,
    height: 104,
    borderRadius: 55,
  },
  gradientBorderWrapper: {
    width: 104,
    height: 104,
    borderRadius: 55,
  },
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
})
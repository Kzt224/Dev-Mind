import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useRouter } from "expo-router";
import { Colors } from "../../assets/mainColor/colors";
import { getDate } from "../../assets/helper/calculateDate";
import { customCard, shadowStyles } from "../../assets/themes/style";
//import Calendar from "./calendar";
import CalendarComp from "./calendar";
import Defination from "./Defination";
import { useContext } from "react";
import { LanguageContext } from "../hook/languageContex";
export default function TimeLine({ tasks }) {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });
    const {t} = useContext(LanguageContext);

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color={Colors.primary} />;
    }

    return (
        <>
            {tasks?.length > 0 ? (
                <View style={styles.container}>
                    <Text style={{ fontFamily: "Inter_700Bold", color: Colors.textPrimary, fontSize: 25 }}>
                    {t["Timeline"]}
                    </Text>
                    <View style={[styles.calendar,customCard['cardNormal']]}>
                        {/* table header */}
                        <CalendarComp tasks={tasks}/>
                    </View>
                    <Text style={{ fontFamily: "Inter_700Bold", color: Colors.textPrimary, fontSize: 25 ,marginTop:25}}>
                       {t["Color Defination"]}
                    </Text>
                    <View>
                        {/* color defination */}
                        <Defination/>
                    </View>
                    {/* <View style={{ marginTop: 25 }}>
                        <Text style={{ fontFamily: "Inter_700Bold", color: Colors.primary, fontSize: 25 }}>Delay</Text>
                    </View>
                    <View style={[styles.delayBox]}>
                        <Text style={{ fontWeight: "bold", color: Colors.warning, fontSize: 19 }}>{t.delay} days delay</Text>
                    </View> */}
                </View>
            ) :
                (
                    <></>
                )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        marginTop: 25,
        marginBottom: "20%"
    },
    calendar: {
        width: "full",
        marginTop: 25,
        display: 'flex',
        flexDirection: "column",
        justifyContent: "center",
        padding:1
    },
    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    delayBox: {
        width: "full",
        boxShadow: "0 3px 3px rgba(0,0,0,0.6)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        padding: 10,
        borderRadius: 15,
        marginTop: 25,
        padding: 30,
        paddingHorizontal: 20
    }
})
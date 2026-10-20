// import * as Notifications from "expo-notifications";
// import * as Device from "expo-device";
// import { Platform } from "react-native";


// export async function registerPushToken()
// {
//     if(!Device.isDevice){
//         alert("Must use real device");
//     }
//     const {status: existingStatus} = await Notifications.getPermissionsAsync();

//     let finalStatus = existingStatus;

//     if(existingStatus !== "granted"){
//         const {status} = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//     }

//     if(finalStatus !== "granted"){
//         alert("Permission deined");
//     }

//     const token = (await Notifications.getExpoPushTokenAsync()).data;
//     if(Platform === "android"){
//         await Notifications.setNotificationChannelAsync("default",{
//             name: "default",
//             importance: Notifications.AndroidImportance.MAX,
//             sound: "default"
//         });
//     }
//     return token;
// }
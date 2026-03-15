import { View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Colors } from "../../assets/mainColor/colors";
import { trackPeriod } from "../../assets/helper/peroidTracker";

export default function CalendarComp({ tasks }) {
  const dateArry = trackPeriod(tasks);

  const markedDates = {};
  dateArry.forEach(item => {
    const dateKey = item.date;
    const { date, ...markingStyle } = item;
    markedDates[dateKey] = markingStyle;
  });

  return (
    <View>
      <Calendar
        style={{
          width: "100%",
          borderRadius: 10,
        }}
        markingType="period"
        markedDates={markedDates}
        theme={{
          calendarBackground: Colors.white,  
          dayTextColor: Colors.textPrimary,
          monthTextColor: Colors.textPrimary,
          arrowColor: Colors.textPrimary,
          todayTextColor: Colors.primary,
        }}
      />
    </View>
  );
}
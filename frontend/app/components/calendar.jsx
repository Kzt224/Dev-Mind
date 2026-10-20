import { View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Colors } from "../../assets/mainColor/colors";
import { trackPeriod } from "../../assets/helper/peroidTracker";

export default function CalendarComp({ tasks }) {
  const dateArray = trackPeriod(tasks);

  const markedDates = {};

  dateArray.forEach((item) => {
    const { date, ...markingStyle } = item;

    markedDates[date] = markingStyle;
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
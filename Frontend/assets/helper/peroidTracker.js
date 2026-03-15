import { Colors } from "../mainColor/colors";


const normalizeUTCDate = (date) => {
  const d = new Date(date);
  return new Date(Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate()
  ));
};
const calculateAndReturnDate = (startDate, endDate, duration) => {
  if (!startDate || !endDate || duration <= 0) return [];

  const dateArr = [];

  const start = normalizeUTCDate(startDate);
  const finalEnd = normalizeUTCDate(endDate);

  // Start from start date, ignore today
  let currentDate = new Date(start);
  let count = 0;

  while (currentDate <= finalEnd && count < duration) {
    dateArr.push(currentDate.toISOString().slice(0, 10));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    count++;
  }

  return dateArr;
};


export const trackPeriod = (items = []) =>
  items.flatMap(item => {
    const dates = calculateAndReturnDate(
      item.startDate,
      item.endDate,
      item.duration
    );

    const color =
      Colors[item?.status?.toLowerCase()] || Colors.processing;

    return dates.map((date, index) => ({
      date,
      color,
      startingDay: index === 0,
      endingDay: index === dates.length - 1,
    }));
  });

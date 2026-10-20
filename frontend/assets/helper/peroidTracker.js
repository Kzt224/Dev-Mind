import { Colors } from "../mainColor/colors";

const toDateOnly = (date) => {
  const d = new Date(date);

  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate()
  );
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const calculateAndReturnDate = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return [];
  }

  const start = toDateOnly(startDate);
  const end = toDateOnly(endDate);

  // Today
  const today = toDateOnly(new Date());

  // If task has already finished
  if (today > end) {
    return [];
  }

  // Start from today if today is inside the task period.
  // Otherwise, use the original start date.
  const currentDate =
    today > start
      ? new Date(today)
      : new Date(start);

  const dates = [];

  while (currentDate <= end) {
    dates.push(formatDate(currentDate));

    currentDate.setDate(
      currentDate.getDate() + 1
    );
  }

  return dates;
};

export const trackPeriod = (items = []) =>
  items.flatMap((item) => {
    const dates = calculateAndReturnDate(
      item.startDate,
      item.endDate
    );

    const color =
      Colors[item?.status?.toLowerCase()] ||
      Colors.priority_medium_bg;

    return dates.map((date, index) => ({
      date,
      color,
      startingDay: index === 0,
      endingDay: index === dates.length - 1,
    }));
  });
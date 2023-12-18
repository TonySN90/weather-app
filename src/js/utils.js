const weekdayNames = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

const monthNames = [
  "Jan",
  "Feb",
  "Mär",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dez",
];

export function getDate(dateUnix, timezone, isFirstTime) {
  let date = "";
  if (timezone) {
    date = new Date(dateUnix + timezone * 1000);
  } else {
    date = new Date(dateUnix * 1000);
  }

  const weekdayName = weekdayNames[date.getUTCDay()];
  const monthName = monthNames[date.getUTCMonth()];
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  if (timezone) {
    return `${weekdayName} ${date.getUTCDate()}. ${monthName} ${hours}:${minutes} Uhr`;
  } else {
    return `${weekdayName}`;
  }
}

export function getTime(dateUnix, mez) {
  const date = new Date(dateUnix * 1000);

  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}`;

  const options = { hour12: false, hour: "2-digit", minute: "2-digit" };
  const formattedTime = new Intl.DateTimeFormat("default", options).format(
    date
  );

  return mez ? formattedTime : timeString;
}

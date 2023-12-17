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

export function getDate(dateUnix, timezone) {
    const date = new Date((dateUnix + timezone) * 1000);
    const weekdayName = weekdayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${weekdayName} ${date.getUTCDate()}. ${monthName} ${hours}:${minutes} Uhr`;
  }
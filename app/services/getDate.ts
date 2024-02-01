import { DateTime } from "luxon";

const today = DateTime.fromObject({
  year: 2024,
  month: 2,
  day: 1,
  hour: 23, // Replace with the desired hour
  minute: 0, // Replace with the desired minute
  second: 0, // Replace with the desired second
  millisecond: 0, // Replace with the desired millisecond
});

export default today;

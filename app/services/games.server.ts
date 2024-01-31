import { DateTime } from "luxon";
import prisma from "../services/database.server";
let clickedDate: DateTime | null = null;

export const setClickedDate = (date: DateTime | null) => {
  clickedDate = date;
};

export const collectHearts = async () => {
  return {
    hearts: 5,
  };
};

export const getTimer = async () => {
  const nextDay = DateTime.now().plus({ days: 1 }).startOf("day");

  if (clickedDate) {
    const timeUntilNextDayInSeconds = nextDay.diff(
      clickedDate,
      "seconds"
    ).seconds;
    return Math.max(0, timeUntilNextDayInSeconds);
  } else {
    return 0;
  }
};

export const getDays = async () => {
  const days = await prisma.reward.findMany();
  console.log(days);

  return days;
};

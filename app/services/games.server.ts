import { DateTime } from "luxon";
import prisma from "../services/database.server";
let clickedDate: DateTime | null = null;

// const today = DateTime.now();
// const today = DateTime.fromObject({ year: 2024, month: 2, day: 15 });

const today = DateTime.fromObject({
  year: 2024,
  month: 2,
  day: 2,
  hour: 23, // Replace with the desired hour
  minute: 0, // Replace with the desired minute
  second: 0, // Replace with the desired second
  millisecond: 0, // Replace with the desired millisecond
});

export const collectHearts = async (points: number | null) => {
  return {
    hearts: points,
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

  return days;
};

export const addClaim = async (userId: number, rewardId: number) => {
  const hasClaimedToday = await hasUserClaimedToday(userId, today);
  try {
    const newClaim = await prisma.claimRecords.create({
      data: {
        userId: userId,
        rewardId: rewardId,
      },
    });
    return newClaim;
  } catch (error) {
    console.log("already claimed");
  }
};

export const getClaims = async (userId: number) => {
  try {
    const userClaims = await prisma.claimRecords.findMany({
      where: {
        userId: userId,
      },
    });

    return userClaims;
  } catch (error) {
    console.error("Error getting claims:", error);
    throw error;
  }
};

export const getPoints = async (userId: number) => {
  try {
    const userClaims = await prisma.claimRecords.findMany({
      where: {
        userId: userId,
      },
      include: {
        reward: true,
      },
    });

    const totalPoints = userClaims.reduce(
      (sum: any, claim: any) => sum + claim.reward.points,
      0
    );

    return totalPoints;
  } catch (error) {
    console.error("Error fetching user points:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const getTodaysDate = (): string => {
  const formattedDate = today.toFormat("dd/MM/yyyy");
  console.log(formattedDate);

  return formattedDate;
};

export const hasUserClaimedToday = async (
  userId: number,
  today: DateTime
): Promise<boolean> => {
  const startOfDay = today.startOf("day").toJSDate();
  const endOfDay = today.endOf("day").toJSDate();

  try {
    const userClaimsToday = await prisma.claimRecords.findMany({
      where: {
        userId: userId,
        reward: {
          date: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      },
    });
    console.log(userClaimsToday);

    return userClaimsToday.length > 0;
  } catch (error) {
    console.error("Error checking if user has claimed today's reward:", error);
    throw error;
  }
};

export const getTimeUntilNextDay = async (userId: number): Promise<number> => {
  try {
    const hasClaimedToday = await hasUserClaimedToday(userId, today);
    if (hasClaimedToday) {
      //if the user has claimed today's reward, calculate the time until the next day
      const nextDay = today.plus({ days: 1 }).startOf("day");
      const timeUntilNextDayInSeconds = nextDay.diff(today, "seconds").seconds;
      return Math.max(0, timeUntilNextDayInSeconds);
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error calculating time until next day:", error);
    throw error;
  }
};

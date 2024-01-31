import { DateTime } from "luxon";
import prisma from "../services/database.server";
let clickedDate: DateTime | null = null;

export const setClickedDate = (date: DateTime | null) => {
  clickedDate = date;
};

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
  try {
    // Assuming userId 1 for simplicity, replace with the actual user ID

    // Create a new claim record in the database
    const newClaim = await prisma.claimRecords.create({
      data: {
        userId: userId,
        rewardId: rewardId,
        // Add other claim details as needed
      },
    });

    return newClaim;
  } catch (error) {
    console.error("Error adding claim:", error);
    throw error;
  }
};

export const getClaims = async (userId: number) => {
  try {
    // Retrieve claim records for the specified user
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
        reward: true, // Include related reward data
      },
    });

    const totalPoints = userClaims.reduce(
      (sum: any, claim: any) => sum + claim.reward.points,
      0
    );

    return totalPoints;
  } catch (error) {
    // Handle error
    console.error("Error fetching user points:", error);
    throw error;
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

import { Form } from "@remix-run/react";
import { useState, useEffect } from "react";
import { register } from "swiper/element/bundle";
import { DateTime } from "luxon";
import CountdownTimer from "./CountDownTimer";
import { motion, AnimatePresence } from "framer-motion";
import today from "../services/getDate";
import { TiTick } from "react-icons/ti";

interface HeartsCollectorProps {
  heartsCount: number;
  timeRemainingInSeconds: number;
  days: Object;
  claims: Object;
  points: number;
  todayDate: string;
}

export default function HeartsCollector({
  heartsCount,
  timeRemainingInSeconds,
  days,
  claims,
  points,
  todayDate,
}: HeartsCollectorProps) {
  console.log(days);
  console.log("hearts: " + timeRemainingInSeconds);
  const cardArray = Object.values(days);
  const claimsArray = Object.values(claims);
  const [isRewardClaimed, setIsRewardClaimed] = useState(false);
  const scrollToDate = () => {
    // Find the index of the card with the selected date
    const selectedIndex = cardArray.findIndex(
      (day) => DateTime.fromISO(day.date).toFormat("dd/MM/yyyy") === todayDate
    );

    if (selectedIndex !== -1) {
      // Scroll to the corresponding card using a reference
      const selectedCardRef = document.getElementById(
        `card-${cardArray[selectedIndex].id}`
      );
      if (selectedCardRef) {
        selectedCardRef.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  };

  useEffect(() => {
    // Scroll to the date on the first load
    scrollToDate();
  }, []);

  useEffect(() => {
    // Check if today's reward has been claimed
    const todayRewardClaimed = claimsArray.some(
      (claim) =>
        claim.rewardId ===
        cardArray.find(
          (day) =>
            DateTime.fromISO(day.date).toFormat("dd/MM/yyyy") === todayDate
        )?.id
    );

    setIsRewardClaimed(todayRewardClaimed);

    // Scroll to the date on the first load
  }, [claimsArray, cardArray, todayDate]);

  return (
    <div className="bg-white w-full rounded-lg border p-5">
      <div className="flex flex-col w-full rounded-lg justify-between">
        {/* CARD LEFT */}
        <div className="w-full flex flex-row justify-between">
          <p className="text-2xl font-medium text-middle">{points}</p>
          {isRewardClaimed && (
            <CountdownTimer timeRemainingInSeconds={timeRemainingInSeconds} />
          )}
        </div>
        {/* DAY CARDS CONTAINER */}
        <div className="flex overflow-auto my-4">
          {cardArray.map((day) => {
            const isToday =
              DateTime.fromISO(day.date).toFormat("dd/MM/yyyy") === todayDate;
            const isClaimed = claimsArray.some(
              (claim) => claim.rewardId === day.id
            );
            const isFutureDate = DateTime.fromISO(day.date) > today;

            return (
              <Form key={day.id} method="POST">
                <div
                  id={`card-${day.id}`}
                  className={`w-32 h-32 border ${
                    isClaimed && isToday
                      ? "bg-white border-orange-500 border-2 " // Claimed and today
                      : isClaimed
                      ? "bg-white " // Only claimed
                      : isToday
                      ? "bg-white border-orange-500 border-2 " // Only today
                      : isFutureDate
                      ? "bg-white opacity-40 " // Future date
                      : ""
                  } rounded-lg mr-4 flex-shrink-0 flex flex-col justify-between my-5  transition`}
                >
                  <div className="h-1/4 flex items-center w-full text-center border-b justify-center">
                    <p className=" font-bold">
                      {DateTime.fromISO(day.date).toFormat("dd/MM/yyyy")}
                    </p>
                  </div>
                  <div className="h-full flex justify-center align-middle ">
                    <div className="h-min self-center">
                      {" "}
                      {isClaimed && <TiTick size={50} color="green" />}
                    </div>
                  </div>
                  <input type="text" defaultValue={day.id} name="id" hidden />
                  <div className="h-2/4 flex justify-center align-middle pb-1">
                    <AnimatePresence mode="popLayout">
                      {isToday && !isClaimed ? (
                        <motion.button
                          key="button"
                          initial={{ scale: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1.05 }}
                          animate={{
                            rotate: [0, -5, 5, -5, 5, 0],
                            transition: { repeat: Infinity, repeatDelay: 2 },
                          }}
                          type="submit"
                          value={day.points}
                          name="points"
                          className={`border p-1 bg-orange-500 text-white px-4 rounded-md`}
                        >
                          Claim
                        </motion.button>
                      ) : isClaimed ? (
                        <motion.div
                          key="points"
                          exit={{ scale: 0, opacity: 0 }}
                          initial={{ scale: 0 }}
                          animate={{
                            scale: 1,
                            rotate: 360,
                          }}
                          className="flex items-center"
                        >
                          <p className="text-center font-bold text-lg">
                            {day.points}
                          </p>
                        </motion.div>
                      ) : isFutureDate ? (
                        <motion.div key="future" className="text-lg">
                          ??
                        </motion.div>
                      ) : (
                        <motion.div key="empty" className="text-lg">
                          {day.points}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Form>
            );
          })}
        </div>
        {/* CARD RIGHT */}
        <div className="w-full flex flex-row justify-between text-right">
          <p>Claim daily hearts to redeem cool rewards!</p>
        </div>
      </div>
    </div>
  );
}

// import { Form } from "@remix-run/react";
// import { useState, useEffect } from "react";

// interface HeartsCollectorProps {
//   heartsCount: number;
//   timeRemainingInSeconds: number;
// }

// export default function HeartsCollector({
//   heartsCount,
//   timeRemainingInSeconds,
// }: HeartsCollectorProps) {
//   const formatTime = (timeInSeconds: number): string => {
//     const hours = Math.floor(timeInSeconds / 3600);
//     const minutes = Math.floor((timeInSeconds % 3600) / 60);
//     const seconds = Math.floor(timeInSeconds % 60);

//     const formattedHours = hours.toString().padStart(2, "0");
//     const formattedMinutes = minutes.toString().padStart(2, "0");
//     const formattedSeconds = seconds.toString().padStart(2, "0");

//     return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
//   };
//   const [timeRemaining, setTimeRemaining] = useState(timeRemainingInSeconds);
//   const [formattedTime, setFormattedTime] = useState<string>(
//     formatTime(timeRemainingInSeconds)
//   );

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeRemaining((prevTime) => Math.max(0, prevTime - 1)); // Ensure time does not go negative
//       setFormattedTime(formatTime(timeRemaining));
//     }, 1000);

//     if (timeRemaining === 0) {
//     }
//     return () => {
//       clearInterval(timer);
//     };
//   }, [timeRemaining]);

//   return (
//     <div className="bg-white w-full rounded-lg border">
//       <Form method="POST">
//         <div className="flex w-full h-20 rounded-lg">
//           {/* CARD LEFT */}
//           <div className="w-1/2  flex flex-col justify-around pl-3">
//             <p className="text-2xl font-medium">{heartsCount}</p>
//             <p>Claim daily hearts to redeem cool rewards!</p>
//           </div>

//           {/* CARD RIGHT */}
//           <div className="w-1/2 flex flex-col justify-around content-end text-right pr-3">
//             <p>{formattedTime}</p>

//             <button
//               type="submit"
//               name="type"
//               value={"COLLECT-HEARTS"}
//               className="w-max self-end"
//             >
//               Claim
//             </button>
//           </div>
//         </div>
//       </Form>
//     </div>
//   );
// }

import { Form } from "@remix-run/react";
import { useState, useEffect } from "react";
import { register } from "swiper/element/bundle";

interface HeartsCollectorProps {
  heartsCount: number;
  timeRemainingInSeconds: number;
  days: Object;
}

export default function HeartsCollector({
  heartsCount,
  timeRemainingInSeconds,
  days,
}: HeartsCollectorProps) {
  const cardArray = Object.values(days);
  console.log(cardArray);
  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const [timeRemaining, setTimeRemaining] = useState(timeRemainingInSeconds);
  const [formattedTime, setFormattedTime] = useState<string>(
    formatTime(timeRemainingInSeconds)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => Math.max(0, prevTime - 1));
      setFormattedTime(formatTime(timeRemaining));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timeRemaining]);

  return (
    <div className="bg-white w-full rounded-lg border p-5">
      <div className="flex flex-col w-full rounded-lg justify-between">
        {/* CARD LEFT */}
        <div className="w-full flex flex-row justify-between">
          <p className="text-2xl font-medium">{heartsCount}</p>
          <p>{formattedTime}</p>
        </div>
        {/* DAY CARDS CONTAINER */}
        <div className="flex overflow-auto my-4">
          {cardArray.map((day) => (
            <Form key={day.id} method="POST">
              <div className="w-32 h-32 border border-gray-300 rounded-lg mr-4 flex-shrink-0 flex flex-col justify-between my-5">
                <p className="text-center mt-4">{day.points}</p>
                <button
                  type="submit"
                  value={day.points}
                  name="points"
                  className="border p-1 bg-gray-200"
                >
                  Claim
                </button>
              </div>
            </Form>
          ))}
        </div>
        {/* CARD RIGHT */}
        <div className="w-full flex flex-row justify-between text-right">
          <p>Claim daily hearts to redeem cool rewards!</p>
          <button
            type="submit"
            name="type"
            value={"COLLECT-HEARTS"}
            className="w-max self-end"
          >
            Claim
          </button>
        </div>
      </div>
    </div>
  );
}

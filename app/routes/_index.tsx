import {
  type ActionFunctionArgs,
  ActionFunction,
  LoaderFunction,
} from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { DateTime } from "luxon";
import { useState, useEffect } from "react";
import {
  addClaim,
  collectHearts,
  getClaims,
  getDays,
  getPoints,
  getTimer,
  setClickedDate,
} from "~/services/games.server";
import HeartsCollector from "~/Games/HeartsCollector";
//
const USERID = 2;

///
export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const points = formData?.get("points") ?? 0;
  const formDataObj = Object.fromEntries(formData.entries());
  const id = formData?.get("id") ?? 0;
  const add = await addClaim(USERID, +id);
  setClickedDate(DateTime.now());
  const heartsResponse = await collectHearts(+points);

  return heartsResponse;
};

export const loader: LoaderFunction = async ({ request }) => {
  const timeDiffInSeconds = await getTimer();
  const days = await getDays();
  const claims = await getClaims(USERID);
  const points = await getPoints(USERID);
  console.log(points);
  return { timeDiffInSeconds, days, claims, points };
};
const Index = () => {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();

  const heartsCount = actionData;
  const [heartsCounter, setHeartsCounter] = useState(heartsCount?.hearts ?? 0);

  useEffect(() => {
    // Update heartsCounter whenever heartsCount changes
    if (heartsCount?.hearts !== undefined) {
      setHeartsCounter((prevHearts: number) => prevHearts + heartsCount.hearts);
    }
  }, [heartsCount]);

  return (
    <div className="container mx-auto max-w-[500px] min-h-screen animate-fade-up">
      <div className="grid grid-cols-1 px-2 ">
        <HeartsCollector
          heartsCount={heartsCounter}
          timeRemainingInSeconds={loaderData.timeDiffInSeconds}
          days={loaderData.days}
          claims={loaderData.claims}
          points={+loaderData.points}
        />
      </div>

      <Outlet />
    </div>
  );
};

export default Index;

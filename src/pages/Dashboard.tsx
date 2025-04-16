import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { sanity } from "../sanityClient";
import dayjs from "dayjs";

const activities = ["Daily Task", "Meeting", "Learning"];

const dateRange = Array.from(
  { length: dayjs("2024-06-30").diff(dayjs("2024-04-20"), "day") + 1 },
  (_, i) => dayjs("2024-04-20").add(i, "day").format("YYYY-MM-DD")
);

export default function Dashboard() {
  const { state } = useLocation();
  const { username, isAdmin } = state;
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userFilter = isAdmin ? "" : `user->username == "${username}" &&`;
      const query = `*[_type == "activityLog" && ${userFilter} date >= "2024-04-20" && date <= "2024-06-30"]{
        _id, date, activity, done, note, user-> {username}
      }`;
      const logs = await sanity.fetch(query);
      setData(logs);
    };

    fetchData();
  }, [username, isAdmin]);

  const getLog = (date: string, activity: string, user: string) => {
    return data.find(
      (d) =>
        d.date === date && d.activity === activity && d.user.username === user
    );
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h1 className="text-2xl mb-4">
        {isAdmin ? "Admin View" : `Welcome, ${username}`}
      </h1>
      <table className="min-w-[1500px] border">
        <thead>
          <tr>
            <th className="border p-2">Activity</th>
            {dateRange.map((date) => (
              <th key={date} className="border p-2 text-xs">
                {date}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity}>
              <td className="border p-2">{activity}</td>
              {dateRange.map((date) => {
                const log = getLog(date, activity, username);
                return (
                  <td key={`${activity}-${date}`} className="border p-1">
                    <input
                      type="checkbox"
                      checked={log?.done || false}
                      disabled={isAdmin}
                      onChange={async (e) => {
                        const checked = e.target.checked;
                        if (log) {
                          await sanity
                            .patch(log._id)
                            .set({ done: checked })
                            .commit();
                          setData((prev) =>
                            prev.map((item) =>
                              item._id === log._id
                                ? { ...item, done: checked }
                                : item
                            )
                          );
                        } else {
                          const userDoc = await sanity.fetch(
                            `*[_type == "user" && username == "${username}"][0]{_id}`
                          );
                          const created = await sanity.create({
                            _type: "activityLog",
                            date,
                            activity,
                            done: checked,
                            note: "",
                            user: {
                              _type: "reference",
                              _ref: userDoc._id,
                            },
                          });
                          setData((prev) => [
                            ...prev,
                            { ...created, user: { username } },
                          ]);
                        }
                      }}
                    />
                    <input
                      className="text-xs block w-full mt-1"
                      type="text"
                      defaultValue={log?.note || ""}
                      disabled={isAdmin}
                      onBlur={async (e) => {
                        const note = e.target.value;
                        if (log) {
                          await sanity
                            .patch(log._id)
                            .set({ note })
                            .commit();
                          setData((prev) =>
                            prev.map((item) =>
                              item._id === log._id
                                ? { ...item, note }
                                : item
                            )
                          );
                        }
                      }}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

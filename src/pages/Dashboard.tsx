import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { sanity } from "../sanityClient";
import dayjs from "dayjs";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const activities = [
  "5000 Steps",
  "4-6 floors",
  "Read 10 pages",
  "Minimum 7hrs of sleep",
  "Early dinner",
  "2l of water",
  "Playtime",
  "No mobile",
];

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28BD4",
];

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
      const logs = await (sanity as any).fetch(query, { username });
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

  const getChartData = () => {
    return activities.map((activity) => {
      const total = dateRange.length;
      const doneCount = data.filter(
        (d) => d.activity === activity && d.done
      ).length;
      const percentage = Math.round((doneCount / total) * 100);
      return {
        name: activity,
        value: percentage,
      };
    });
  };

  return (
    <div className="p-4 overflow-x-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-indigo-700 mb-6">
        {isAdmin ? "Admin View" : `Welcome, ${username}`}
      </h1>

      {/* Table */}
      <table className="min-w-[1500px] border mb-12">
        <thead>
          <tr>
            <th className="border p-2">Activity</th>
            {dateRange.map((date) => (
              <th
                key={date}
                className="border p-2 text-xs sticky top-0 bg-white shadow z-10"
              >
                {date}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity} className="hover:bg-indigo-50 transition">
              <td className="border p-2 font-medium">{activity}</td>
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
                          await (sanity as any)
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
                          const userDoc = await (sanity as any).fetch(
                            `*[_type == "user" && username == "${username}"][0]{_id}`
                          );

                          const created = await (sanity as any).create({
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
                      className="text-xs block w-full mt-1 px-1 py-0.5 border rounded shadow-inner"
                      type="text"
                      defaultValue={log?.note || ""}
                      disabled={isAdmin}
                      onBlur={async (e) => {
                        const note = e.target.value;
                        if (log) {
                          await (sanity as any).patch(log._id).set({ note }).commit();
                          setData((prev) =>
                            prev.map((item) =>
                              item._id === log._id ? { ...item, note } : item
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

      {/* Pie Chart */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Progress Summary
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={getChartData()}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {getChartData().map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

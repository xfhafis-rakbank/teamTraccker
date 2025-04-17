import { useParams } from "react-router-dom";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

export default function UserProgress() {
  const { username } = useParams();
  const [data, setData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date>(
    dayjs("2024-04-20").toDate()
  );
  const [endDate, setEndDate] = useState<Date>(dayjs("2024-06-30").toDate());
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const logs = await (sanity as any).fetch(
        `*[_type == "activityLog" && user->username == "${username}" && date >= "2024-04-20" && date <= "2024-06-30"]{
              _id, date, activity, done, note
            }`
      );
      setData(logs);
    };

    fetchData();
  }, [username]);

  const filteredData = data.filter((log) => {
    const logDate = dayjs(log.date).toDate();
    return logDate >= startDate && logDate <= endDate;
  });

  const getChartData = () => {
    return activities.map((activity) => {
      const totalDays = dayjs(endDate).diff(dayjs(startDate), "day") + 1;
      const doneCount = filteredData.filter(
        (d) => d.activity === activity && d.done
      ).length;
      const percentage = Math.round((doneCount / totalDays) * 100);
      return { name: activity, value: percentage };
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">
        Progress for <span className="text-indigo-600">{username}</span>
      </h1>

      {/* Date range selection */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">From:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date!)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">To:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date!)}
          />
        </div>
      </div>

      {/* Pie chart */}
      <div className="mb-4">
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

      {/* Toggle button */}
      <div className="text-center">
        <button
          onClick={() => setShowDetail(!showDetail)}
          className="mt-4 text-sm text-indigo-600 underline hover:text-indigo-800"
        >
          {showDetail ? "Hide Detailed Log" : "Show Detailed Log"}
        </button>
      </div>

      {/* Daily breakdown table */}
      {showDetail && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Daily Log Breakdown</h2>
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-indigo-100">
                <th className="border p-2">Date</th>
                <th className="border p-2">Activity</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {[...filteredData]
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border p-2">{log.date}</td>
                    <td className="border p-2">{log.activity}</td>
                    <td className="border p-2">
                      {log.done ? (
                        <span className="text-green-600 font-semibold">
                          ✔️ Done
                        </span>
                      ) : (
                        <span className="text-gray-500">Not Done</span>
                      )}
                    </td>
                    <td className="border p-2">{log.note || "-"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

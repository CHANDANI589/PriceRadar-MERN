import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { PLATFORM_STYLES, formatINR } from "../utils/platforms";

const PriceHistoryChart = ({ history = [] }) => {
  if (!history.length) return <p className="text-slate-400 text-sm">No price history yet.</p>;

  const byDate = {};
  history.forEach((h) => {
    const d = new Date(h.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    if (!byDate[d]) byDate[d] = { date: d };
    byDate[d][h.platform] = h.price;
  });
  const data = Object.values(byDate);
  const platformNames = [...new Set(history.map((h) => h.platform))];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: "Inter" }} />
        <YAxis
          tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
          tickFormatter={(v) => `₹${v}`}
          width={60}
        />
        <Tooltip
          formatter={(value) => formatINR(value)}
          contentStyle={{ fontFamily: "Inter", borderRadius: 8, border: "1px solid #E2E8F0" }}
        />
        <Legend wrapperStyle={{ fontSize: 12, fontFamily: "Inter" }} />
        {platformNames.map((platform) => (
          <Line
            key={platform}
            type="monotone"
            dataKey={platform}
            stroke={PLATFORM_STYLES[platform]?.color || "#134074"}
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceHistoryChart;

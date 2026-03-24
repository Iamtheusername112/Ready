"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function MoneyChart({ data }: { data: { year: number; balance: number }[] }) {
  return (
    <div className="h-56 w-full min-w-0 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 4, left: 2, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-emerald-100" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
          <YAxis
            width={40}
            tick={{ fontSize: 10 }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value) => [
              typeof value === "number" ? `$${value.toLocaleString()}` : String(value ?? ""),
              "Balance",
            ]}
            labelFormatter={(y) => `Age ${y}`}
          />
          <Line type="monotone" dataKey="balance" stroke="#059669" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

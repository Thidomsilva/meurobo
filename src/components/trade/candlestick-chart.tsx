"use client";
import {
  CandlestickChart as RechartsCandlestick,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Bar,
  ComposedChart,
} from "recharts";
import { chartData } from "@/lib/data";

export function CandlestickChartComponent() {
  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            orientation="right"
            domain={["dataMin - 0.0001", "dataMax + 0.0001"]}
            tickFormatter={(value) => (typeof value === 'number' ? value.toFixed(5) : value)}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={{ stroke: "hsl(var(--border))" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: any, name: any, props: any) => {
              if (name === 'value' && Array.isArray(value)) {
                return [
                  `Open: ${value[0]}`,
                  `High: ${props.payload.high}`,
                  `Low: ${props.payload.low}`,
                  `Close: ${value[1]}`,
                ];
              }
              return value;
            }}
          />
          <Bar
            dataKey="value"
            shape={<Candlestick />}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

const Candlestick = (props: any) => {
  const { x, y, width, height, low, high, openClose } = props;
  const isRising = openClose[1] >= openClose[0];
  const color = isRising ? "#26A69A" : "#EF5350";
  const wickRatio = Math.abs(height / (openClose[1] - openClose[0]));

  const highWickY = y + (isRising ? (openClose[1] - high) * wickRatio : (openClose[0] - high) * wickRatio);
  const lowWickY = y + (isRising ? (openClose[1] - low) * wickRatio : (openClose[0] - low) * wickRatio);

  return (
    <g stroke={color} fill={color} strokeWidth="1">
       {/* High Wick */}
      <path d={`M ${x + width / 2} ${y} L ${x + width / 2} ${y + height}`} />

      {/* Candle Body */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
      />
    </g>
  );
};

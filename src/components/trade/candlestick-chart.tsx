"use client";
import {
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
  const { x, y: yCoord, width, height: barHeight, low, high, value, open, close } = props;
  const isRising = value[1] >= value[0];
  const color = isRising ? "#26A69A" : "#EF5350";
  
  const y1 = props.yAxis.scale(high);
  const y2 = props.yAxis.scale(low);

  const openY = props.yAxis.scale(value[0]);
  const closeY = props.yAxis.scale(value[1]);

  const bodyY = isRising ? closeY : openY;
  const bodyHeight = Math.max(1, Math.abs(openY - closeY));


  return (
    <g stroke={isRising ? 'rgb(38, 166, 154)' : 'rgb(239, 83, 80)'} fill={isRising ? 'rgb(38, 166, 154)' : 'rgb(239, 83, 80)'} strokeWidth="1">
       {/* High-Low Wick */}
       <line x1={x + width / 2} y1={y1} x2={x + width / 2} y2={y2} />
       
       {/* Candle Body */}
      <rect
        x={x}
        y={bodyY}
        width={width}
        height={bodyHeight}
      />
    </g>
  );
};

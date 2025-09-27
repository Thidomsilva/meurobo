"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { equityData } from "@/lib/data"
const chartConfig = {
  balance: {
    label: "Balanço",
    color: "hsl(var(--chart-1))",
  },
}

export function EquityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Curva de Equidade</CardTitle>
        <CardDescription>
          A evolução do seu balanço ao longo do tempo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={equityData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                 const date = new Date(value)
                 return date.toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                 })
              }}
            />
            <ChartTooltip
                cursor={false}
                content={
                    <ChartTooltipContent
                    labelFormatter={(value, payload) => {
                        return new Date(payload?.[0]?.payload.date).toLocaleDateString("pt-BR", {
                           month: "short",
                           day: "numeric",
                           year: "numeric"
                        })
                    }}
                    formatter={(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    indicator="dot"
                    />
                }
            />
            <Area
              dataKey="balance"
              type="natural"
              fill="var(--color-balance)"
              fillOpacity={0.4}
              stroke="var(--color-balance)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

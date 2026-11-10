import * as React from "react"
import { ResponsiveContainer } from "recharts"

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    color?: string
  }
>

type ChartContainerProps = React.ComponentProps<typeof ResponsiveContainer> & {
  config: ChartConfig
  className?: string
  children: React.ReactNode
}

function ChartContainer({ config, className, children, ...props }: ChartContainerProps) {
  const chartColors = Object.entries(config).reduce<Record<string, string>>(
    (colors, [key, value]) => {
      if (value.color) colors[`--color-${key}`] = value.color
      return colors
    },
    {},
  )

  return (
    <div className={className} style={chartColors as React.CSSProperties}>
      <ResponsiveContainer width="100%" height="100%" {...props}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}

export { ChartContainer }

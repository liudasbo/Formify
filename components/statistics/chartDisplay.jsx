import { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CHART_COLORS = [
  "hsl(215, 90%, 50%)", // Sapphire Blue
  "hsl(200, 85%, 45%)", // Azure
  "hsl(230, 80%, 60%)", // Royal Blue
  "hsl(190, 95%, 40%)", // Cyan Blue
  "hsl(245, 70%, 55%)", // Indigo
  "hsl(220, 65%, 70%)", // Light Blue
  "hsl(205, 75%, 80%)", // Sky Blue
  "hsl(240, 60%, 85%)", // Lavender
  "hsl(180, 70%, 45%)", // Teal
  "hsl(255, 50%, 65%)", // Periwinkle
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-md shadow-md p-3 text-sm">
        <div className="font-medium mb-1">{data.name}</div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Responses:</span>
          <span className="font-medium">{data.responses || data.value}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Percentage:</span>
          <span className="font-medium">{data.percent}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export function ChartDisplay({ question, answers, chartType }) {
  const chartData = useMemo(() => {
    if (!answers || answers.length === 0) return [];

    switch (question.type) {
      case "multipleChoice":
      case "checkBoxes":
        const optionCounts = {};

        if (question.options && Array.isArray(question.options)) {
          question.options.forEach((option, index) => {
            optionCounts[option.id] = {
              name: option.value || "Untitled option",
              option: option.value || "Untitled option",
              value: 0,
              responses: 0,
              optionId: option.id,
              percent: 0,
              fill: CHART_COLORS[index % CHART_COLORS.length],
            };
          });
        }

        answers.forEach((answer) => {
          if (answer.optionId && optionCounts[answer.optionId]) {
            optionCounts[answer.optionId].value += 1;
            optionCounts[answer.optionId].responses += 1;
          }
        });

        const totalAnswers = answers.length;
        Object.values(optionCounts).forEach((option) => {
          option.percent =
            totalAnswers > 0
              ? Math.round((option.value / totalAnswers) * 100)
              : 0;
        });

        return Object.values(optionCounts);

      case "positiveInteger":
        const intValues = answers
          .map((a) => a.intValue)
          .filter((v) => typeof v === "number");

        if (intValues.length === 0) return [];

        if (intValues.length <= 10) {
          const valueCounts = {};
          intValues.forEach((val) => {
            if (!valueCounts[val]) {
              valueCounts[val] = {
                name: val.toString(),
                option: val.toString(),
                value: 0,
                responses: 0,
                percent: 0,
              };
            }
            valueCounts[val].value += 1;
            valueCounts[val].responses += 1;
          });

          const sortedValues = Object.values(valueCounts).sort(
            (a, b) => parseInt(a.name) - parseInt(b.name)
          );

          sortedValues.forEach((item, index) => {
            item.percent =
              intValues.length > 0
                ? Math.round((item.value / intValues.length) * 100)
                : 0;
            item.fill = CHART_COLORS[index % CHART_COLORS.length];
          });

          return sortedValues;
        } else {
          const min = Math.min(...intValues);
          const max = Math.max(...intValues);
          const range = max - min;
          const binCount = Math.min(10, range);
          const binSize = Math.ceil(range / binCount);

          const bins = {};
          for (let i = 0; i < binCount; i++) {
            const binStart = min + i * binSize;
            const binEnd = binStart + binSize - 1;
            const binName = `${binStart}${
              binStart !== binEnd ? `-${binEnd}` : ""
            }`;
            bins[binName] = {
              name: binName,
              option: binName,
              value: 0,
              responses: 0,
              percent: 0,
              fill: CHART_COLORS[i % CHART_COLORS.length],
            };
          }

          intValues.forEach((val) => {
            const binIndex = Math.floor((val - min) / binSize);
            const binStart = min + binIndex * binSize;
            const binEnd = binStart + binSize - 1;
            const binName = `${binStart}${
              binStart !== binEnd ? `-${binEnd}` : ""
            }`;
            bins[binName].value += 1;
            bins[binName].responses += 1;
          });

          Object.values(bins).forEach((bin) => {
            bin.percent =
              intValues.length > 0
                ? Math.round((bin.value / intValues.length) * 100)
                : 0;
          });

          return Object.values(bins);
        }

      default:
        return [];
    }
  }, [question, answers]);

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p>No data available for visualization</p>
      </div>
    );
  }

  if (
    chartType === "bar" ||
    question.type === "positiveInteger" ||
    (chartData.length > 5 && question.type !== "multipleChoice")
  ) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
          barSize={28}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            opacity={0.15}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            align="center"
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{
              paddingTop: 15,
              fontSize: "13px",
            }}
          />
          <Bar
            dataKey="value"
            name="Responses"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill || CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div className="mx-auto aspect-square h-full w-full [&_.recharts-pie-label-text]:fill-foreground">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 30,
          }}
        >
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={({ x, y, cx, cy, value }) => {
              return (
                <text
                  x={x}
                  y={y}
                  textAnchor={x > cx ? "start" : "end"}
                  fill="hsl(var(--foreground))"
                  fontSize={12}
                  fontWeight={500}
                >
                  {`${value}`}
                </text>
              );
            }}
            outerRadius={120}
            innerRadius={chartData.length > 8 ? 60 : 0}
            paddingAngle={chartData.length > 8 ? 2 : 0}
            dataKey="value"
            nameKey="name"
            animationDuration={800}
            isAnimationActive={true}
            stroke="hsl(var(--background))"
            strokeWidth={2}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill || CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            align="center"
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-sm">{value}</span>}
            wrapperStyle={{
              fontSize: "13px",
              paddingTop: 15,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

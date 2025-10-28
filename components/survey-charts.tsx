"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SurveyResponse {
  _id: string;
  _creationTime: number;
  age?: string;
  gender?: string;
  shoppingPreference?: string;
  onlineShoppingFrequency?: string;
  findClothes?: string;
  socialMediaShopping?: string;
  socialMediaPlatforms?: string[];
  clothesFit?: string;
  returnsProblem?: string;
  misSizedItems?: string;
  trustIssues?: string[];
  colorMatchingUncertainty?: string;
  imageUploadWillingness?: string;
  tryOnFromSocialMedia?: string;
  tryOnUseFrequency?: string;
  tryOnBodyType?: string;
  tryOnConcerns?: string[];
  speedExpectation?: string;
  skinToneAccuracy?: string;
  virtualTryOn?: string;
  arRealism?: string;
  purchaseConfidence?: string;
  completedAt: number;
  userAgent?: string;
}

interface SurveyChartsProps {
  responses: SurveyResponse[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function SurveyCharts({ responses }: SurveyChartsProps) {
  const [activeChart, setActiveChart] = React.useState("demographics");
  const totalResponses = responses.length;

  // Calculate demographics data
  const ageGroups = responses.reduce((acc, r) => {
    if (r.age) {
      acc[r.age] = (acc[r.age] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const genderDistribution = responses.reduce((acc, r) => {
    if (r.gender) {
      acc[r.gender] = (acc[r.gender] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const shoppingPreference = responses.reduce((acc, r) => {
    if (r.shoppingPreference) {
      acc[r.shoppingPreference] = (acc[r.shoppingPreference] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Calculate pain points data
  const returnFrequency = responses.reduce((acc, r) => {
    if (r.returnsProblem) {
      acc[r.returnsProblem] = (acc[r.returnsProblem] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const confidenceInFit = responses.reduce((acc, r) => {
    if (r.clothesFit) {
      acc[r.clothesFit] = (acc[r.clothesFit] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Prepare chart data
  const ageChartData = Object.entries(ageGroups).map(([age, count]) => ({
    category: age,
    count,
    percentage: ((count / totalResponses) * 100).toFixed(1)
  }));

  const genderChartData = Object.entries(genderDistribution).map(([gender, count]) => ({
    category: gender,
    count,
    percentage: ((count / totalResponses) * 100).toFixed(1)
  }));

  const shoppingChartData = Object.entries(shoppingPreference).map(([preference, count]) => ({
    category: preference.replace("-", " "),
    count,
    percentage: ((count / totalResponses) * 100).toFixed(1)
  }));

  const returnChartData = Object.entries(returnFrequency).map(([frequency, count]) => ({
    category: frequency,
    count,
    percentage: ((count / totalResponses) * 100).toFixed(1)
  }));

  const fitChartData = Object.entries(confidenceInFit).map(([fit, count]) => ({
    category: fit,
    count,
    percentage: ((count / totalResponses) * 100).toFixed(1)
  }));

  const chartOptions = {
    demographics: { data: ageChartData, title: "Age Distribution", description: "Survey respondents by age group" },
    gender: { data: genderChartData, title: "Gender Distribution", description: "Survey respondents by gender" },
    shopping: { data: shoppingChartData, title: "Shopping Preferences", description: "How users prefer to shop" },
    returns: { data: returnChartData, title: "Return Frequency", description: "How often users return items" },
    fit: { data: fitChartData, title: "Fit Confidence", description: "User confidence in clothing fit" },
  };

  const currentChart = chartOptions[activeChart as keyof typeof chartOptions];

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>{currentChart.title}</CardTitle>
            <CardDescription>{currentChart.description}</CardDescription>
          </div>
          <div className="flex">
            <Select value={activeChart} onValueChange={setActiveChart}>
              <SelectTrigger className="w-[160px] rounded-none border-0 border-l">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="demographics">Age Groups</SelectItem>
                <SelectItem value="gender">Gender</SelectItem>
                <SelectItem value="shopping">Shopping Prefs</SelectItem>
                <SelectItem value="returns">Returns</SelectItem>
                <SelectItem value="fit">Fit Confidence</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            {activeChart === "gender" ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentChart.data}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="count"
                    label={({ category, percentage }) => `${category}: ${percentage}%`}
                    labelLine={false}
                    fontSize={12}
                  >
                    {currentChart.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentChart.data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--chart-1))" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
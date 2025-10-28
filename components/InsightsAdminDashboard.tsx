"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { SurveyDataTable } from "@/components/survey-data-table";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

function toLower(value?: string) {
  return (value ?? "").toLowerCase();
}

function isPositive(value?: string) {
  const v = toLower(value);
  return (
    v.includes("yes") ||
    v.includes("willing") ||
    v.includes("confident") ||
    v.includes("very") ||
    v.includes("high") ||
    v.includes("often")
  );
}


function percent(numerator: number, denominator: number) {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 100);
}

function bucketAge(ageStr?: string): string {
  if (!ageStr) return "Unknown";
  const lower = ageStr.toLowerCase();
  // Try ranges like "18-24"
  const rangeMatch = lower.match(/(\d{1,3})\s*-\s*(\d{1,3})/);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    if (start < 18) return "<18";
    if (start < 25) return "18-24";
    if (start < 35) return "25-34";
    if (start < 45) return "35-44";
    if (start < 55) return "45-54";
    if (start < 65) return "55-64";
    return "65+";
  }
  // Try single number
  const num = parseInt(lower.replace(/[^0-9]/g, ""), 10);
  if (!isNaN(num)) {
    if (num < 18) return "<18";
    if (num < 25) return "18-24";
    if (num < 35) return "25-34";
    if (num < 45) return "35-44";
    if (num < 55) return "45-54";
    if (num < 65) return "55-64";
    return "65+";
  }
  return "Unknown";
}

export function InsightsAdminDashboard() {
  const responses = useQuery(api.myFunctions.getAllResponses) as SurveyResponse[] | undefined;

  const total = responses?.length ?? 0;

  const metrics = React.useMemo(() => {
    const list = responses ?? [];

    const uploadYes = list.filter((r) => isPositive(r.imageUploadWillingness)).length;
    const confidentYes = list.filter((r) => isPositive(r.purchaseConfidence)).length;
    const fitPositive = list.filter((r) => isPositive(r.clothesFit)).length;
    const socialMediaShoppers = list.filter((r) => isPositive(r.socialMediaShopping)).length;

    // Adoption potential: both upload willingness and purchase confidence positive
    const adoptionCohort = list.filter(
      (r) => isPositive(r.imageUploadWillingness) && isPositive(r.purchaseConfidence)
    ).length;

    // Time series by day
    const byDayMap = new Map<string, number>();
    for (const r of list) {
      const d = new Date(r.completedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
      byDayMap.set(key, (byDayMap.get(key) ?? 0) + 1);
    }
    const responsesByDay = Array.from(byDayMap.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([date, value]) => ({ date, value }));

    // Gender distribution
    const genderMap = new Map<string, number>();
    for (const r of list) {
      const g = r.gender?.trim() || "Unknown";
      genderMap.set(g, (genderMap.get(g) ?? 0) + 1);
    }
    const genderData = Array.from(genderMap.entries()).map(([name, value]) => ({ name, value }));

    // Age groups
    const ageMap = new Map<string, number>();
    for (const r of list) {
      const group = bucketAge(r.age);
      ageMap.set(group, (ageMap.get(group) ?? 0) + 1);
    }
    const ageData = Array.from(ageMap.entries()).map(([name, value]) => ({ name, value }));

    // Shopping preference
    const prefMap = new Map<string, number>();
    for (const r of list) {
      const p = r.shoppingPreference?.replace(/-/g, " ") || "Unknown";
      prefMap.set(p, (prefMap.get(p) ?? 0) + 1);
    }
    const shoppingPrefData = Array.from(prefMap.entries()).map(([name, value]) => ({ name, value }));

    // Purchase confidence distribution
    const confMap = new Map<string, number>();
    for (const r of list) {
      const c = r.purchaseConfidence?.replace(/-/g, " ") || "Unknown";
      confMap.set(c, (confMap.get(c) ?? 0) + 1);
    }
    const purchaseConfidenceData = Array.from(confMap.entries()).map(([name, value]) => ({ name, value }));

    // Fit confidence distribution
    const fitMap = new Map<string, number>();
    for (const r of list) {
      const f = r.clothesFit?.replace(/-/g, " ") || "Unknown";
      fitMap.set(f, (fitMap.get(f) ?? 0) + 1);
    }
    const fitConfidenceData = Array.from(fitMap.entries()).map(([name, value]) => ({ name, value }));

    // Social media platforms
    const platformMap = new Map<string, number>();
    for (const r of list) {
      for (const p of r.socialMediaPlatforms ?? []) {
        platformMap.set(p, (platformMap.get(p) ?? 0) + 1);
      }
    }
    const platformData = Array.from(platformMap.entries()).map(([name, value]) => ({ name, value }));

    // Concerns
    const concernMap = new Map<string, number>();
    for (const r of list) {
      for (const c of r.tryOnConcerns ?? []) {
        concernMap.set(c, (concernMap.get(c) ?? 0) + 1);
      }
    }
    const concernsData = Array.from(concernMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));

    return {
      uploadYes,
      confidentYes,
      fitPositive,
      socialMediaShoppers,
      adoptionCohort,
      responsesByDay,
      genderData,
      ageData,
      shoppingPrefData,
      purchaseConfidenceData,
      fitConfidenceData,
      platformData,
      concernsData,
    };
  }, [responses]);

  const onViewDetails = (r: SurveyResponse) => {
    // Hook up a detailed dialog in the future; for now, log to console.
    console.log("View details:", r);
  };

  if (!responses) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading survey insights…</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Insights</h1>
        <p className="text-sm text-muted-foreground">Actionable insights from collected survey responses</p>
      </div>
      <Separator className="my-2" />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex w-full flex-wrap gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Responses</CardTitle>
                <CardDescription>All-time count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Willingness</CardTitle>
                <CardDescription>Ready to upload images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{percent(metrics.uploadYes, total)}%</div>
                  <Badge variant="outline">{metrics.uploadYes}/{total}</Badge>
                </div>
                <Progress value={percent(metrics.uploadYes, total)} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Purchase Confidence</CardTitle>
                <CardDescription>Confident buyers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{percent(metrics.confidentYes, total)}%</div>
                  <Badge variant="outline">{metrics.confidentYes}/{total}</Badge>
                </div>
                <Progress value={percent(metrics.confidentYes, total)} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>App Adoption Potential</CardTitle>
                <CardDescription>Both willing & confident</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{percent(metrics.adoptionCohort, total)}%</div>
                  <Badge variant="outline">{metrics.adoptionCohort}/{total}</Badge>
                </div>
                <Progress value={percent(metrics.adoptionCohort, total)} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Activity trend */}
          <Card>
            <CardHeader>
              <CardTitle>Responses Over Time</CardTitle>
              <CardDescription>Daily collected responses</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.responsesByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#7c3aed" name="Responses" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>Data-backed highlights from responses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="list-disc pl-6 text-sm">
                <li>
                  <span className="font-medium">Strong adoption signal:</span> {percent(metrics.adoptionCohort, total)}% of respondents are both willing to upload images and confident about purchasing.
                </li>
                <li>
                  <span className="font-medium">Upload readiness:</span> {percent(metrics.uploadYes, total)}% indicate willingness to upload images for try-on.
                </li>
                <li>
                  <span className="font-medium">Purchase confidence:</span> {percent(metrics.confidentYes, total)}% feel confident when buying.
                </li>
                <li>
                  <span className="font-medium">Social influence:</span> {percent(metrics.socialMediaShoppers, total)}% shop via social media.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
              <CardDescription>Priorities inferred from pain points and interests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <ul className="list-disc pl-6">
                <li>Double down on virtual try-on onboarding for the adoption cohort to accelerate initial traction.</li>
                <li>Emphasize purchase confidence cues (fit accuracy, skin tone/lighting, realistic AR) in the product flow.</li>
                <li>Leverage social channels and platforms with highest counts to drive acquisition.</li>
              </ul>
              <div className="mt-2">
                <Badge variant="secondary">Mission-aligned</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Self-identified gender</CardDescription>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie dataKey="value" data={metrics.genderData} outerRadius={100} fill="#10b981" />
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Age Groups</CardTitle>
                <CardDescription>Bucketed by common ranges</CardDescription>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.ageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Shopping Preferences</CardTitle>
                <CardDescription>Preferred shopping channels</CardDescription>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.shoppingPrefData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Purchase Confidence</CardTitle>
                <CardDescription>Distribution across respondents</CardDescription>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.purchaseConfidenceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Fit Confidence</CardTitle>
                <CardDescription>How well clothes fit</CardDescription>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.fitConfidenceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Platforms</CardTitle>
                <CardDescription>Where people shop socially</CardDescription>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.platformData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Concerns</CardTitle>
              <CardDescription>Most mentioned try-on concerns</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.concernsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Responses */}
        <TabsContent value="responses" className="space-y-4">
          <SurveyDataTable responses={responses} onViewDetails={onViewDetails} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
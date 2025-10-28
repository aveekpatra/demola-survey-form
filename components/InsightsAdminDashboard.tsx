"use client";

import React, { useState, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { SurveyResponse } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  TrendingUp, 
  ShoppingBag, 
  Smartphone, 
  Upload,
  Target,
  AlertTriangle,
  Shield,
  Zap,
  Download,
  Eye,
  BarChart3,
  PieChart
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { SurveyDataTable } from "./survey-data-table";

// Utility functions
const toLower = (str?: string) => str?.toLowerCase() || "";
const isPositive = (value?: string) => {
  if (!value) return false;
  const lower = value.toLowerCase();
  
  // Handle actual survey response values based on the survey questions
  return [
    // Image upload willingness
    "yes-upload", "maybe-upload",
    // Social media shopping
    "yes-social", "sometimes-social",
    // Purchase confidence
    "very-confident", "confident",
    // Virtual try-on
    "very-interested", "interested",
    // Try-on from social media
    "much-more-likely", "somewhat-more-likely",
    // General positive responses
    "yes", "definitely", "very-willing", "willing",
    "extremely-important", "very-important", "important",
    "online-only", "online-primarily", "both-equally"
  ].includes(lower);
};
const percent = (numerator: number, denominator: number) => denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;

const bucketAge = (age?: string) => {
  if (!age) return "Unknown";
  
  // Handle the actual age values from survey questions
  switch (age) {
    case "under-18":
      return "Under 18";
    case "18-24":
      return "18-24";
    case "25-34":
      return "25-34";
    case "35-44":
      return "35-44";
    case "45-54":
    case "55-64":
    case "65-over":
      return "45+";
    default:
      return "Unknown";
  }
};

export function InsightsAdminDashboard() {
  const responses = useQuery(api.myFunctions.getAllResponses) || [];
  const [selectedResponse, setSelectedResponse] = React.useState<SurveyResponse | null>(null);

  // Core Analytics
  const analytics = useMemo(() => {
    const total = responses.length;
    if (total === 0) return null;

    // Core KPIs
    const uploadWilling = responses.filter(r => isPositive(r.imageUploadWillingness)).length;
    const socialShoppers = responses.filter(r => isPositive(r.socialMediaShopping)).length;
    const purchaseConfident = responses.filter(r => isPositive(r.purchaseConfidence)).length;
    const adoptionPositive = responses.filter(r => isPositive(r.virtualTryOn)).length;

    // Age distribution
    const ageCounts = responses.reduce((acc, r) => {
      const bucket = bucketAge(r.age);
      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Gender distribution
    const genderCounts = responses.reduce((acc, r) => {
      const gender = r.gender || "Unknown";
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      uploadWilling,
      socialShoppers,
      purchaseConfident,
      adoptionPositive,
      ageDistribution: ageCounts,
      genderDistribution: genderCounts
    };
  }, [responses]);

  // User Segmentation Analysis
  const userSegmentation = useMemo(() => {
    if (!responses.length) return null;

    const powerUsers = responses.filter(r => 
      isPositive(r.imageUploadWillingness) && 
      isPositive(r.virtualTryOn) && 
      isPositive(r.purchaseConfidence)
    );

    const earlyAdopters = responses.filter(r => 
      isPositive(r.virtualTryOn) && 
      isPositive(r.socialMediaShopping) &&
      !powerUsers.includes(r)
    );

    const skeptics = responses.filter(r => 
      !isPositive(r.virtualTryOn) && 
      (r.trustIssues?.length || 0) > 0
    );

    const potentialConverts = responses.filter(r => 
      !powerUsers.includes(r) && 
      !earlyAdopters.includes(r) && 
      !skeptics.includes(r) &&
      (isPositive(r.socialMediaShopping) || isPositive(r.purchaseConfidence))
    );

    return {
      powerUsers: { count: powerUsers.length, percentage: percent(powerUsers.length, responses.length) },
      earlyAdopters: { count: earlyAdopters.length, percentage: percent(earlyAdopters.length, responses.length) },
      skeptics: { count: skeptics.length, percentage: percent(skeptics.length, responses.length) },
      potentialConverts: { count: potentialConverts.length, percentage: percent(potentialConverts.length, responses.length) }
    };
  }, [responses]);

  // Conversion Funnel Analysis
  const conversionFunnel = useMemo(() => {
    if (!responses.length) return null;

    const awareness = responses.filter(r => r.socialMediaShopping).length;
    const interest = responses.filter(r => isPositive(r.socialMediaShopping)).length;
    const consideration = responses.filter(r => isPositive(r.virtualTryOn)).length;
    const intent = responses.filter(r => isPositive(r.imageUploadWillingness)).length;
    const action = responses.filter(r => isPositive(r.purchaseConfidence)).length;

    return [
      { stage: "Awareness", count: awareness, percentage: percent(awareness, responses.length) },
      { stage: "Interest", count: interest, percentage: percent(interest, responses.length) },
      { stage: "Consideration", count: consideration, percentage: percent(consideration, responses.length) },
      { stage: "Intent", count: intent, percentage: percent(intent, responses.length) },
      { stage: "Action", count: action, percentage: percent(action, responses.length) }
    ];
  }, [responses]);

  // Pain Point Analysis
  const painPointAnalysis = useMemo(() => {
    if (!responses.length) return null;

    const fitIssues = responses.filter(r => r.clothesFit === "not-confident-fit").length;
    const colorMismatch = responses.filter(r => r.colorMatchingUncertainty === "almost-always" || r.colorMatchingUncertainty === "often").length;
    const highReturns = responses.filter(r => r.returnsProblem === "very-often" || r.returnsProblem === "often").length;
    const trustConcerns = responses.filter(r => (r.trustIssues?.length || 0) > 0).length;
    const privacyConcerns = responses.filter(r => r.trustIssues?.includes("scam")).length;

    const trustIssuesBreakdown = responses.reduce((acc, r) => {
      r.trustIssues?.forEach(issue => {
        acc[issue] = (acc[issue] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      criticalPainPoints: [
        { name: "Fit Issues", count: fitIssues, percentage: percent(fitIssues, responses.length) },
        { name: "Color Mismatch", count: colorMismatch, percentage: percent(colorMismatch, responses.length) },
        { name: "High Returns", count: highReturns, percentage: percent(highReturns, responses.length) },
        { name: "Trust Concerns", count: trustConcerns, percentage: percent(trustConcerns, responses.length) },
        { name: "Privacy Concerns", count: privacyConcerns, percentage: percent(privacyConcerns, responses.length) }
      ],
      trustIssuesBreakdown
    };
  }, [responses]);

  // Market Opportunity Analysis
  const marketOpportunity = useMemo(() => {
    if (!responses.length) return null;

    const totalMarket = responses.length * 1000; // Assuming each response represents 1000 potential users
    const servicableMarket = responses.filter(r => isPositive(r.socialMediaShopping) || isPositive(r.onlineShoppingFrequency)).length * 1000;
    const obtainableMarket = responses.filter(r => isPositive(r.virtualTryOn) && isPositive(r.imageUploadWillingness)).length * 1000;
    
    const avgOrderValue = 75; // Estimated AOV
    const conversionRate = 0.03; // 3% conversion rate
    
    const potentialRevenue = obtainableMarket * avgOrderValue * conversionRate;

    return {
      tam: totalMarket,
      sam: servicableMarket,
      som: obtainableMarket,
      potentialRevenue: Math.round(potentialRevenue),
      conversionOpportunity: percent(obtainableMarket, totalMarket)
    };
  }, [responses]);

  const onViewDetails = (response: SurveyResponse) => {
    setSelectedResponse(response);
  };

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Survey Analytics Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Virtual Try-On Market Research Analysis</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <div className="text-sm text-gray-500">
                Total Responses: <span className="font-semibold text-gray-900">{analytics.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="segmentation">User Segments</TabsTrigger>
            <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
            <TabsTrigger value="painpoints">Pain Points</TabsTrigger>
            <TabsTrigger value="market">Market Opportunity</TabsTrigger>
            <TabsTrigger value="responses">Individual Responses</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upload Willingness</CardTitle>
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{percent(analytics.uploadWilling, analytics.total)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.uploadWilling} of {analytics.total} users
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${percent(analytics.uploadWilling, analytics.total)}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Social Media Shoppers</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{percent(analytics.socialShoppers, analytics.total)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.socialShoppers} shop via social media
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${percent(analytics.socialShoppers, analytics.total)}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Purchase Confidence</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{percent(analytics.purchaseConfident, analytics.total)}%</div>
                  <p className="text-xs text-muted-foreground">
                    Would buy after virtual try-on
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${percent(analytics.purchaseConfident, analytics.total)}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">App Adoption</CardTitle>
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{percent(analytics.adoptionPositive, analytics.total)}%</div>
                  <p className="text-xs text-muted-foreground">
                    Ready to use the app
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full" 
                      style={{ width: `${percent(analytics.adoptionPositive, analytics.total)}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strategic Insights */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    High Market Interest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {percent(analytics.uploadWilling, analytics.total)}% of users are willing to upload images, indicating strong market 
                    acceptance for virtual try-on technology.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Market Readiness</span>
                      <span className="font-semibold">High</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Technology Acceptance</span>
                      <span className="font-semibold">{percent(analytics.adoptionPositive, analytics.total)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Business Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {percent(analytics.purchaseConfident, analytics.total)}% would be more confident purchasing after virtual try-on, showing 
                    clear ROI potential.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Conversion Potential</span>
                      <span className="font-semibold">High</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Social Commerce Ready</span>
                      <span className="font-semibold">{percent(analytics.socialShoppers, analytics.total)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Demographics Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Age Distribution
                  </CardTitle>
                  <CardDescription>Survey respondents by age group</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(analytics.ageDistribution).map(([name, value]) => ({ name, value }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar dataKey="value" fill="#0088FE" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Gender Distribution
                  </CardTitle>
                  <CardDescription>Survey respondents by gender</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={Object.entries(analytics.genderDistribution).map(([name, value]) => ({ name, value }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(analytics.genderDistribution).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Segmentation Tab */}
          <TabsContent value="segmentation" className="space-y-6">
            {userSegmentation && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      Power Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{userSegmentation.powerUsers.count}</div>
                    <p className="text-sm text-gray-600">{userSegmentation.powerUsers.percentage}% of total</p>
                    <p className="text-xs text-gray-500 mt-2">High engagement across all metrics</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Early Adopters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{userSegmentation.earlyAdopters.count}</div>
                    <p className="text-sm text-gray-600">{userSegmentation.earlyAdopters.percentage}% of total</p>
                    <p className="text-xs text-gray-500 mt-2">Ready for virtual try-on technology</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-orange-600" />
                      Potential Converts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">{userSegmentation.potentialConverts.count}</div>
                    <p className="text-sm text-gray-600">{userSegmentation.potentialConverts.percentage}% of total</p>
                    <p className="text-xs text-gray-500 mt-2">Show interest but need convincing</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Skeptics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">{userSegmentation.skeptics.count}</div>
                    <p className="text-sm text-gray-600">{userSegmentation.skeptics.percentage}% of total</p>
                    <p className="text-xs text-gray-500 mt-2">Have trust or privacy concerns</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Conversion Funnel Tab */}
          <TabsContent value="funnel" className="space-y-6">
            {conversionFunnel && (
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Funnel Analysis</CardTitle>
                  <CardDescription>User journey from awareness to purchase action</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conversionFunnel.map((stage, index) => (
                      <div key={stage.stage} className="flex items-center space-x-4">
                        <div className="w-24 text-sm font-medium">{stage.stage}</div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{stage.count} users</span>
                            <span>{stage.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500" 
                              style={{ width: `${stage.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Pain Points Tab */}
          <TabsContent value="painpoints" className="space-y-6">
            {painPointAnalysis && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Critical Pain Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {painPointAnalysis.criticalPainPoints.map((point, index) => (
                        <div key={point.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{point.name}</div>
                            <div className="text-sm text-gray-600">{point.count} users affected</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-red-600">{point.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Trust Issues Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(painPointAnalysis.trustIssuesBreakdown).map(([issue, count]) => (
                        <div key={issue} className="flex justify-between items-center p-2 border-b">
                          <span className="text-sm">{issue}</span>
                          <Badge variant="outline">{count} users</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Market Opportunity Tab */}
          <TabsContent value="market" className="space-y-6">
            {marketOpportunity && (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Total Addressable Market</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{marketOpportunity.tam.toLocaleString()}</div>
                      <p className="text-xs text-gray-500">Potential users</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Serviceable Market</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{marketOpportunity.sam.toLocaleString()}</div>
                      <p className="text-xs text-gray-500">Online shoppers</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Obtainable Market</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{marketOpportunity.som.toLocaleString()}</div>
                      <p className="text-xs text-gray-500">Ready adopters</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Revenue Potential</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${marketOpportunity.potentialRevenue.toLocaleString()}</div>
                      <p className="text-xs text-gray-500">Annual estimate</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Market Opportunity Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-800">Key Opportunity</h4>
                        <p className="text-sm text-green-700 mt-1">
                          {marketOpportunity.conversionOpportunity}% of the total market shows strong adoption signals, 
                          representing significant revenue potential of ${marketOpportunity.potentialRevenue.toLocaleString()} annually.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Individual Responses Tab */}
          <TabsContent value="responses" className="space-y-6">
            <SurveyDataTable responses={responses} onViewDetails={onViewDetails} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Response Details Modal */}
      <Dialog open={!!selectedResponse} onOpenChange={() => setSelectedResponse(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Response Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedResponse ? new Date(selectedResponse._creationTime).toLocaleDateString() : ''}
            </DialogDescription>
          </DialogHeader>
          {selectedResponse && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <span className="text-gray-600">Age:</span>
                  <p className="font-medium">{selectedResponse.age || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Gender:</span>
                  <p className="font-medium">{selectedResponse.gender || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Shopping Preference:</span>
                  <p className="font-medium">{selectedResponse.shoppingPreference || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Online Shopping Frequency:</span>
                  <p className="font-medium">{selectedResponse.onlineShoppingFrequency || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Social Media Shopping:</span>
                  <p className="font-medium">{selectedResponse.socialMediaShopping || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Clothes Fit Experience:</span>
                  <p className="font-medium">{selectedResponse.clothesFit || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Upload Willingness:</span>
                  <p className="font-medium">{selectedResponse.imageUploadWillingness || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Virtual Try-On Interest:</span>
                  <p className="font-medium">{selectedResponse.virtualTryOn || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Purchase Confidence:</span>
                  <p className="font-medium">{selectedResponse.purchaseConfidence || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Skin Tone Importance:</span>
                  <p className="font-medium">{selectedResponse.skinToneAccuracy || 'Not specified'}</p>
                </div>
              </div>
              
              {selectedResponse.trustIssues && selectedResponse.trustIssues.length > 0 && (
                <div className="pt-2 border-t">
                  <span className="text-gray-600">Trust Issues:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedResponse.trustIssues.map((issue, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
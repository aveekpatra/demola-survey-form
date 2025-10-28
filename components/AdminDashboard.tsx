"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Loader2, Users, ShoppingBag, AlertTriangle, Star, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

export default function AdminDashboard() {
  const responses = useQuery(api.myFunctions.getAllResponses);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);

  if (!responses) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalResponses = responses.length;

  // Calculate comprehensive metrics
  const demographics = {
    ageGroups: responses.reduce((acc, r) => {
      if (r.age) {
        acc[r.age] = (acc[r.age] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    genderDistribution: responses.reduce((acc, r) => {
      if (r.gender) {
        acc[r.gender] = (acc[r.gender] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    shoppingPreference: responses.reduce((acc, r) => {
      if (r.shoppingPreference) {
        acc[r.shoppingPreference] = (acc[r.shoppingPreference] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>)
  };

  const painPoints = {
    returnFrequency: responses.reduce((acc, r) => {
      if (r.returnsProblem) {
        acc[r.returnsProblem] = (acc[r.returnsProblem] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    confidenceInFit: responses.reduce((acc, r) => {
      if (r.clothesFit) {
        acc[r.clothesFit] = (acc[r.clothesFit] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    commonMisSizedItems: responses.reduce((acc, r) => {
      if (r.misSizedItems) {
        acc[r.misSizedItems] = (acc[r.misSizedItems] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>)
  };

  const featureAnalysis = {
    bodyShapeAccuracy: responses.reduce((acc, r) => {
      if (r.tryOnBodyType) {
        acc[r.tryOnBodyType] = (acc[r.tryOnBodyType] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    skinToneAccuracy: responses.reduce((acc, r) => {
      if (r.skinToneAccuracy) {
        acc[r.skinToneAccuracy] = (acc[r.skinToneAccuracy] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    acceptableWaitTime: responses.reduce((acc, r) => {
      if (r.speedExpectation) {
        acc[r.speedExpectation] = (acc[r.speedExpectation] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    expectedUsageFrequency: responses.reduce((acc, r) => {
      if (r.tryOnUseFrequency) {
        acc[r.tryOnUseFrequency] = (acc[r.tryOnUseFrequency] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>)
  };

  // Key metrics for overview
  const willingToUpload = responses.filter(r => r.imageUploadWillingness === "yes-upload").length;
  const uploadPercentage = totalResponses > 0 ? (willingToUpload / totalResponses) * 100 : 0;
  const socialMediaShoppers = responses.filter(r => 
    r.socialMediaShopping === "yes-social" || r.socialMediaShopping === "sometimes-social"
  ).length;
  const highConfidenceAfterTryOn = responses.filter(r => 
    r.tryOnFromSocialMedia === "much-more-likely" || r.tryOnFromSocialMedia === "somewhat-more-likely"
  ).length;
  const likelyToUseApp = responses.filter(r => 
    r.purchaseConfidence === "very-confident" || r.purchaseConfidence === "somewhat-confident"
  ).length;

  // Chart data preparation
  const ageChartData = Object.entries(demographics.ageGroups).map(([age, count]) => ({
    age,
    count,
    percentage: ((count / totalResponses) * 100).toFixed(1)
  }));

  const genderChartData = Object.entries(demographics.genderDistribution).map(([gender, count]) => ({
    gender,
    count,
    percentage: ((count / totalResponses) * 100).toFixed(1)
  }));

  const returnFrequencyData = Object.entries(painPoints.returnFrequency).map(([frequency, count]) => ({
    frequency,
    count,
    percentage: ((count / totalResponses) * 100).toFixed(1)
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const exportData = () => {
    if (responses.length === 0) return;
    
    const csvContent = [
      // Headers
      Object.keys(responses[0]).join(','),
      // Data rows
      ...responses.map(response => 
        Object.values(response).map(value => 
          typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey-responses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="text-center md:text-left">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                Survey Analytics
              </h1>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Virtual Try-On Market Research
              </p>
            </div>
            
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
              <Button 
                onClick={exportData} 
                variant="outline" 
                size="sm" 
                className="w-full md:w-auto text-xs md:text-sm"
              >
                <Download className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                Export Data
              </Button>
              <div className="text-xs md:text-sm text-gray-600 text-center md:text-left bg-gray-100 px-3 py-1 rounded-full">
                <span className="font-medium">{totalResponses}</span> Responses
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 md:py-6">
        <Tabs defaultValue="overview" className="space-y-4">
          {/* Mobile-Optimized Tabs */}
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-max min-w-full bg-white border rounded-lg p-1">
              <TabsTrigger 
                value="overview" 
                className="flex-1 min-w-[80px] text-xs md:text-sm px-3 py-2 whitespace-nowrap"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="demographics" 
                className="flex-1 min-w-[80px] text-xs md:text-sm px-3 py-2 whitespace-nowrap"
              >
                Demographics
              </TabsTrigger>
              <TabsTrigger 
                value="pain-points" 
                className="flex-1 min-w-[80px] text-xs md:text-sm px-3 py-2 whitespace-nowrap"
              >
                Pain Points
              </TabsTrigger>
              <TabsTrigger 
                value="features" 
                className="flex-1 min-w-[80px] text-xs md:text-sm px-3 py-2 whitespace-nowrap"
              >
                Features
              </TabsTrigger>
              <TabsTrigger 
                value="individual" 
                className="flex-1 min-w-[80px] text-xs md:text-sm px-3 py-2 whitespace-nowrap"
              >
                Individual
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards - Mobile First Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-blue-900">Upload Willingness</CardTitle>
                  <div className="p-2 bg-blue-200 rounded-full">
                    <Users className="h-4 w-4 text-blue-700" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-blue-900">{uploadPercentage.toFixed(1)}%</div>
                  <Progress value={uploadPercentage} className="h-2 bg-blue-200" />
                  <p className="text-xs text-blue-700 font-medium">
                    {willingToUpload} out of {totalResponses} users willing to upload photos
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-green-900">Social Media Shoppers</CardTitle>
                  <div className="p-2 bg-green-200 rounded-full">
                    <ShoppingBag className="h-4 w-4 text-green-700" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-green-900">
                    {totalResponses > 0 ? ((socialMediaShoppers / totalResponses) * 100).toFixed(1) : 0}%
                  </div>
                  <Progress 
                    value={totalResponses > 0 ? (socialMediaShoppers / totalResponses) * 100 : 0} 
                    className="h-2 bg-green-200" 
                  />
                  <p className="text-xs text-green-700 font-medium">
                    {socialMediaShoppers} users shop via social media
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-purple-900">Purchase Confidence</CardTitle>
                  <div className="p-2 bg-purple-200 rounded-full">
                    <Star className="h-4 w-4 text-purple-700" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-purple-900">
                    {totalResponses > 0 ? ((highConfidenceAfterTryOn / totalResponses) * 100).toFixed(1) : 0}%
                  </div>
                  <Progress 
                    value={totalResponses > 0 ? (highConfidenceAfterTryOn / totalResponses) * 100 : 0} 
                    className="h-2 bg-purple-200" 
                  />
                  <p className="text-xs text-purple-700 font-medium">
                    Would buy after virtual try-on
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-orange-900">App Adoption</CardTitle>
                  <div className="p-2 bg-orange-200 rounded-full">
                    <AlertTriangle className="h-4 w-4 text-orange-700" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-orange-900">
                    {totalResponses > 0 ? ((likelyToUseApp / totalResponses) * 100).toFixed(1) : 0}%
                  </div>
                  <Progress 
                    value={totalResponses > 0 ? (likelyToUseApp / totalResponses) * 100 : 0} 
                    className="h-2 bg-orange-200" 
                  />
                  <p className="text-xs text-orange-700 font-medium">
                    Likely to use the app
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Insights */}
          <div className="grid grid-cols-1 gap-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>High Market Interest:</strong> {uploadPercentage.toFixed(1)}% of users are willing to upload images, indicating strong market acceptance for virtual try-on technology.
              </AlertDescription>
            </Alert>
            
            <Alert className="bg-green-50 border-green-200">
              <Star className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Business Impact:</strong> {((highConfidenceAfterTryOn / totalResponses) * 100).toFixed(1)}% would be more confident purchasing after virtual try-on, showing clear ROI potential.
              </AlertDescription>
            </Alert>
          </div>

          {/* Charts Section - Mobile Optimized */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Age Distribution</CardTitle>
                <p className="text-sm text-gray-600">Survey respondents by age group</p>
              </CardHeader>
              <CardContent className="p-0">
                <ChartContainer config={{}} className="h-[250px] md:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageChartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                      <XAxis 
                        dataKey="age" 
                        className="text-xs" 
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        className="text-xs" 
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="count" 
                        fill="#3B82F6" 
                        radius={[4, 4, 0, 0]}
                        maxBarSize={60}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Gender Distribution</CardTitle>
                <p className="text-sm text-gray-600">Survey respondents by gender</p>
              </CardHeader>
              <CardContent className="flex justify-center p-4">
                <ChartContainer config={{}} className="h-[250px] md:h-[300px] w-full max-w-md">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="count"
                        label={({ gender, percentage }) => `${gender}: ${percentage}%`}
                        labelLine={false}
                        fontSize={12}
                      >
                        {genderChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Age Groups</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Distribution of survey respondents by age</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(demographics.ageGroups).map(([age, count]) => (
                    <div key={age} className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium">{age}</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(count / totalResponses) * 100} 
                          className="w-16 sm:w-20" 
                        />
                        <span className="text-xs text-muted-foreground w-10 sm:w-12">
                          {count} ({((count / totalResponses) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Gender Distribution</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Survey respondents by gender identity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(demographics.genderDistribution).map(([gender, count]) => (
                    <div key={gender} className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium capitalize">{gender}</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(count / totalResponses) * 100} 
                          className="w-16 sm:w-20" 
                        />
                        <span className="text-xs text-muted-foreground w-10 sm:w-12">
                          {count} ({((count / totalResponses) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shopping Preference</CardTitle>
                <CardDescription>Online vs in-store shopping preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(demographics.shoppingPreference).map(([preference, count]) => (
                    <div key={preference} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{preference.replace('-', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(count / totalResponses) * 100} 
                          className="w-20" 
                        />
                        <span className="text-sm text-muted-foreground w-12">
                          {count} ({((count / totalResponses) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Online Shopping Frequency</CardTitle>
              <CardDescription>How often users shop online</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(responses.reduce((acc, r) => {
                    if (r.onlineShoppingFrequency) {
                      acc[r.onlineShoppingFrequency] = (acc[r.onlineShoppingFrequency] || 0) + 1;
                    }
                    return acc;
                  }, {} as Record<string, number>)).map(([frequency, count]) => ({
                    frequency: frequency.charAt(0).toUpperCase() + frequency.slice(1),
                    count,
                    percentage: ((count / totalResponses) * 100).toFixed(1)
                  }))}>
                    <XAxis dataKey="frequency" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pain-points" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Return Frequency</CardTitle>
                <CardDescription>How often users return items due to poor fit/color</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={returnFrequencyData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ frequency, percentage }) => `${frequency}: ${percentage}%`}
                      >
                        {returnFrequencyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Confidence in Online Fit</CardTitle>
                <CardDescription>User confidence when buying clothes online</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(painPoints.confidenceInFit).map(([confidence, count]) => (
                    <div key={confidence} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{confidence.replace('-', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(count / totalResponses) * 100} 
                          className="w-24" 
                        />
                        <span className="text-sm text-muted-foreground w-16">
                          {count} ({((count / totalResponses) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Most Commonly Mis-Sized Items</CardTitle>
              <CardDescription>Items that users most frequently have sizing issues with</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(painPoints.commonMisSizedItems)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 8)
                  .map(([item, count]) => (
                    <div key={item} className="flex flex-col items-center p-4 border rounded-lg">
                      <span className="text-sm font-medium text-center capitalize">{item}</span>
                      <Badge variant="secondary" className="mt-2">
                        {count} mentions
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trust Concerns</CardTitle>
              <CardDescription>Main concerns when buying from indie brands or social media</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(responses.reduce((acc, r) => {
                  if (r.trustIssues && Array.isArray(r.trustIssues)) {
                    r.trustIssues.forEach((concern: string) => {
                      const trimmed = concern.trim();
                      acc[trimmed] = (acc[trimmed] || 0) + 1;
                    });
                  }
                  return acc;
                }, {} as Record<string, number>))
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 6)
                  .map(([concern, count]) => (
                    <div key={concern} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{concern.replace('-', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(count / totalResponses) * 100} 
                          className="w-24" 
                        />
                        <span className="text-sm text-muted-foreground w-16">
                          {count} ({((count / totalResponses) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Body Shape Accuracy Importance</CardTitle>
                <CardDescription>How important is accurate body shape representation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(featureAnalysis.bodyShapeAccuracy).map(([importance, count]) => (
                    <div key={importance} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{importance.replace('-', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(count / totalResponses) * 100} 
                          className="w-24" 
                        />
                        <span className="text-sm text-muted-foreground w-16">
                          {count} ({((count / totalResponses) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skin Tone Accuracy Importance</CardTitle>
                <CardDescription>How important is accurate skin tone representation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(featureAnalysis.skinToneAccuracy).map(([importance, count]) => (
                    <div key={importance} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{importance.replace('-', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(count / totalResponses) * 100} 
                          className="w-24" 
                        />
                        <span className="text-sm text-muted-foreground w-16">
                          {count} ({((count / totalResponses) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Acceptable Wait Time</CardTitle>
                <CardDescription>How long users are willing to wait for try-on results</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(featureAnalysis.acceptableWaitTime).map(([time, count]) => ({
                      time: time.charAt(0).toUpperCase() + time.slice(1),
                      count,
                      percentage: ((count / totalResponses) * 100).toFixed(1)
                    }))}>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#FFBB28" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expected Usage Frequency</CardTitle>
                <CardDescription>How often users expect to use virtual try-on</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(featureAnalysis.expectedUsageFrequency).map(([frequency, count]) => ({
                          frequency: frequency.replace('-', ' '),
                          count,
                          percentage: ((count / totalResponses) * 100).toFixed(1)
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ frequency, percentage }) => `${frequency}: ${percentage}%`}
                      >
                        {Object.entries(featureAnalysis.expectedUsageFrequency).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Privacy Concerns</CardTitle>
              <CardDescription>User concerns about uploading personal photos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(responses.reduce((acc, r) => {
                  if (r.tryOnConcerns && Array.isArray(r.tryOnConcerns)) {
                    r.tryOnConcerns.forEach((concern: string) => {
                      const trimmed = concern.trim();
                      acc[trimmed] = (acc[trimmed] || 0) + 1;
                    });
                  }
                  return acc;
                }, {} as Record<string, number>))
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 6)
                  .map(([concern, count]) => (
                    <div key={concern} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{concern.replace('-', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(count / totalResponses) * 100} 
                          className="w-24" 
                        />
                        <span className="text-sm text-muted-foreground w-16">
                          {count} ({((count / totalResponses) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Individual Survey Responses</CardTitle>
              <CardDescription>
                Detailed view of each survey response - {totalResponses} total responses
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {/* Mobile-First Card Layout */}
              <div className="space-y-4 p-4 md:p-6">
                {responses.map((response, index) => (
                  <Card key={response._id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-3">
                        {/* Header Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-blue-600">#{index + 1}</span>
                            <div className="text-sm text-gray-600">
                              {response.age} • {response.gender}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedResponse(response)}
                            className="text-xs px-3 py-1"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                        </div>

                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-500 mb-1">Upload Willingness</div>
                            <Badge 
                              variant={response.imageUploadWillingness === 'yes-upload' ? 'default' : 'secondary'} 
                              className="text-xs"
                            >
                              {response.imageUploadWillingness === 'yes-upload' ? 'Yes' : 'No'}
                            </Badge>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-500 mb-1">Shopping Preference</div>
                            <div className="text-xs font-medium capitalize">
                              {response.shoppingPreference?.replace('-', ' ') || 'N/A'}
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-500 mb-1">Clothes Fit</div>
                            <Badge 
                              variant={
                                response.clothesFit === 'Very well' ? 'default' :
                                response.clothesFit === 'Somewhat well' ? 'secondary' : 'destructive'
                              } 
                              className="text-xs"
                            >
                              {response.clothesFit || 'N/A'}
                            </Badge>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-500 mb-1">Purchase Confidence</div>
                            <Badge 
                              variant={
                                response.purchaseConfidence === 'very-confident' || response.purchaseConfidence === 'confident' ? 'default' :
                                response.purchaseConfidence === 'neutral' ? 'secondary' : 'destructive'
                              } 
                              className="text-xs"
                            >
                              {response.purchaseConfidence || 'N/A'}
                            </Badge>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-t">
                          <div>Returns: {response.returnsProblem || 'N/A'}</div>
                          <div>
                            Completed: {response.completedAt ? new Date(response.completedAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Fallback Table for Desktop (Hidden on Mobile) */}
              <div className="hidden xl:block">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px] text-xs">ID</TableHead>
                        <TableHead className="text-xs">Age</TableHead>
                        <TableHead className="text-xs">Gender</TableHead>
                        <TableHead className="text-xs">Shopping Pref</TableHead>
                        <TableHead className="text-xs">Upload</TableHead>
                        <TableHead className="text-xs">Return Freq</TableHead>
                        <TableHead className="text-xs">Confidence</TableHead>
                        <TableHead className="text-xs">App Likelihood</TableHead>
                        <TableHead className="text-xs">Completed</TableHead>
                        <TableHead className="w-[50px] text-xs">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {responses.map((response, index) => (
                        <TableRow key={response._id}>
                          <TableCell className="font-medium text-xs">#{index + 1}</TableCell>
                          <TableCell className="text-xs">{response.age}</TableCell>
                          <TableCell className="capitalize text-xs">{response.gender}</TableCell>
                          <TableCell className="text-xs">
                            <Badge variant="outline" className="text-xs">
                              {response.shoppingPreference?.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            <Badge variant={response.imageUploadWillingness === 'yes-upload' ? 'default' : 'secondary'} className="text-xs">
                              {response.imageUploadWillingness === 'yes-upload' ? 'Yes' : 'No'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">{response.returnsProblem}</TableCell>
                          <TableCell className="text-xs">
                            <Badge variant={
                              response.clothesFit === 'Very well' ? 'default' :
                              response.clothesFit === 'Somewhat well' ? 'secondary' : 'destructive'
                            } className="text-xs">
                              {response.clothesFit}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            <Badge variant={
                              response.purchaseConfidence === 'very-confident' || response.purchaseConfidence === 'confident' ? 'default' :
                              response.purchaseConfidence === 'neutral' ? 'secondary' : 'destructive'
                            } className="text-xs">
                              {response.purchaseConfidence}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {response.completedAt ? new Date(response.completedAt).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedResponse(response)}
                              className="h-6 w-6 p-0"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>

      {/* User Details Modal */}
      <Dialog open={!!selectedResponse} onOpenChange={(open) => !open && setSelectedResponse(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-3 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Complete Survey Response</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Detailed view of user submission #{responses?.findIndex(r => r._id === selectedResponse?._id) + 1}
            </DialogDescription>
          </DialogHeader>
          
          {selectedResponse && (
            <div className="space-y-4 sm:space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">Age</label>
                    <p className="text-xs sm:text-sm">{selectedResponse.age || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">Gender</label>
                    <p className="text-xs sm:text-sm capitalize">{selectedResponse.gender || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">Shopping Preference</label>
                    <p className="text-xs sm:text-sm">{selectedResponse.shoppingPreference?.replace('-', ' ') || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">Online Shopping Frequency</label>
                    <p className="text-xs sm:text-sm">{selectedResponse.onlineShoppingFrequency || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Clothing & Fit Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Clothing & Fit Experience</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">How well do clothes fit?</label>
                    <p className="text-xs sm:text-sm">{selectedResponse.clothesFit || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">Returns Problem</label>
                    <p className="text-xs sm:text-sm">{selectedResponse.returnsProblem || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">Most Mis-sized Items</label>
                    <p className="text-xs sm:text-sm">{selectedResponse.misSizedItems || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">Purchase Confidence</label>
                    <p className="text-xs sm:text-sm">{selectedResponse.purchaseConfidence || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Virtual Try-On Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Virtual Try-On Features</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">Body Shape Accuracy Importance</label>
                    <p className="text-xs sm:text-sm">{selectedResponse.tryOnBodyType || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">Skin Tone Accuracy Importance</label>
                    <p className="text-xs sm:text-sm">{selectedResponse.skinToneAccuracy || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">Acceptable Wait Time</label>
                    <p className="text-xs sm:text-sm">{selectedResponse.speedExpectation || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">Expected Usage Frequency</label>
                    <p className="text-xs sm:text-sm">{selectedResponse.tryOnUseFrequency || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy & Trust */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Privacy & Trust</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">Willing to Upload Images</label>
                    <p className="text-xs sm:text-sm">{selectedResponse.imageUploadWillingness || 'Not provided'}</p>
                  </div>
                  
                  {selectedResponse.trustIssues && Array.isArray(selectedResponse.trustIssues) && selectedResponse.trustIssues.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Trust Issues</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedResponse.trustIssues.map((issue: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedResponse.tryOnConcerns && Array.isArray(selectedResponse.tryOnConcerns) && selectedResponse.tryOnConcerns.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Try-On Concerns</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedResponse.tryOnConcerns.map((concern: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {concern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Social Media & Shopping */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Social Media & Shopping</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Social Media for Shopping</label>
                    <p className="text-sm">{selectedResponse.socialMediaShopping || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Confidence After Try-On</label>
                    <p className="text-sm">{selectedResponse.purchaseConfidence || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Submission Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Completed At</label>
                    <p className="text-sm">
                      {selectedResponse.completedAt 
                        ? new Date(selectedResponse.completedAt).toLocaleString() 
                        : 'Not available'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                    <p className="text-xs text-muted-foreground break-all">
                      {selectedResponse.userAgent || 'Not available'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

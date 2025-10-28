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
import { Loader2, Users, ShoppingBag, AlertTriangle, Star, Download, Info } from "lucide-react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Survey Analytics Dashboard</h1>
          <p className="text-muted-foreground">Virtual Try-On Market Research Analysis</p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <div className="text-sm text-muted-foreground">
            Total Responses: <span className="font-semibold">{totalResponses}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="pain-points">Pain Points</TabsTrigger>
          <TabsTrigger value="features">Feature Analysis</TabsTrigger>
          <TabsTrigger value="individual">Individual Results</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upload Willingness</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uploadPercentage.toFixed(1)}%</div>
                <Progress value={uploadPercentage} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {willingToUpload} out of {totalResponses} users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Social Media Shoppers</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalResponses > 0 ? ((socialMediaShoppers / totalResponses) * 100).toFixed(1) : 0}%
                </div>
                <Progress value={totalResponses > 0 ? (socialMediaShoppers / totalResponses) * 100 : 0} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {socialMediaShoppers} users shop via social media
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Purchase Confidence</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalResponses > 0 ? ((highConfidenceAfterTryOn / totalResponses) * 100).toFixed(1) : 0}%
                </div>
                <Progress value={totalResponses > 0 ? (highConfidenceAfterTryOn / totalResponses) * 100 : 0} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Would buy after virtual try-on
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">App Adoption</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalResponses > 0 ? ((likelyToUseApp / totalResponses) * 100).toFixed(1) : 0}%
                </div>
                <Progress value={totalResponses > 0 ? (likelyToUseApp / totalResponses) * 100 : 0} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Likely to use the app
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>High Market Interest:</strong> {uploadPercentage.toFixed(1)}% of users are willing to upload images, indicating strong market acceptance for virtual try-on technology.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Star className="h-4 w-4" />
              <AlertDescription>
                <strong>Business Impact:</strong> {((highConfidenceAfterTryOn / totalResponses) * 100).toFixed(1)}% would be more confident purchasing after virtual try-on, showing clear ROI potential.
              </AlertDescription>
            </Alert>
          </div>

          {/* Quick Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageChartData}>
                      <XAxis dataKey="age" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ gender, percentage }) => `${gender}: ${percentage}%`}
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

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Groups</CardTitle>
                <CardDescription>Distribution of survey respondents by age</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(demographics.ageGroups).map(([age, count]) => (
                    <div key={age} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{age}</span>
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

            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Survey respondents by gender identity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(demographics.genderDistribution).map(([gender, count]) => (
                    <div key={gender} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{gender}</span>
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
              <CardTitle>Individual Survey Responses</CardTitle>
              <CardDescription>
                Detailed view of each survey response - {totalResponses} total responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Shopping Pref</TableHead>
                      <TableHead>Upload Willing</TableHead>
                      <TableHead>Return Freq</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>App Likelihood</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead className="w-[50px]">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response, index) => (
                      <TableRow key={response._id}>
                        <TableCell className="font-medium">#{index + 1}</TableCell>
                        <TableCell>{response.age}</TableCell>
                        <TableCell className="capitalize">{response.gender}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {response.shoppingPreference?.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={response.imageUploadWillingness === 'Yes' ? 'default' : 'secondary'}>
                            {response.imageUploadWillingness}
                          </Badge>
                        </TableCell>
                        <TableCell>{response.returnsProblem}</TableCell>
                        <TableCell>
                          <Badge variant={
                            response.clothesFit === 'Very well' ? 'default' :
                            response.clothesFit === 'Somewhat well' ? 'secondary' : 'destructive'
                          }>
                            {response.clothesFit}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            response.purchaseConfidence === '5' || response.purchaseConfidence === '4' ? 'default' :
                            response.purchaseConfidence === '3' ? 'secondary' : 'destructive'
                          }>
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
                            onClick={() => {
                              setSelectedResponse(response);
                              setIsModalOpen(true);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Survey Response</DialogTitle>
            <DialogDescription>
              Detailed view of user submission #{responses?.findIndex(r => r._id === selectedResponse?._id) + 1}
            </DialogDescription>
          </DialogHeader>
          
          {selectedResponse && (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Age</label>
                    <p className="text-sm">{selectedResponse.age || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gender</label>
                    <p className="text-sm capitalize">{selectedResponse.gender || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Shopping Preference</label>
                    <p className="text-sm">{selectedResponse.shoppingPreference?.replace('-', ' ') || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Online Shopping Frequency</label>
                    <p className="text-sm">{selectedResponse.onlineShoppingFrequency || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Clothing & Fit Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Clothing & Fit Experience</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">How well do clothes fit?</label>
                    <p className="text-sm">{selectedResponse.clothesFit || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Returns Problem</label>
                    <p className="text-sm">{selectedResponse.returnsProblem || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Most Mis-sized Items</label>
                    <p className="text-sm">{selectedResponse.misSizedItems || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Purchase Confidence</label>
                    <p className="text-sm">{selectedResponse.purchaseConfidence || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Virtual Try-On Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Virtual Try-On Features</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Body Shape Accuracy Importance</label>
                    <p className="text-sm">{selectedResponse.tryOnBodyType || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Skin Tone Accuracy Importance</label>
                    <p className="text-sm">{selectedResponse.skinToneAccuracy || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Acceptable Wait Time</label>
                    <p className="text-sm">{selectedResponse.speedExpectation || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Expected Usage Frequency</label>
                    <p className="text-sm">{selectedResponse.tryOnUseFrequency || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy & Trust */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Privacy & Trust</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Willing to Upload Images</label>
                    <p className="text-sm">{selectedResponse.imageUploadWillingness || 'Not provided'}</p>
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

"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppSidebar } from "@/components/app-sidebar";
import { SurveyMetricsCards } from "@/components/survey-metrics-cards";
import { SurveyDataTable } from "@/components/survey-data-table";
import { SurveyCharts } from "@/components/survey-charts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export function ModularAdminDashboard() {
  const responses = useQuery(api.myFunctions.getAllResponses) as SurveyResponse[] | undefined;
  const [selectedResponse, setSelectedResponse] = React.useState<SurveyResponse | null>(null);

  const handleViewDetails = (response: SurveyResponse) => {
    setSelectedResponse(response);
  };

  const handleCloseDialog = () => {
    setSelectedResponse(null);
  };

  if (!responses) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading survey responses...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Survey Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="responses">All Responses</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <SurveyMetricsCards responses={responses} />
                <SurveyCharts responses={responses} />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <SurveyCharts responses={responses} />
              </TabsContent>

              <TabsContent value="responses" className="space-y-4">
                <SurveyDataTable responses={responses} onViewDetails={handleViewDetails} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>

      {/* Response Details Dialog */}
      <Dialog open={!!selectedResponse} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Survey Response Details</DialogTitle>
            <DialogDescription>
              Detailed view of survey response #{selectedResponse?._id.slice(-6)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedResponse && (
            <div className="grid gap-6">
              {/* Demographics */}
              <Card>
                <CardHeader>
                  <CardTitle>Demographics</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Age:</span>
                    <Badge variant="secondary" className="ml-2">
                      {selectedResponse.age || "Not specified"}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Gender:</span>
                    <Badge variant="secondary" className="ml-2">
                      {selectedResponse.gender || "Not specified"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Shopping Behavior */}
              <Card>
                <CardHeader>
                  <CardTitle>Shopping Behavior</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Shopping Preference:</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedResponse.shoppingPreference || "Not specified"}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Online Shopping Frequency:</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedResponse.onlineShoppingFrequency || "Not specified"}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Social Media Shopping:</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedResponse.socialMediaShopping || "Not specified"}
                    </Badge>
                  </div>
                  {selectedResponse.socialMediaPlatforms && selectedResponse.socialMediaPlatforms.length > 0 && (
                    <div>
                      <span className="font-medium">Social Media Platforms:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedResponse.socialMediaPlatforms.map((platform, index) => (
                          <Badge key={index} variant="secondary">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Fit & Returns */}
              <Card>
                <CardHeader>
                  <CardTitle>Fit & Returns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Clothes Fit Confidence:</span>
                    <Badge 
                      variant={selectedResponse.clothesFit === "very-confident" ? "default" : "secondary"} 
                      className="ml-2"
                    >
                      {selectedResponse.clothesFit || "Not specified"}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Returns Problem:</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedResponse.returnsProblem || "Not specified"}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Mis-sized Items:</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedResponse.misSizedItems || "Not specified"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Virtual Try-On */}
              <Card>
                <CardHeader>
                  <CardTitle>Virtual Try-On & AR</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Image Upload Willingness:</span>
                    <Badge 
                      variant={selectedResponse.imageUploadWillingness === "very-willing" ? "default" : "secondary"} 
                      className="ml-2"
                    >
                      {selectedResponse.imageUploadWillingness || "Not specified"}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Virtual Try-On Interest:</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedResponse.virtualTryOn || "Not specified"}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">AR Realism Importance:</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedResponse.arRealism || "Not specified"}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Purchase Confidence:</span>
                    <Badge 
                      variant={selectedResponse.purchaseConfidence === "very-confident" ? "default" : "secondary"} 
                      className="ml-2"
                    >
                      {selectedResponse.purchaseConfidence || "Not specified"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle>Response Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-medium">Completed At:</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {new Date(selectedResponse.completedAt).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Response ID:</span>
                    <span className="ml-2 text-sm font-mono text-muted-foreground">
                      {selectedResponse._id}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
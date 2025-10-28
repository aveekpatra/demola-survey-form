"use client";

import { IconTrendingUp, IconUsers, IconShoppingBag, IconStar, IconAlertTriangle } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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

interface SurveyMetricsCardsProps {
  responses: SurveyResponse[];
}

export function SurveyMetricsCards({ responses }: SurveyMetricsCardsProps) {
  const totalResponses = responses.length;

  // Calculate key metrics
  const willingToUpload = responses.filter(r => r.imageUploadWillingness === "yes-upload").length;
  const uploadPercentage = totalResponses > 0 ? (willingToUpload / totalResponses) * 100 : 0;
  
  const socialMediaShoppers = responses.filter(r => 
    r.socialMediaShopping === "yes-social" || r.socialMediaShopping === "sometimes-social"
  ).length;
  const socialMediaPercentage = totalResponses > 0 ? (socialMediaShoppers / totalResponses) * 100 : 0;
  
  const highConfidenceAfterTryOn = responses.filter(r => 
    r.tryOnFromSocialMedia === "much-more-likely" || r.tryOnFromSocialMedia === "somewhat-more-likely"
  ).length;
  const confidencePercentage = totalResponses > 0 ? (highConfidenceAfterTryOn / totalResponses) * 100 : 0;
  
  const likelyToUseApp = responses.filter(r => 
    r.purchaseConfidence === "very-confident" || r.purchaseConfidence === "confident"
  ).length;
  const appAdoptionPercentage = totalResponses > 0 ? (likelyToUseApp / totalResponses) * 100 : 0;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Upload Willingness</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {uploadPercentage.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-blue-600">
              <IconUsers className="size-3" />
              {willingToUpload}/{totalResponses}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            High market acceptance <IconTrendingUp className="size-4 text-green-600" />
          </div>
          <div className="text-muted-foreground">
            Users willing to upload photos for virtual try-on
          </div>
          <Progress value={uploadPercentage} className="w-full h-2" />
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Social Media Shoppers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {socialMediaPercentage.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600">
              <IconShoppingBag className="size-3" />
              {socialMediaShoppers} users
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Active social commerce <IconTrendingUp className="size-4 text-green-600" />
          </div>
          <div className="text-muted-foreground">
            Users who shop via social media platforms
          </div>
          <Progress value={socialMediaPercentage} className="w-full h-2" />
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Purchase Confidence</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {confidencePercentage.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-purple-600">
              <IconStar className="size-3" />
              {highConfidenceAfterTryOn} users
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Increased buying intent <IconTrendingUp className="size-4 text-green-600" />
          </div>
          <div className="text-muted-foreground">
            Would buy after virtual try-on experience
          </div>
          <Progress value={confidencePercentage} className="w-full h-2" />
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>App Adoption Potential</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {appAdoptionPercentage.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-orange-600">
              <IconAlertTriangle className="size-3" />
              {likelyToUseApp} users
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong adoption signal <IconTrendingUp className="size-4 text-green-600" />
          </div>
          <div className="text-muted-foreground">
            Likely to use the virtual try-on app
          </div>
          <Progress value={appAdoptionPercentage} className="w-full h-2" />
        </CardFooter>
      </Card>
    </div>
  );
}
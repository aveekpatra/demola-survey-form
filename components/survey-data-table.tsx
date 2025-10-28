"use client";

import * as React from "react";
import { IconEye } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

interface SurveyDataTableProps {
  responses: SurveyResponse[];
  onViewDetails: (response: SurveyResponse) => void;
}

export function SurveyDataTable({ responses, onViewDetails }: SurveyDataTableProps) {
  const getBadgeVariant = (value: string | undefined) => {
    if (!value) return "secondary";
    
    const positiveValues = ["very-confident", "very-willing", "very-interested", "extremely-important"];
    const negativeValues = ["not-confident", "not-willing", "not-interested", "not-important"];
    
    if (positiveValues.includes(value)) return "default";
    if (negativeValues.includes(value)) return "destructive";
    return "secondary";
  };

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Survey Responses</CardTitle>
          <CardDescription>
            All survey responses with key metrics and details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Shopping Pref</TableHead>
                  <TableHead>Upload Willing</TableHead>
                  <TableHead>Fit Confidence</TableHead>
                  <TableHead>Purchase Confidence</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((response, index) => (
                  <TableRow key={response._id}>
                    <TableCell className="font-medium">
                      #{String(index + 1).padStart(3, '0')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {response.age || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {response.gender || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {response.shoppingPreference?.replace("-", " ") || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(response.imageUploadWillingness)}>
                        {response.imageUploadWillingness?.replace("-", " ") || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(response.clothesFit)}>
                        {response.clothesFit?.replace("-", " ") || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(response.purchaseConfidence)}>
                        {response.purchaseConfidence?.replace("-", " ") || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(response.completedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(response)}
                      >
                        <IconEye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
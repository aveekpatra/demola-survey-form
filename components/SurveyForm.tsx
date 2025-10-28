"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  RadioGroup,
  RadioGroupItem,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Progress,
} from "@/components/ui";
import { toast } from "sonner";

const surveySchema = z.object({
  // Phase 1: Demographics & Shopping Behavior
  gender: z.string().optional(),
  age: z.string().min(1, "Please select your age group"),
  shoppingPreference: z.string().min(1, "Please select your shopping preference"),
  onlineShoppingFrequency: z.string().min(1, "Please select your shopping frequency"),

  // Phase 2: Online Shopping Pain Points & Social Media Discovery
  findClothes: z.string().optional(),
  frustrations: z.array(z.string()).optional(),
  clothesFit: z.string().optional(),
  misSizedItems: z.string().optional(),
  colorMatchingUncertainty: z.string().optional(),
  returnsProblem: z.string().optional(),
  returnReason: z.string().optional(),
  socialMediaShopping: z.string().optional(),
  socialMediaBrands: z.array(z.string()).optional(),
  trustIssues: z.array(z.string()).optional(),

  // Phase 3: Virtual Try-On & AI Trust
  virtualTryOn: z.string().optional(),
  virtualTryOnSpecify: z.string().optional(),
  aiTrustLevel: z.string().optional(),
  aiTrustReason: z.string().optional(),
  arRealism: z.string().optional(),
  waitingTime: z.string().optional(),
  bodyDiversityRepresentation: z.string().optional(), // How well did AR represent your body type/skin tone?
  purchaseConfidence: z.string().optional(),
  imageUploadWillingness: z.string().optional(), // Would you upload any image to try on?
  tryOnFromSocialMedia: z.string().optional(), // Would you try on clothes found on social media?
  speedExpectation: z.string().optional(), // What's acceptable wait time?
  skinToneAccuracy: z.string().optional(), // Important: skin tone matching
});

type SurveyFormValues = z.infer<typeof surveySchema>;

export default function SurveyForm() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const totalPhases = 3;

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    mode: "onChange",
  });

  const onSubmit = async (data: SurveyFormValues) => {
    try {
      console.log("Survey submitted:", data);
      toast.success("Survey submitted successfully!");
      form.reset();
      setCurrentPhase(1);
    } catch {
      toast.error("Failed to submit survey");
    }
  };

  const nextPhase = async () => {
    if (currentPhase < totalPhases) {
      setCurrentPhase(currentPhase + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevPhase = () => {
    if (currentPhase > 1) {
      setCurrentPhase(currentPhase - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const progressValue = (currentPhase / totalPhases) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#4169E1] dark:text-[#6495ED] mb-2">
            Virtual Clothing Simulator
          </h1>
          <p className="text-slate-600 dark:text-slate-300 font-light">
            Help us understand your shopping experience
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8 border-slate-200 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Phase {currentPhase} of {totalPhases}
              </span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {Math.round(progressValue)}%
              </span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </CardContent>
        </Card>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Phase 1: Demographics & Shopping Behavior */}
            {currentPhase === 1 && (
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-[#4169E1] dark:text-[#6495ED]">About You & Your Shopping Style</CardTitle>
                  <CardDescription>
                    Help us understand your background and how you discover clothes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Age */}
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          What is your age group?
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your age group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="under-18">Under 18</SelectItem>
                            <SelectItem value="18-24">18–24</SelectItem>
                            <SelectItem value="25-34">25–34</SelectItem>
                            <SelectItem value="35-44">35–44</SelectItem>
                            <SelectItem value="45-54">45–54</SelectItem>
                            <SelectItem value="55-64">55–64</SelectItem>
                            <SelectItem value="65-over">65 and over</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Gender (optional but useful for body diversity insights) */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          How do you identify? (Optional)
                        </FormLabel>
                        <FormDescription>
                          This helps us understand diversity in our user base
                        </FormDescription>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="male" id="male" />
                              <FormLabel
                                htmlFor="male"
                                className="font-normal cursor-pointer"
                              >
                                Male
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="female" id="female" />
                              <FormLabel
                                htmlFor="female"
                                className="font-normal cursor-pointer"
                              >
                                Female
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="non-binary" id="non-binary" />
                              <FormLabel
                                htmlFor="non-binary"
                                className="font-normal cursor-pointer"
                              >
                                Non-binary
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="prefer-not-to-say"
                                id="prefer-not"
                              />
                              <FormLabel
                                htmlFor="prefer-not"
                                className="font-normal cursor-pointer"
                              >
                                Prefer not to say
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Shopping Preference */}
                  <FormField
                    control={form.control}
                    name="shoppingPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          How do you prefer to shop for clothes?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="mostly-online" id="mostly-online" />
                              <FormLabel
                                htmlFor="mostly-online"
                                className="font-normal cursor-pointer"
                              >
                                Mostly online
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="mostly-in-store" id="mostly-in-store" />
                              <FormLabel
                                htmlFor="mostly-in-store"
                                className="font-normal cursor-pointer"
                              >
                                Mostly in-store
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="equal" id="equal" />
                              <FormLabel
                                htmlFor="equal"
                                className="font-normal cursor-pointer"
                              >
                                Equally online and in-store
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Online Shopping Frequency */}
                  <FormField
                    control={form.control}
                    name="onlineShoppingFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          How often do you shop for clothes online?
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Multiple times a week</SelectItem>
                            <SelectItem value="2-3-weekly">
                              2–3 times a week
                            </SelectItem>
                            <SelectItem value="once-week">
                              About once a week
                            </SelectItem>
                            <SelectItem value="2-3-monthly">
                              2–3 times a month
                            </SelectItem>
                            <SelectItem value="monthly">
                              Once a month
                            </SelectItem>
                            <SelectItem value="few-times-year">
                              Few times a year
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Phase 2: Online Shopping Experience & Social Media Discovery */}
            {currentPhase === 2 && (
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-[#4169E1] dark:text-[#6495ED]">Where & How You Find Clothes</CardTitle>
                  <CardDescription>
                    Tell us about your online shopping habits and where you discover clothes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Where do you discover clothes */}
                  <FormField
                    control={form.control}
                    name="findClothes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Where do you typically discover clothes to buy?
                        </FormLabel>
                        <FormDescription>
                          Select the most common sources
                        </FormDescription>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="brand-retail" id="brand-retail" />
                              <FormLabel
                                htmlFor="brand-retail"
                                className="font-normal cursor-pointer"
                              >
                                Brand/retailer websites (Zara, H&M, etc.)
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="social-media" id="social-media" />
                              <FormLabel
                                htmlFor="social-media"
                                className="font-normal cursor-pointer"
                              >
                                Social media (Instagram, TikTok, Pinterest)
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="indie-indie" id="indie-indie" />
                              <FormLabel
                                htmlFor="indie-indie"
                                className="font-normal cursor-pointer"
                              >
                                Independent/indie brands & emerging designers
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="marketplace" id="marketplace" />
                              <FormLabel
                                htmlFor="marketplace"
                                className="font-normal cursor-pointer"
                              >
                                Marketplace platforms (Amazon, Etsy, etc.)
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="mixed" id="mixed" />
                              <FormLabel
                                htmlFor="mixed"
                                className="font-normal cursor-pointer"
                              >
                                Mix of all the above
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Social Media Shopping - Branching */}
                  <FormField
                    control={form.control}
                    name="socialMediaShopping"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Do you buy clothes that you see on social media?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes-social" id="yes-social" />
                              <FormLabel
                                htmlFor="yes-social"
                                className="font-normal cursor-pointer"
                              >
                                Yes, regularly
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="sometimes-social" id="sometimes-social" />
                              <FormLabel
                                htmlFor="sometimes-social"
                                className="font-normal cursor-pointer"
                              >
                                Yes, but occasionally
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no-social" id="no-social" />
                              <FormLabel
                                htmlFor="no-social"
                                className="font-normal cursor-pointer"
                              >
                                No
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Branching: If yes to social media, which platforms? */}
                  {(form.watch("socialMediaShopping") === "yes-social" || form.watch("socialMediaShopping") === "sometimes-social") && (
                    <FormField
                      control={form.control}
                      name="socialMediaBrands"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">
                            Which platforms do you find clothes on?
                          </FormLabel>
                          <FormDescription>
                            Select all that apply
                          </FormDescription>
                          <div className="space-y-3 mt-3">
                            {[
                              { id: "instagram", label: "Instagram" },
                              { id: "tiktok", label: "TikTok" },
                              { id: "pinterest", label: "Pinterest" },
                              { id: "youtube", label: "YouTube" },
                              { id: "facebook", label: "Facebook" },
                              { id: "twitch", label: "Twitch" },
                              { id: "other-social", label: "Other platforms" },
                            ].map((item) => (
                              <div key={item.id} className="flex items-center">
                                <Checkbox
                                  id={item.id}
                                  checked={field.value?.includes(item.id) || false}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || [];
                                    if (checked) {
                                      field.onChange([...current, item.id]);
                                    } else {
                                      field.onChange(
                                        current.filter((v) => v !== item.id)
                                      );
                                    }
                                  }}
                                />
                                <FormLabel
                                  htmlFor={item.id}
                                  className="ml-2 font-normal cursor-pointer"
                                >
                                  {item.label}
                                </FormLabel>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Fit Confidence */}
                  <FormField
                    control={form.control}
                    name="clothesFit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          When you shop online, how confident are you that items will fit?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="very-confident-fit" id="very-confident-fit" />
                              <FormLabel
                                htmlFor="very-confident-fit"
                                className="font-normal cursor-pointer"
                              >
                                Very confident — items usually fit right
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="somewhat-confident-fit" id="somewhat-confident-fit" />
                              <FormLabel
                                htmlFor="somewhat-confident-fit"
                                className="font-normal cursor-pointer"
                              >
                                Somewhat confident — hit or miss
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="not-confident-fit" id="not-confident-fit" />
                              <FormLabel
                                htmlFor="not-confident-fit"
                                className="font-normal cursor-pointer"
                              >
                                Not confident — often mis-fit
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Returns Problem */}
                  <FormField
                    control={form.control}
                    name="returnsProblem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          How often do you return or exchange items due to poor fit or color mismatch?
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="very-often">Very often (more than 50% of orders)</SelectItem>
                            <SelectItem value="often">Often (25–50% of orders)</SelectItem>
                            <SelectItem value="sometimes">Sometimes (10–25% of orders)</SelectItem>
                            <SelectItem value="rarely">Rarely (less than 10%)</SelectItem>
                            <SelectItem value="never">Never — items fit great</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Mis-sized Items - branching */}
                  {(form.watch("returnsProblem") === "very-often" || form.watch("returnsProblem") === "often" || form.watch("returnsProblem") === "sometimes") && (
                    <FormField
                      control={form.control}
                      name="misSizedItems"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">
                            Which item types are most often the problem?
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select item type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="jeans">Jeans/Trousers</SelectItem>
                              <SelectItem value="shirts">Shirts/Tops</SelectItem>
                              <SelectItem value="jackets">Jackets/Coats</SelectItem>
                              <SelectItem value="dresses">Dresses</SelectItem>
                              <SelectItem value="skirts">Skirts</SelectItem>
                              <SelectItem value="multiple">Multiple types equally</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Branching: Trust issues with indie/non-traditional retailers */}
                  {(form.watch("findClothes") === "indie-indie" || form.watch("findClothes") === "social-media" || form.watch("findClothes") === "mixed") && (
                    <FormField
                      control={form.control}
                      name="trustIssues"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">
                            When buying from indie brands or social media, what concerns you most?
                          </FormLabel>
                          <FormDescription>
                            Select all that apply
                          </FormDescription>
                          <div className="space-y-3 mt-3">
                            {[
                              { id: "quality", label: "Quality might not match photos" },
                              { id: "fit-unknown", label: "Unknown sizing standards" },
                              { id: "color-diff", label: "Color might look different in person" },
                              { id: "no-returns", label: "Difficult or impossible returns" },
                              { id: "scam", label: "Fear of scams or fraud" },
                            ].map((item) => (
                              <div key={item.id} className="flex items-center">
                                <Checkbox
                                  id={item.id}
                                  checked={field.value?.includes(item.id) || false}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || [];
                                    if (checked) {
                                      field.onChange([...current, item.id]);
                                    } else {
                                      field.onChange(
                                        current.filter((v) => v !== item.id)
                                      );
                                    }
                                  }}
                                />
                                <FormLabel
                                  htmlFor={item.id}
                                  className="ml-2 font-normal cursor-pointer"
                                >
                                  {item.label}
                                </FormLabel>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Color Matching Uncertainty */}
                  <FormField
                    control={form.control}
                    name="colorMatchingUncertainty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          How often does the color in product photos not match what arrives?
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="almost-always">Almost always &mdash; very different</SelectItem>
                            <SelectItem value="often">Often &mdash; noticeably different</SelectItem>
                            <SelectItem value="occasionally">Occasionally &mdash; slightly off</SelectItem>
                            <SelectItem value="rarely">Rarely &mdash; usually matches</SelectItem>
                            <SelectItem value="never">Never &mdash; always matches photos</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Phase 3: Virtual Try-On & Our MVP Solution */}
            {currentPhase === 3 && (
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-[#4169E1] dark:text-[#6495ED]">Your Ideal Try-On Experience</CardTitle>
                  <CardDescription>
                    Tell us what would help you shop with confidence
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Image Upload Willingness - MVP Critical */}
                  <FormField
                    control={form.control}
                    name="imageUploadWillingness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Would you upload any clothing image (from social media, website, or anywhere) to try it on your own body virtually?
                        </FormLabel>
                        <FormDescription>
                          This is the core idea of our app
                        </FormDescription>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes-upload" id="yes-upload" />
                              <FormLabel
                                htmlFor="yes-upload"
                                className="font-normal cursor-pointer"
                              >
                                Yes, absolutely &mdash; sounds really helpful!
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="maybe-upload" id="maybe-upload" />
                          <FormLabel
                                htmlFor="maybe-upload"
                                className="font-normal cursor-pointer"
                              >
                                Maybe &mdash; depends on how accurate it&apos;s
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no-upload" id="no-upload" />
                              <FormLabel
                                htmlFor="no-upload"
                                className="font-normal cursor-pointer"
                              >
                                No &mdash; I prefer traditional shopping
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Branching: Try-On from Social Media */}
                  {(form.watch("imageUploadWillingness") === "yes-upload" || form.watch("imageUploadWillingness") === "maybe-upload") && (
                    <FormField
                      control={form.control}
                      name="tryOnFromSocialMedia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">
                            How likely are you to buy an item you found on social media if you could try it on first?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-3"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="much-more-likely" id="much-more-likely" />
                                <FormLabel
                                  htmlFor="much-more-likely"
                                  className="font-normal cursor-pointer"
                                >
                                  Much more likely &mdash; I&apos;d buy way more
                                </FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="somewhat-more-likely" id="somewhat-more-likely" />
                                <FormLabel
                                  htmlFor="somewhat-more-likely"
                                  className="font-normal cursor-pointer"
                                >
                                  Somewhat more likely
                                </FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no-difference" id="no-difference" />
                                <FormLabel
                                  htmlFor="no-difference"
                                  className="font-normal cursor-pointer"
                                >
                                  No difference to my buying habits
                                </FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Speed Expectations - MVP Critical */}
                  <FormField
                    control={form.control}
                    name="speedExpectation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          What&apos;s an acceptable wait time to see a try-on result after uploading an image?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="instant" id="instant" />
                              <FormLabel
                                htmlFor="instant"
                                className="font-normal cursor-pointer"
                              >
                                Instant (less than 5 seconds)
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="quick" id="quick" />
                              <FormLabel
                                htmlFor="quick"
                                className="font-normal cursor-pointer"
                              >
                                Quick (5–30 seconds)
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="moderate" id="moderate" />
                              <FormLabel
                                htmlFor="moderate"
                                className="font-normal cursor-pointer"
                              >
                                Moderate (30–60 seconds)
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="patient" id="patient" />
                              <FormLabel
                                htmlFor="patient"
                                className="font-normal cursor-pointer"
                              >
                                I can wait (1–2 minutes)
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Skin Tone Accuracy - MVP Critical for diverse users */}
                  <FormField
                    control={form.control}
                    name="skinToneAccuracy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          How important is it that the try-on accurately shows how clothes look on your skin tone?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="critical" id="critical" />
                              <FormLabel
                                htmlFor="critical"
                                className="font-normal cursor-pointer"
                              >
                                Critical &mdash; dealbreaker if not accurate
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="important" id="important" />
                              <FormLabel
                                htmlFor="important"
                                className="font-normal cursor-pointer"
                              >
                                Important, but I&apos;d still use it if not perfect
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="nice-to-have" id="nice-to-have" />
                              <FormLabel
                                htmlFor="nice-to-have"
                                className="font-normal cursor-pointer"
                              >
                                Nice to have, but not essential
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Have you used AR try-on tools before */}
                  <FormField
                    control={form.control}
                    name="virtualTryOn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Have you ever used AR or virtual try-on tools from brands or apps?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="yes-tryon" />
                              <FormLabel
                                htmlFor="yes-tryon"
                                className="font-normal cursor-pointer"
                              >
                                Yes
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="no-tryon" />
                              <FormLabel
                                htmlFor="no-tryon"
                                className="font-normal cursor-pointer"
                              >
                                No
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Branching: If yes, AR Realism feedback */}
                  {form.watch("virtualTryOn") === "yes" && (
                    <FormField
                      control={form.control}
                      name="arRealism"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">
                            How realistic and accurate were those try-on results?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-3"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="matched-well" id="matched" />
                                <FormLabel
                                  htmlFor="matched"
                                  className="font-normal cursor-pointer"
                                >
                                  Very realistic and accurate
                                </FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="close" id="close" />
                                <FormLabel
                                  htmlFor="close"
                                  className="font-normal cursor-pointer"
                                >
                                  Somewhat realistic but not perfect
                                </FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="not-accurate" id="not-accurate" />
                                <FormLabel
                                  htmlFor="not-accurate"
                                  className="font-normal cursor-pointer"
                                >
                                  Not realistic or helpful
                                </FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Final: Overall likelihood to use */}
                  <FormField
                    control={form.control}
                    name="purchaseConfidence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          How likely are you to actually use an app like this if it existed?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="very-confident"
                                id="very-confident"
                              />
                              <FormLabel
                                htmlFor="very-confident"
                                className="font-normal cursor-pointer"
                              >
                                Very likely &mdash; I would use it regularly
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="somewhat-confident"
                                id="somewhat-confident"
                              />
                              <FormLabel
                                htmlFor="somewhat-confident"
                                className="font-normal cursor-pointer"
                              >
                                Somewhat likely &mdash; would try it
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="not-confident"
                                id="not-confident"
                              />
                              <FormLabel
                                htmlFor="not-confident"
                                className="font-normal cursor-pointer"
                              >
                                Unlikely &mdash; not for me
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Permission to contact for user testing */}
                  <div className="p-4 bg-[#4169E1]/10 dark:bg-[#6495ED]/20 rounded-lg border border-[#4169E1]/30 dark:border-[#6495ED]/40">
                    <p className="text-sm text-[#4169E1] dark:text-[#6495ED] font-medium">
                      ✓ Thank you for your feedback! This helps us build better solutions. We may reach out for user testing in the future.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevPhase}
                disabled={currentPhase === 1}
                className="flex-1"
              >
                Previous
              </Button>

              {currentPhase < totalPhases ? (
                <Button
                  type="button"
                  onClick={nextPhase}
                  className="flex-1 bg-[#4169E1] hover:bg-[#315AC1] text-white font-semibold"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 bg-[#4169E1] hover:bg-[#315AC1] text-white font-semibold"
                >
                  Submit Survey
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

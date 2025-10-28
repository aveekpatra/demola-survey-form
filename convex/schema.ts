import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  surveyResponses: defineTable({
    // Phase 1
    age: v.optional(v.string()),
    gender: v.optional(v.string()),
    shoppingPreference: v.optional(v.string()),
    onlineShoppingFrequency: v.optional(v.string()),

    // Phase 2
    findClothes: v.optional(v.string()),
    socialMediaShopping: v.optional(v.string()),
    socialMediaPlatforms: v.optional(v.array(v.string())),
    clothesFit: v.optional(v.string()),
    returnsProblem: v.optional(v.string()),
    misSizedItems: v.optional(v.string()),
    trustIssues: v.optional(v.array(v.string())),
    colorMatchingUncertainty: v.optional(v.string()),

    // Phase 3
    imageUploadWillingness: v.optional(v.string()),
    tryOnFromSocialMedia: v.optional(v.string()),
    tryOnUseFrequency: v.optional(v.string()),
    tryOnBodyType: v.optional(v.string()),
    tryOnConcerns: v.optional(v.array(v.string())),
    speedExpectation: v.optional(v.string()),
    skinToneAccuracy: v.optional(v.string()),
    virtualTryOn: v.optional(v.string()),
    arRealism: v.optional(v.string()),
    purchaseConfidence: v.optional(v.string()),

    // Metadata
    completedAt: v.number(),
    userAgent: v.optional(v.string()),
  }),
  numbers: defineTable({
    value: v.number(),
  }),
});

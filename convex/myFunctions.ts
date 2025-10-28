import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

// Save survey response to the database
export const saveSurveyResponse = mutation({
  args: {
    age: v.optional(v.string()),
    gender: v.optional(v.string()),
    shoppingPreference: v.optional(v.string()),
    onlineShoppingFrequency: v.optional(v.string()),
    findClothes: v.optional(v.string()),
    socialMediaShopping: v.optional(v.string()),
    socialMediaPlatforms: v.optional(v.array(v.string())),
    clothesFit: v.optional(v.string()),
    returnsProblem: v.optional(v.string()),
    misSizedItems: v.optional(v.string()),
    trustIssues: v.optional(v.array(v.string())),
    colorMatchingUncertainty: v.optional(v.string()),
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
    userAgent: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const id = await ctx.db.insert("surveyResponses", {
      ...args,
      completedAt: Date.now(),
    });

    console.log("Survey response saved with id:", id);
    return { success: true, id };
  },
});

// Fetch all survey responses (for analytics)
export const getAllResponses = query({
  handler: async (ctx) => {
    return await ctx.db.query("surveyResponses").collect();
  },
});

// Legacy functions (kept for compatibility)
export const listNumbers = query({
  args: {
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const numbers = await ctx.db
      .query("numbers")
      .order("desc")
      .take(args.count);
    return {
      viewer: (await ctx.auth.getUserIdentity())?.name ?? null,
      numbers: numbers.reverse().map((number) => number.value),
    };
  },
});

export const addNumber = mutation({
  args: {
    value: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("numbers", { value: args.value });
    console.log("Added new document with id:", id);
  },
});

export const myAction = action({
  args: {
    first: v.number(),
    second: v.string(),
  },
  handler: async (ctx, args) => {
    const data = await ctx.runQuery(api.myFunctions.listNumbers, {
      count: 10,
    });
    console.log(data);

    await ctx.runMutation(api.myFunctions.addNumber, {
      value: args.first,
    });
  },
});

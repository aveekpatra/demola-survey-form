export interface Question {
  id: string;
  question: string;
  description?: string;
  type: "radio" | "checkbox" | "select";
  options: Option[];
  required?: boolean;
  condition?: (answers: Record<string, string | string[]>) => boolean;
}

export interface Option {
  id: string;
  label: string;
  value: string;
}

export const surveyQuestions: Question[] = [
  // Phase 1: Demographics & Shopping Behavior
  {
    id: "age",
    question: "What is your age group?",
    type: "select",
    required: true,
    options: [
      { id: "under-18", label: "Under 18", value: "under-18" },
      { id: "18-24", label: "18–24", value: "18-24" },
      { id: "25-34", label: "25–34", value: "25-34" },
      { id: "35-44", label: "35–44", value: "35-44" },
      { id: "45-54", label: "45–54", value: "45-54" },
      { id: "55-64", label: "55–64", value: "55-64" },
      { id: "65-over", label: "65 and over", value: "65-over" },
    ],
  },
  {
    id: "gender",
    question: "How do you identify? (Optional)",
    description: "This helps us understand diversity in our user base",
    type: "radio",
    options: [
      { id: "male", label: "Male", value: "male" },
      { id: "female", label: "Female", value: "female" },
      { id: "non-binary", label: "Non-binary", value: "non-binary" },
      { id: "prefer-not", label: "Prefer not to say", value: "prefer-not-to-say" },
    ],
  },
  {
    id: "shoppingPreference",
    question: "How do you prefer to shop for clothes?",
    type: "radio",
    required: true,
    options: [
      { id: "mostly-online", label: "Mostly online", value: "mostly-online" },
      { id: "mostly-in-store", label: "Mostly in-store", value: "mostly-in-store" },
      { id: "equal", label: "Equally online and in-store", value: "equal" },
    ],
  },
  {
    id: "onlineShoppingFrequency",
    question: "How often do you shop for clothes online?",
    type: "select",
    required: true,
    options: [
      { id: "daily", label: "Multiple times a week", value: "daily" },
      { id: "2-3-weekly", label: "2–3 times a week", value: "2-3-weekly" },
      { id: "once-week", label: "About once a week", value: "once-week" },
      { id: "2-3-monthly", label: "2–3 times a month", value: "2-3-monthly" },
      { id: "monthly", label: "Once a month", value: "monthly" },
      { id: "few-times-year", label: "Few times a year", value: "few-times-year" },
    ],
  },

  // Phase 2: Online Shopping Experience & Social Media Discovery
  {
    id: "findClothes",
    question: "Where do you typically discover clothes to buy?",
    description: "Select the most common sources",
    type: "radio",
    required: true,
    options: [
      { id: "brand-retail", label: "Brand/retailer websites (Zara, H&M, etc.)", value: "brand-retail" },
      { id: "social-media", label: "Social media (Instagram, TikTok, Pinterest)", value: "social-media" },
      { id: "indie-indie", label: "Independent/indie brands & emerging designers", value: "indie-indie" },
      { id: "marketplace", label: "Marketplace platforms (Amazon, Etsy, etc.)", value: "marketplace" },
      { id: "mixed", label: "Mix of all the above", value: "mixed" },
    ],
  },
  {
    id: "socialMediaShopping",
    question: "Do you buy clothes that you see on social media?",
    type: "radio",
    required: true,
    options: [
      { id: "yes-social", label: "Yes, regularly", value: "yes-social" },
      { id: "sometimes-social", label: "Yes, but occasionally", value: "sometimes-social" },
      { id: "no-social", label: "No", value: "no-social" },
    ],
  },
  {
    id: "socialMediaPlatforms",
    question: "Which platforms do you find clothes on?",
    description: "Select all that apply",
    type: "checkbox",
    condition: (answers) =>
      answers.socialMediaShopping === "yes-social" || answers.socialMediaShopping === "sometimes-social",
    options: [
      { id: "instagram", label: "Instagram", value: "instagram" },
      { id: "tiktok", label: "TikTok", value: "tiktok" },
      { id: "pinterest", label: "Pinterest", value: "pinterest" },
      { id: "youtube", label: "YouTube", value: "youtube" },
      { id: "facebook", label: "Facebook", value: "facebook" },
      { id: "twitch", label: "Twitch", value: "twitch" },
      { id: "other-social", label: "Other platforms", value: "other-social" },
    ],
  },
  {
    id: "clothesFit",
    question: "When you shop online, how confident are you that items will fit?",
    type: "radio",
    required: true,
    options: [
      { id: "very-confident", label: "Very confident — items usually fit right", value: "very-confident-fit" },
      { id: "somewhat-confident", label: "Somewhat confident — hit or miss", value: "somewhat-confident-fit" },
      { id: "not-confident", label: "Not confident — often mis-fit", value: "not-confident-fit" },
    ],
  },
  {
    id: "returnsProblem",
    question: "How often do you return or exchange items due to poor fit or color mismatch?",
    type: "select",
    required: true,
    options: [
      { id: "very-often", label: "Very often (more than 50% of orders)", value: "very-often" },
      { id: "often", label: "Often (25–50% of orders)", value: "often" },
      { id: "sometimes", label: "Sometimes (10–25% of orders)", value: "sometimes" },
      { id: "rarely", label: "Rarely (less than 10%)", value: "rarely" },
      { id: "never", label: "Never — items fit great", value: "never" },
    ],
  },
  {
    id: "misSizedItems",
    question: "Which item types are most often the problem?",
    type: "select",
    condition: (answers) =>
      answers.returnsProblem === "very-often" ||
      answers.returnsProblem === "often" ||
      answers.returnsProblem === "sometimes",
    options: [
      { id: "jeans", label: "Jeans/Trousers", value: "jeans" },
      { id: "shirts", label: "Shirts/Tops", value: "shirts" },
      { id: "jackets", label: "Jackets/Coats", value: "jackets" },
      { id: "dresses", label: "Dresses", value: "dresses" },
      { id: "skirts", label: "Skirts", value: "skirts" },
      { id: "multiple", label: "Multiple types equally", value: "multiple" },
    ],
  },
  {
    id: "trustIssues",
    question: "When buying from indie brands or social media, what concerns you most?",
    description: "Select all that apply",
    type: "checkbox",
    condition: (answers) =>
      answers.findClothes === "indie-indie" ||
      answers.findClothes === "social-media" ||
      answers.findClothes === "mixed",
    options: [
      { id: "quality", label: "Quality might not match photos", value: "quality" },
      { id: "fit-unknown", label: "Unknown sizing standards", value: "fit-unknown" },
      { id: "color-diff", label: "Color might look different in person", value: "color-diff" },
      { id: "no-returns", label: "Difficult or impossible returns", value: "no-returns" },
      { id: "scam", label: "Fear of scams or fraud", value: "scam" },
    ],
  },
  {
    id: "colorMatchingUncertainty",
    question: "How often does the color in product photos not match what arrives?",
    type: "select",
    required: true,
    options: [
      { id: "almost-always", label: "Almost always — very different", value: "almost-always" },
      { id: "often", label: "Often — noticeably different", value: "often" },
      { id: "occasionally", label: "Occasionally — slightly off", value: "occasionally" },
      { id: "rarely", label: "Rarely — usually matches", value: "rarely" },
      { id: "never", label: "Never — always matches photos", value: "never" },
    ],
  },

  // Phase 3: Virtual Try-On & MVP Solution
  {
    id: "imageUploadWillingness",
    question: "Would you upload any clothing image (from social media, website, or anywhere) to try it on your own body virtually?",
    description: "This is the core idea of our app",
    type: "radio",
    required: true,
    options: [
      { id: "yes-upload", label: "Yes, absolutely — sounds really helpful!", value: "yes-upload" },
      { id: "maybe-upload", label: "Maybe — depends on how accurate it is", value: "maybe-upload" },
      { id: "no-upload", label: "No — I prefer traditional shopping", value: "no-upload" },
    ],
  },
  {
    id: "tryOnFromSocialMedia",
    question: "How likely are you to buy an item you found on social media if you could try it on first?",
    type: "radio",
    condition: (answers) =>
      answers.imageUploadWillingness === "yes-upload" || answers.imageUploadWillingness === "maybe-upload",
    options: [
      { id: "much-more", label: "Much more likely — I'd buy way more", value: "much-more-likely" },
      { id: "somewhat-more", label: "Somewhat more likely", value: "somewhat-more-likely" },
      { id: "no-difference", label: "No difference to my buying habits", value: "no-difference" },
    ],
  },
  {
    id: "tryOnUseFrequency",
    question: "How often would you use a virtual try-on tool if it were available?",
    type: "radio",
    condition: (answers) => answers.imageUploadWillingness === "yes-upload",
    options: [
      { id: "every-purchase", label: "For every online purchase", value: "every-purchase" },
      { id: "most-purchases", label: "For most online purchases", value: "most-purchases" },
      { id: "occasional", label: "Occasionally for uncertain items", value: "occasional" },
      { id: "rarely", label: "Rarely — just for fun sometimes", value: "rarely" },
    ],
  },
  {
    id: "tryOnBodyType",
    question: "How important is it that the try-on accurately represents your body shape and size?",
    type: "radio",
    condition: (answers) => answers.imageUploadWillingness === "yes-upload",
    options: [
      { id: "critical-body", label: "Critical — I need to see how it fits my body", value: "critical-body" },
      { id: "important-body", label: "Important, but general fit is enough", value: "important-body" },
      { id: "nice-body", label: "Nice to have, but not necessary", value: "nice-body" },
    ],
  },
  {
    id: "tryOnConcerns",
    question: "What concerns you most about uploading personal photos for virtual try-ons?",
    description: "Select all that apply",
    type: "checkbox",
    condition: (answers) => answers.imageUploadWillingness === "yes-upload",
    options: [
      { id: "privacy", label: "Privacy — where are my photos stored?", value: "privacy" },
      { id: "accuracy", label: "Accuracy — will the fit prediction be correct?", value: "accuracy" },
      { id: "embarrassment", label: "Embarrassment — showing my body online", value: "embarrassment" },
      { id: "data-misuse", label: "Data misuse — could my photos be used elsewhere?", value: "data-misuse" },
      { id: "none", label: "No major concerns", value: "none" },
    ],
  },
  {
    id: "speedExpectation",
    question: "What's an acceptable wait time to see a try-on result after uploading an image?",
    type: "radio",
    required: true,
    options: [
      { id: "instant", label: "Instant (less than 5 seconds)", value: "instant" },
      { id: "quick", label: "Quick (5–30 seconds)", value: "quick" },
      { id: "moderate", label: "Moderate (30–60 seconds)", value: "moderate" },
      { id: "patient", label: "I can wait (1–2 minutes)", value: "patient" },
    ],
  },
  {
    id: "skinToneAccuracy",
    question: "How important is it that the try-on accurately shows how clothes look on your skin tone?",
    type: "radio",
    required: true,
    options: [
      { id: "critical", label: "Critical — dealbreaker if not accurate", value: "critical" },
      { id: "important", label: "Important, but I'd still use it if not perfect", value: "important" },
      { id: "nice-to-have", label: "Nice to have, but not essential", value: "nice-to-have" },
    ],
  },
  {
    id: "virtualTryOn",
    question: "Have you ever used AR or virtual try-on tools from brands or apps?",
    type: "radio",
    required: true,
    options: [
      { id: "yes", label: "Yes", value: "yes" },
      { id: "no", label: "No", value: "no" },
    ],
  },
  {
    id: "arRealism",
    question: "How realistic and accurate were those try-on results?",
    type: "radio",
    condition: (answers) => answers.virtualTryOn === "yes",
    options: [
      { id: "very-realistic", label: "Very realistic and accurate", value: "matched-well" },
      { id: "somewhat-realistic", label: "Somewhat realistic but not perfect", value: "close" },
      { id: "not-realistic", label: "Not realistic or helpful", value: "not-accurate" },
    ],
  },
  {
    id: "purchaseConfidence",
    question: "How likely are you to actually use an app like this if it existed?",
    type: "radio",
    required: true,
    options: [
      { id: "very-likely", label: "Very likely — I would use it regularly", value: "very-confident" },
      { id: "somewhat-likely", label: "Somewhat likely — would try it", value: "somewhat-confident" },
      { id: "unlikely", label: "Unlikely — not for me", value: "not-confident" },
    ],
  },
];

export const getVisibleQuestions = (answers: Record<string, string | string[]>): Question[] => {
  return surveyQuestions.filter((question) => {
    if (!question.condition) return true;
    return question.condition(answers);
  });
};

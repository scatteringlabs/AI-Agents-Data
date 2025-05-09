import * as z from "zod";

// Define fileSchema to handle files only in the browser environment
const fileSchema = typeof window !== "undefined" ? z.instanceof(File) : z.any();

const urlPattern = /^(https?:\/\/)?([a-zA-Z\d-]+(\.[a-zA-Z\d-]+)+)(\/.*)?$/;
const twitterPattern = /^https:\/\/x\.com\//;
const telegramPattern = /^https:\/\/t\.me\//;

export const schema = z.object({
  collection_name: z.string().nonempty("Collection Name is required"),
  token_symbol: z.string().nonempty("Token Symbol is required"),
  nft_quantity: z
    .number()
    .min(1, "NFT Quantity must be at least 1")
    .max(1000000000, "NFT Quantity cannot exceed 1 billion"),
  description: z.string().min(1, "Description is required"),
  collection_story: z.string().optional(),
  nft_info: z.string().optional(),
  chain_id: z.string().optional(),
  existing_nft_media: z.string().optional(),
  socialMediaLink: z.string().optional(),
  initial_buy: z.string().optional(),

  x: z
    .string()
    .optional()
    .refine((val) => !val || twitterPattern.test(val), {
      message: "Twitter URL must start with https://x.com/",
    }),

  telegram: z
    .string()
    .optional()
    .refine((val) => !val || telegramPattern.test(val), {
      message: "Telegram URL must start with https://t.me/",
    }),

  website: z
    .string()
    .optional()
    .refine((val) => !val || urlPattern.test(val), {
      message: "Please enter a valid URL",
    }),

  // Use fileSchema to handle files
  nft_media: z.array(fileSchema).optional(),
  pre_reveal: fileSchema.optional(),
  collection_logo: fileSchema.optional(),
  banner: fileSchema.optional(),
});

"use server";

import { auth } from "@clerk/nextjs/server";
import { getGeminiClient } from "./gemini";

interface GenerateDescriptionInput {
	name: string;
	category: string;
	manufacturer?: string;
	model?: string;
	serialNumber?: string;
}

export async function generateDescription(
	input: GenerateDescriptionInput,
): Promise<string> {
	const { userId } = await auth();
	if (!userId) throw new Error("Unauthorized");

	const { name, category, manufacturer, model, serialNumber } = input;

	const prompt = `You are an IT asset management expert. Write a concise, professional technical description (2-4 sentences, under 100 words) for the following asset to be used in an inventory system.

Asset Details:
- Name: ${name}
- Category: ${category}
- Manufacturer: ${manufacturer ?? "Unknown"}
- Model: ${model ?? "Unknown"}
- Serial Number: ${serialNumber ?? "N/A"}

The description should cover: what the asset is and its primary function, key technical characteristics, and typical use case in a business environment. Output only the description text, no labels or prefixes.`;

	const ai = getGeminiClient();
	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: prompt,
		});
		return response.text?.trim() ?? "";
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		console.error("[Gemini] generateDescription error:", msg);
		if (
			msg.includes("429") ||
			msg.includes("RESOURCE_EXHAUSTED") ||
			msg.includes("quota") ||
			msg.includes("rate limit")
		) {
			throw new Error(
				"Gemini API quota exceeded. Please try again later or upgrade your plan.",
			);
		}
		if (
			msg.includes("API key") ||
			msg.includes("API_KEY") ||
			msg.includes("401") ||
			msg.includes("403")
		) {
			throw new Error(
				"Gemini API key is invalid or missing. Check your GEMINI_API_KEY in .env.local.",
			);
		}
		if (
			msg.includes("404") ||
			msg.includes("NOT_FOUND") ||
			msg.includes("no longer available")
		) {
			throw new Error(
				"Gemini model unavailable. The API key may not have access to this model.",
			);
		}
		throw new Error(`AI generation failed: ${msg}`);
	}
}

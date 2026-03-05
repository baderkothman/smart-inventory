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
	const response = await ai.models.generateContent({
		model: "gemini-2.0-flash",
		contents: prompt,
	});

	return response.text?.trim() ?? "";
}

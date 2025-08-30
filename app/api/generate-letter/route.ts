import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.",
        },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        },
      )
    }

    const { celebrantName, guestName, relationship, tone, giftItems, personalMessage, letterStyle } =
      await request.json()

    if (!celebrantName || !guestName) {
      return NextResponse.json(
        {
          error: "Celebrant name and guest name are required",
        },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        },
      )
    }

    const stylePrompts = {
      formal: "Write in a formal, elegant style with proper etiquette and sophisticated language.",
      casual: "Write in a warm, casual, and friendly conversational style.",
      heartfelt: "Write in a deeply emotional and heartfelt style that conveys genuine care and affection.",
      humorous: "Write in a light-hearted, playful style with gentle humor and wit.",
      poetic: "Write in a beautiful, poetic style with elegant metaphors and flowing language.",
    }

    const relationshipContext = {
      friend: "as a dear friend",
      family: "as a beloved family member",
      colleague: "as a valued colleague",
      partner: "as a loving partner",
      other: "as someone special",
    }

    const giftDescription =
      giftItems && giftItems.length > 0
        ? `I've chosen ${giftItems.map((item: any) => item.title).join(" and ")} for you`
        : "I've selected a special gift for you"

    const prompt = `Write a personalized birthday letter for ${celebrantName} from ${guestName}. 

Context:
- Relationship: ${guestName} knows ${celebrantName} ${relationshipContext[relationship as keyof typeof relationshipContext] || "as someone special"}
- Writing style: ${stylePrompts[letterStyle as keyof typeof stylePrompts] || stylePrompts.heartfelt}
- Tone: ${tone}
- Gift context: ${giftDescription}
${personalMessage ? `- Personal note to include: "${personalMessage}"` : ""}

Requirements:
- Write a complete birthday letter (not just a card message)
- Include warm birthday wishes and celebration of their special day
- Mention the gift naturally within the letter
- Make it feel personal and genuine
- Length: 150-250 words
- Format as a proper letter with greeting and closing
- ${letterStyle === "poetic" ? "Include some beautiful imagery or metaphors" : ""}
- ${tone === "humorous" ? "Include some gentle, appropriate humor" : ""}
- End with a warm closing appropriate to the relationship

Do not include placeholder text or brackets. Write a complete, ready-to-print letter.`

    const { text } = await generateText({
      model: openai("gpt-4o", {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      prompt,
      temperature: 0.7,
    })

    return NextResponse.json(
      {
        success: true,
        letter: text.trim(),
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  } catch (error) {
    console.error("Letter generation error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      {
        error: `Failed to generate letter: ${errorMessage}`,
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

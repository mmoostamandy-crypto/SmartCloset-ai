import "dotenv/config";
import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ===============================
// GROQ
// ===============================

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ===============================
// TEST
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SmartCloset Groq AI Server is running.",
  });
});

// ===============================
// AI OUTFIT
// ===============================

app.post("/api/ai-outfit", async (req, res) => {
  try {
    const {
      clothes,
      weather,
      temperature,
      occasion,
      style,
      color,
      userRequest,
      previousOutfit,
    } = req.body;

    if (!Array.isArray(clothes) || clothes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your closet is empty.",
      });
    }

    // -------------------------------
    // CLOSET
    // -------------------------------

    const closet = clothes
      .map(
        (item) =>
          `ID: ${item.id}
Name: ${item.name || "Unknown"}
Category: ${item.category || "Unknown"}
Color: ${item.color || "Unknown"}`
      )
      .join("\n\n");

    // -------------------------------
    // PREVIOUS OUTFIT
    // -------------------------------

    let previous = "No previous outfit.";

    if (previousOutfit) {
      previous = `
Previous outfit:
Top: ${previousOutfit.top?.name || "None"}
Bottom: ${previousOutfit.bottom?.name || "None"}
Shoes: ${previousOutfit.shoes?.name || "None"}
Outerwear: ${previousOutfit.outerwear?.name || "None"}
`;
    }

    // -------------------------------
    // PROMPT
    // -------------------------------

    const prompt = `
You are SmartCloset AI, a professional fashion stylist.

Create the best outfit using ONLY clothes from the user's closet.

CLOSET:
${closet}

WEATHER:
${weather || "Unknown"}

TEMPERATURE:
${temperature || 24}°C

OCCASION:
${occasion || "Everyday"}

STYLE:
${style || "Any"}

COLOR:
${color || "Any"}

USER REQUEST:
${userRequest || "Create a stylish outfit."}

${previous}

IMPORTANT:

- Use ONLY the provided clothing IDs.
- Never invent an item.
- Select one top.
- Select one bottom.
- Select one shoes.
- Select outerwear only if needed.
- Consider weather.
- Consider temperature.
- Consider occasion.
- Consider style.
- Consider color.
- If the user's choice is not good for the occasion, say so.
- Give a better recommendation.
- Explain what should be changed.
- Give styling tips.
- Give suggested colors.
- Generate a different outfit when there is a previous outfit.
- Return ONLY JSON.

Use exactly this JSON structure:

{
  "title": "Outfit title",
  "description": "Short description",
  "isSuitable": true,
  "suitabilityReason": "Explain why this outfit is or is not suitable.",
  "recommendation": "Tell the user what you recommend.",
  "suggestedColors": ["Black", "White"],
  "stylingTips": [
    "Styling tip 1",
    "Styling tip 2",
    "Styling tip 3"
  ],
  "missingItems": [],
  "outfit": {
    "topId": "ID",
    "bottomId": "ID",
    "shoesId": "ID",
    "outerwearId": null
  },
  "imagePrompt": "Detailed realistic fashion image description."
}
`;

    // -------------------------------
    // GROQ REQUEST
    // -------------------------------

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content:
            "You are a professional fashion stylist. Return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.8,

      max_completion_tokens: 1200,
    });

    // -------------------------------
    // AI RESPONSE
    // -------------------------------

    const text =
      completion.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({
        success: false,
        message: "Groq returned an empty response.",
      });
    }

    console.log("GROQ RESPONSE:");
    console.log(text);

    // -------------------------------
    // CLEAN JSON
    // -------------------------------

    let clean = text.trim();

    if (clean.startsWith("```")) {
      clean = clean
        .replace(/^```json/i, "")
        .replace(/^```/i, "")
        .replace(/```$/i, "")
        .trim();
    }

    // -------------------------------
    // PARSE
    // -------------------------------

    let result;

    try {
      result = JSON.parse(clean);
    } catch (error) {
      console.error("JSON ERROR:");
      console.error(clean);

      return res.status(500).json({
        success: false,
        message: "Groq returned invalid JSON.",
      });
    }

    // -------------------------------
    // VALIDATE IDS
    // -------------------------------

    const validIds = clothes.map((item) =>
      String(item.id)
    );

    const outfit = result.outfit || {};

    const ids = [
      outfit.topId,
      outfit.bottomId,
      outfit.shoesId,
      outfit.outerwearId,
    ];

    for (const id of ids) {
      if (
        id !== null &&
        id !== undefined &&
        !validIds.includes(String(id))
      ) {
        return res.status(500).json({
          success: false,
          message:
            "AI selected an item that does not exist in your closet.",
        });
      }
    }

    // -------------------------------
    // FINAL RESULT
    // -------------------------------

    const finalResult = {
      title:
        result.title || "Your AI Outfit",

      description:
        result.description ||
        "A personalized outfit created by SmartCloset AI.",

      isSuitable:
        result.isSuitable !== false,

      suitabilityReason:
        result.suitabilityReason || "",

      recommendation:
        result.recommendation || "",

      suggestedColors:
        Array.isArray(result.suggestedColors)
          ? result.suggestedColors
          : [],

      stylingTips:
        Array.isArray(result.stylingTips)
          ? result.stylingTips
          : [],

      missingItems:
        Array.isArray(result.missingItems)
          ? result.missingItems
          : [],

      outfit: {
        topId: outfit.topId,
        bottomId: outfit.bottomId,
        shoesId: outfit.shoesId,
        outerwearId:
          outfit.outerwearId ?? null,
      },

      imagePrompt:
        result.imagePrompt || "",
    };

    // -------------------------------
    // SUCCESS
    // -------------------------------

    res.json({
      success: true,
      data: finalResult,
    });
  } catch (error) {
    console.error("GROQ ERROR:");
    console.error(error);

    if (error?.status === 401) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid Groq API key.",
      });
    }

    if (error?.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "Groq rate limit reached. Try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Something went wrong with Groq.",
    });
  }
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log("");
  console.log("========================================");
  console.log(" SmartCloset Groq AI Server");
  console.log("========================================");
  console.log(` Server: http://localhost:${PORT}`);
  console.log(" AI Endpoint: POST /api/ai-outfit");
  console.log("========================================");
});
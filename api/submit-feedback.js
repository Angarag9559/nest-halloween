const { saveFeedback } = require("../lib/surveyService");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, rating } = req.body;

    if (!text || !rating) {
      return res.status(400).json({ error: "Missing text or rating" });
    }

    const newFeedback = {
      text,
      rating,
      createdAt: new Date().toISOString(),
    };

    const saved = await saveFeedback(newFeedback);
    res.status(200).json({ message: "Feedback saved!", feedback: saved });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Failed to save feedback" });
  }
};

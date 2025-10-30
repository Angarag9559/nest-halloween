const { getFeedbacks } = require("../lib/surveyService");

module.exports = async (req, res) => {
  try {
    const feedbacks = await getFeedbacks();
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to load feedbacks" });
  }
};
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = process.env.GITHUB_USER;
const repo = process.env.GITHUB_REPO;
const filePath = "feedbacks.json";

// Fetch all feedbacks from GitHub
async function getFeedbacks() {
  try {
    const { data: fileData } = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
    });
    const feedbacks = JSON.parse(Buffer.from(fileData.content, "base64").toString());
    return Array.isArray(feedbacks) ? feedbacks : [];
  } catch (err) {
    console.error("Error fetching feedbacks:", err.message);
    return [];
  }
}

// Save a new feedback to GitHub
async function saveFeedback(newFeedback) {
  const fetchFile = async () => {
    const { data: fileData } = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
    });
    const feedbacks = JSON.parse(Buffer.from(fileData.content, "base64").toString() || "[]");
    return { feedbacks: Array.isArray(feedbacks) ? feedbacks : [], sha: fileData.sha };
  };

  try {
    let { feedbacks, sha } = await fetchFile();
    feedbacks.push(newFeedback);

    const content = Buffer.from(JSON.stringify(feedbacks, null, 2)).toString("base64");

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: "Add new feedback",
      content,
      sha,
    });

    return newFeedback;
  } catch (err) {
    console.error("Error saving feedback:", err.message);
    throw err;
  }
}

module.exports = { getFeedbacks, saveFeedback };
import api from "./api";

export const generateQuizApi = async ({ topic, difficulty }) => {
  try {
    const response = await api.post("/quiz/generate", { topic, difficulty });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to generate quiz.";
    throw new Error(message);
  }
};

export const submitQuizApi = async ({ topic, difficulty, timeTakenSeconds, answers }) => {
  try {
    const response = await api.post("/quiz/submit", { topic, difficulty, timeTakenSeconds, answers });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to submit quiz.";
    throw new Error(message);
  }
};

export const getQuizHistoryApi = async () => {
  try {
    const response = await api.get("/quiz/history");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to load quiz history.";
    throw new Error(message);
  }
};

export const getQuizStatsApi = async () => {
  try {
    const response = await api.get("/quiz/stats");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to load quiz stats.";
    throw new Error(message);
  }
};

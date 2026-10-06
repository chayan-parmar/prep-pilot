import api from "./api";

export const analyzeResumeApi = async (formData) => {
  try {
    const response = await api.post("/resume/analyze", formData);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      (typeof error.response?.data === "string" && !error.response.data.includes("<html")
        ? error.response.data
        : "") ||
      error.message ||
      "Failed to analyze resume.";
    throw new Error(message, { cause: error });
  }
};

export const getResumeHistoryApi = async () => {
  try {
    const response = await api.get("/resume/history");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to load resume history.";
    throw new Error(message, { cause: error });
  }
};

export const getResumeAnalysisApi = async (analysisId) => {
  try {
    const response = await api.get(`/resume/${analysisId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to load resume analysis.";
    throw new Error(message, { cause: error });
  }
};

export const deleteResumeAnalysisApi = async (analysisId) => {
  try {
    const response = await api.delete(`/resume/${analysisId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete resume analysis.";
    throw new Error(message, { cause: error });
  }
};

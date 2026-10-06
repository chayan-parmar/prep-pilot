import api from "./api";

export const getDashboardStatsApi = async () => {
  try {
    const response = await api.get("/dashboard/stats");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to load dashboard stats.";
    throw new Error(message);
  }
};

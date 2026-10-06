import api from "./api";

export const generateRoadmapApi = async ({ category, skillLevel, targetGoal }) => {
  try {
    const response = await api.post("/roadmap/generate", { category, skillLevel, targetGoal });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to generate roadmap.";
    throw new Error(message);
  }
};

export const getRoadmapsApi = async () => {
  try {
    const response = await api.get("/roadmap");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to load roadmaps.";
    throw new Error(message);
  }
};

export const getRoadmapByIdApi = async (id) => {
  try {
    const response = await api.get(`/roadmap/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to load roadmap.";
    throw new Error(message);
  }
};

export const toggleMilestoneApi = async (roadmapId, milestoneId) => {
  try {
    const response = await api.patch(`/roadmap/${roadmapId}/milestone/${milestoneId}/toggle`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update milestone.";
    throw new Error(message);
  }
};

export const deleteRoadmapApi = async (id) => {
  try {
    const response = await api.delete(`/roadmap/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete roadmap.";
    throw new Error(message);
  }
};

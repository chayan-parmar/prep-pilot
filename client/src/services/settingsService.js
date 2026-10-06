import api from "./api";

export const getProfileApi = async () => {
  try {
    const response = await api.get("/settings/profile");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to load profile.";
    throw new Error(message);
  }
};

export const updateProfileApi = async ({ name, targetRole }) => {
  try {
    const response = await api.put("/settings/profile", { name, targetRole });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update profile.";
    throw new Error(message);
  }
};

export const changePasswordApi = async ({ currentPassword, newPassword }) => {
  try {
    const response = await api.put("/settings/password", { currentPassword, newPassword });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to change password.";
    throw new Error(message);
  }
};

export const deleteAccountApi = async (password) => {
  try {
    const response = await api.delete("/settings/account", { data: { password } });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete account.";
    throw new Error(message);
  }
};

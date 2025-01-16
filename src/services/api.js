const API_URL = "http://localhost:5000/api";

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Example API call in your ApplicationForm.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] instanceof File) {
        submitData.append(key, formData[key]);
      } else {
        submitData.append(key, formData[key]);
      }
    });

    const response = await fetch(`${API_URL}/applications`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
      body: submitData,
    });

    if (!response.ok) throw new Error("Submission failed");

    // Handle success...
  } catch (error) {
    // Handle error...
  }
};

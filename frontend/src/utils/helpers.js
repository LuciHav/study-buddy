export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const formatMonth = (month) => {
  if (!month) return "";
  const [year, monthNum] = month.split("-");
  const date = new Date(year, parseInt(monthNum) - 1, 1);
  return date.toLocaleString("default", { month: "short" });
};

export const formatCurrency = (amount) => {
  if (!amount) return "Pending";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NPR",
  }).format(amount);
};

export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "approved":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "requested":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

export const prepareFormData = (values, arrayFields = [], fileFields = []) => {
  const formData = new FormData();

  // Process each field in the values object
  for (const key in values) {
    if (key === "subject") {
      if (Array.isArray(values[key]) && values[key].length > 0) {
        values[key].forEach((item) => {
          formData.append(key, item);
        });

        // If there's only one subject, also append "other" to ensure it's an array
        if (values[key].length === 1) {
          formData.append(key, "other");
        }
      }
    } else if (key === "experience") {
      if (Array.isArray(values[key]) && values[key].length > 0) {
        values[key].forEach((item) => {
          formData.append(key, item);
        });

        // If there's only one experience, also append "other" to ensure it's an array
        if (values[key].length === 1) {
          formData.append(key, "other");
        }
      }
    }

    // Handle other array fields
    else if (
      arrayFields.includes(key) &&
      key !== "subject" &&
      key !== "experience"
    ) {
      if (Array.isArray(values[key]) && values[key].length > 0) {
        values[key].forEach((item) => {
          formData.append(key, item);
        });
      }
    }

    // Handle file fields
    else if (fileFields.includes(key)) {
      if (
        values[key] &&
        values[key] instanceof FileList &&
        values[key].length > 0
      ) {
        formData.append(key, values[key][0]);
      }
    }

    // Handle all other fields
    else if (values[key] !== undefined && values[key] !== null) {
      formData.append(key, values[key]);
    }
  }

  return formData;
};

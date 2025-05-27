export const formatCurrency = (amount) => {
  if (typeof amount !== "number") return amount;
  // Sử dụng try-catch để phòng trường hợp amount không hợp lệ cho toLocaleString
  try {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  } catch (error) {
    console.error("Error formatting currency:", error, "Amount:", amount);
    return `${amount} VND`; // Trả về dạng dự phòng
  }
};

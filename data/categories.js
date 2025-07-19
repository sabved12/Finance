// Emeralds for Income, Violets for Expense
export const defaultCategories = [
  // ===== Income (Emerald family) =====
  {
    id: "salary",
    name: "Salary",
    type: "INCOME",
    color: "#14532d", // emerald-900 (darkest)
    icon: "Wallet",
  },
  {
    id: "freelance",
    name: "Freelance",
    type: "INCOME",
    color: "#166534", // emerald-800
    icon: "Laptop",
  },
  {
    id: "investments",
    name: "Investments",
    type: "INCOME",
    color: "#22c55e", // emerald-500
    icon: "TrendingUp",
  },
  {
    id: "business",
    name: "Business",
    type: "INCOME",
    color: "#34d399", // emerald-400 (brightest)
    icon: "Building",
  },
  {
    id: "rental",
    name: "Rental",
    type: "INCOME",
    color: "#10b981", // emerald-600
    icon: "Home",
  },
  {
    id: "other-income",
    name: "Other Income",
    type: "INCOME",
    color: "#059669", // emerald-700
    icon: "Plus",
  },

  // ===== Expense (Violet family) =====
  {
    id: "housing",
    name: "Housing",
    type: "EXPENSE",
    color: "#3b0764", // violet-950 (darkest)
    icon: "Home",
    subcategories: ["Rent", "Mortgage", "Property Tax", "Maintenance"],
  },
  {
    id: "transportation",
    name: "Transportation",
    type: "EXPENSE",
    color: "#5b21b6", // violet-800
    icon: "Car",
    subcategories: ["Fuel", "Public Transport", "Maintenance", "Parking"],
  },
  {
    id: "groceries",
    name: "Groceries",
    type: "EXPENSE",
    color: "#7c3aed", // violet-600
    icon: "Shopping",
  },
  {
    id: "utilities",
    name: "Utilities",
    type: "EXPENSE",
    color: "#a78bfa", // violet-400 (brightest)
    icon: "Zap",
    subcategories: ["Electricity", "Water", "Gas", "Internet", "Phone"],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    type: "EXPENSE",
    color: "#8b5cf6", // violet-500
    icon: "Film",
    subcategories: ["Movies", "Games", "Streaming Services"],
  },
  {
    id: "food",
    name: "Food",
    type: "EXPENSE",
    color: "#6d28d9", // violet-700
    icon: "UtensilsCrossed",
  },
  {
    id: "shopping",
    name: "Shopping",
    type: "EXPENSE",
    color: "#c4b5fd", // violet-300
    icon: "ShoppingBag",
    subcategories: ["Clothing", "Electronics", "Home Goods"],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    type: "EXPENSE",
    color: "#d6bbfb", // violet-200
    icon: "HeartPulse",
    subcategories: ["Medical", "Dental", "Pharmacy", "Insurance"],
  },
  {
    id: "education",
    name: "Education",
    type: "EXPENSE",
    color: "#ede9fe", // violet-100 (lightest)
    icon: "GraduationCap",
    subcategories: ["Tuition", "Books", "Courses"],
  },
  {
    id: "personal",
    name: "Personal Care",
    type: "EXPENSE",
    color: "#a78bfa", // violet-400
    icon: "Smile",
    subcategories: ["Haircut", "Gym", "Beauty"],
  },
  {
    id: "travel",
    name: "Travel",
    type: "EXPENSE",
    color: "#5b21b6", // violet-800
    icon: "Plane",
  },
  {
    id: "insurance",
    name: "Insurance",
    type: "EXPENSE",
    color: "#6d28d9", // violet-700
    icon: "Shield",
    subcategories: ["Life", "Home", "Vehicle"],
  },
  {
    id: "gifts",
    name: "Gifts & Donations",
    type: "EXPENSE",
    color: "#7c3aed", // violet-600
    icon: "Gift",
  },
  {
    id: "bills",
    name: "Bills & Fees",
    type: "EXPENSE",
    color: "#a78bfa", // violet-400
    icon: "Receipt",
    subcategories: ["Bank Fees", "Late Fees", "Service Charges"],
  },
  {
    id: "other-expense",
    name: "Other Expenses",
    type: "EXPENSE",
    color: "#5b21b6", // violet-800
    icon: "MoreHorizontal",
  },
];

// For quick color lookup by category id
export const categoryColors = defaultCategories.reduce((acc, category) => {
  acc[category.id] = category.color;
  return acc;
}, {});

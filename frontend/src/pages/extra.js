function detectCategory(text) {
  const lowerText = text.toLowerCase();

  const categoryKeywords = {
    Food: ["restaurant", "hotel", "food", "meal", "cafe"],
    Transport: ["uber", "ola", "taxi", "flight"],
    Shopping: ["amazon", "flipkart", "purchase", "mall"],
    Utilities: ["electricity", "internet", "water", "gas"],
    Health: ["hospital", "pharmacy", "clinic"],
    Education: ["school", "course", "college"],
    Entertainment: ["movie", "pvr", "event"],
    Rent: ["rent", "lease"]
  };

  for (let [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(k => lowerText.includes(k))) {
      return category;
    }
  }

  return "Other"; // fallback
}

const [formData, setFormData] = useState({
  name: "",
  title: "",
  expenseAmount: "",
  category: "",
  paymentMode: "",
  GSTNumber: "",
  BillNumber: "",
});

// On receiving parsed data from backend
const handleOCRResponse = (data) => {
  setFormData(prev => ({ ...prev, ...data }));
};

<input
  type="text"
  value={formData.name}
  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
/>

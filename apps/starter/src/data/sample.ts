// Sample data only. In a real project this comes from the client's API.
export interface Order { id: string; date: string; customer: string; phone: string; product: string; more?: string; delivery: string; city: string; items: number; amount: number; status: "Processing" | "Wholesale" | "Shipped" | "Delivered" | "Cancelled" }
export const orders: Order[] = [
  { id: "#AK1043", date: "21 Oct, 10:42", customer: "Karthik R.", phone: "98•• •• 4410", product: "Premium Korean Style Men's Shirt · L", more: "+1 more", delivery: "Home delivery", city: "Dindigul", items: 2, amount: 1000, status: "Processing" },
  { id: "#AK1042", date: "21 Oct, 09:15", customer: "Sri Balaji Textiles", phone: "Wholesale", product: "Shirt & Vesti Combo · mixed sizes", delivery: "Courier", city: "Dindigul", items: 120, amount: 54000, status: "Wholesale" },
  { id: "#AK1041", date: "20 Oct, 19:03", customer: "Vignesh M.", phone: "97•• •• 2218", product: "Black Cargo Performance Pants · 32", delivery: "Home delivery", city: "Trichy", items: 1, amount: 700, status: "Shipped" },
  { id: "#AK1040", date: "20 Oct, 16:27", customer: "Pradeep K.", phone: "90•• •• 7731", product: "Men's Slim Fit Track Pant (3pcs) · M", more: "+2 more", delivery: "Home delivery", city: "Madurai", items: 3, amount: 1649, status: "Delivered" },
  { id: "#AK1039", date: "20 Oct, 12:50", customer: "Manoj S.", phone: "88•• •• 0193", product: "Men's Sports Shorts (3pcs combo) · L", delivery: "Store pickup", city: "Trichy store", items: 1, amount: 499, status: "Delivered" },
];
export const sales = [
  { label: "Wed", value: 90 }, { label: "Thu", value: 96 }, { label: "Fri", value: 126 }, { label: "Sat", value: 176 },
  { label: "Sun", value: 188 }, { label: "Mon", value: 107 }, { label: "Tue", value: 135 },
];
export const categories = [
  { label: "Shirt & Vesti", value: 38 }, { label: "Shirts", value: 27 }, { label: "Jeans", value: 16 }, { label: "T-Shirts", value: 11 }, { label: "Track Pants", value: 8 },
];
export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
export const recent = [
  { id: "#AK1043", customer: "Karthik R.", items: 2, amount: 1198, payment: "UPI" },
  { id: "#AK1042", customer: "Sri Balaji Textiles", items: 120, amount: 54000, payment: "Bank" },
  { id: "#AK1041", customer: "Vignesh M.", items: 1, amount: 700, payment: "COD" },
  { id: "#AK1040", customer: "Pradeep K.", items: 3, amount: 1647, payment: "Card" },
  { id: "#AK1039", customer: "Manoj S.", items: 1, amount: 499, payment: "UPI" },
];

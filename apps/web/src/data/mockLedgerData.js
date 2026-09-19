// Single Source of Truth for Store Accounting, Live Invoices, Google Sheet & CSV Exports
// Athees Café, 100ft Road, Indiranagar, Bangalore
// Total Revenue: ₹58,450 across 54 Invoices (UPI: ₹48,200 | Card: ₹6,800 | Cash: ₹3,450)

export const MOCK_LEDGER_ROWS = [
  // Evening Rush (4:00 PM - 6:00 PM) - 15 Invoices
  { id: 'INV-2026-054', time: 'Today, 05:52 PM', customer: 'Rishi Sharma', amount: 1250, mode: 'Paytm UPI QR', gst: 62.50, status: 'SUCCESS', items: '2x Pour Over (Attikan) + Basque Cheesecake + Sourdough Boule' },
  { id: 'INV-2026-053', time: 'Today, 05:44 PM', customer: 'Sneha Kulkarni', amount: 540, mode: 'UPI Soundbox', gst: 27.00, status: 'SUCCESS', items: 'Hazelnut Latte + Cinnamon Swirl Roll' },
  { id: 'INV-2026-052', time: 'Today, 05:38 PM', customer: 'Arjun Reddy', amount: 890, mode: 'Paytm UPI QR', gst: 44.50, status: 'SUCCESS', items: '2x Iced Americano + Truffle Cheese Toastie' },
  { id: 'INV-2026-051', time: 'Today, 05:31 PM', customer: 'Pooja Gupta', amount: 1450, mode: 'Card POS', gst: 72.50, status: 'SUCCESS', items: 'Pour Over Flight + 2x Avocado Toast + Brownie' },
  { id: 'INV-2026-050', time: 'Today, 05:25 PM', customer: 'Vikram Singh', amount: 650, mode: 'Paytm UPI QR', gst: 32.50, status: 'SUCCESS', items: 'Spanish Iced Latte + Almond Biscotti' },
  { id: 'INV-2026-049', time: 'Today, 05:18 PM', customer: 'Maya Krishnamurthy', amount: 420, mode: 'UPI Soundbox', gst: 21.00, status: 'SUCCESS', items: 'Single Origin Pour Over + Blueberry Muffin' },
  { id: 'INV-2026-048', time: 'Today, 05:12 PM', customer: 'Neil Fernandes', amount: 780, mode: 'Paytm UPI QR', gst: 39.00, status: 'SUCCESS', items: '2x Classic Cold Brew + Cinnamon Roll' },
  { id: 'INV-2026-047', time: 'Today, 05:05 PM', customer: 'Rajesh Kumar', amount: 340, mode: 'Cash Counter', gst: 17.00, status: 'SUCCESS', items: 'Flat White + Butter Croissant' },
  { id: 'INV-2026-046', time: 'Today, 04:58 PM', customer: 'Aman Verma', amount: 260, mode: 'UPI Soundbox', gst: 13.00, status: 'SUCCESS', items: 'Hazelnut Barista Latte' },
  { id: 'INV-2026-045', time: 'Today, 04:50 PM', customer: 'Preeti Mahajan', amount: 1120, mode: 'Paytm UPI QR', gst: 56.00, status: 'SUCCESS', items: '2x Cold Brew Float + Avocado Toastie' },
  { id: 'INV-2026-044', time: 'Today, 04:42 PM', customer: 'Kabir Singhania', amount: 690, mode: 'Paytm UPI QR', gst: 34.50, status: 'SUCCESS', items: '2x Flat White + Banana Walnut Loaf' },
  { id: 'INV-2026-043', time: 'Today, 04:35 PM', customer: 'Ashwin Balaji', amount: 1850, mode: 'Card POS', gst: 92.50, status: 'SUCCESS', items: 'Tasting Flight + Truffle Toastie + 2x Cold Brew' },
  { id: 'INV-2026-042', time: 'Today, 04:26 PM', customer: 'Dhruv Mathur', amount: 950, mode: 'Paytm UPI QR', gst: 47.50, status: 'SUCCESS', items: 'Specialty Cold Brew Growler (1L)' },
  { id: 'INV-2026-041', time: 'Today, 04:18 PM', customer: 'Smita Kumble', amount: 580, mode: 'Paytm UPI QR', gst: 29.00, status: 'SUCCESS', items: '2x Mango Matcha Cooler + Almond Biscotti' },
  { id: 'INV-2026-040', time: 'Today, 04:05 PM', customer: 'Vikramaditya Rao', amount: 640, mode: 'UPI Soundbox', gst: 32.00, status: 'SUCCESS', items: 'Rosemary Sea Salt Sourdough Loaf + Cortado' },

  // Afternoon Slot (1:00 PM - 4:00 PM) - 15 Invoices
  { id: 'INV-2026-039', time: 'Today, 03:52 PM', customer: 'Ananya Rao', amount: 820, mode: 'Paytm UPI QR', gst: 41.00, status: 'SUCCESS', items: 'Iced Spanish Latte + Belgian Brownie' },
  { id: 'INV-2026-038', time: 'Today, 03:40 PM', customer: 'Aditya Nair', amount: 1350, mode: 'Paytm UPI QR', gst: 67.50, status: 'SUCCESS', items: 'Cold Brew Float + Sourdough Toast + 2x Flat White' },
  { id: 'INV-2026-037', time: 'Today, 03:28 PM', customer: 'Chirag Somaiya', amount: 1250, mode: 'Paytm UPI QR', gst: 62.50, status: 'SUCCESS', items: 'Signature Espresso Blend Beans (250g) + Pour Over' },
  { id: 'INV-2026-036', time: 'Today, 03:15 PM', customer: 'Tejasvi Gowda', amount: 1100, mode: 'Card POS', gst: 55.00, status: 'SUCCESS', items: '2x Mocha Frappé + Basque Cheesecake Slice' },
  { id: 'INV-2026-035', time: 'Today, 02:58 PM', customer: 'Tanvi Desai', amount: 760, mode: 'Paytm UPI QR', gst: 38.00, status: 'SUCCESS', items: 'Vanilla Sweet Cream Cold Brew + Muffin' },
  { id: 'INV-2026-034', time: 'Today, 02:45 PM', customer: 'Shalini George', amount: 560, mode: 'UPI Soundbox', gst: 28.00, status: 'SUCCESS', items: 'Spanish Latte + Butter Croissant' },
  { id: 'INV-2026-033', time: 'Today, 02:30 PM', customer: 'Rohan Sharma', amount: 980, mode: 'Paytm UPI QR', gst: 49.00, status: 'SUCCESS', items: 'Pour Over (Attikan) + Dark Chocolate Brownie' },
  { id: 'INV-2026-032', time: 'Today, 02:18 PM', customer: 'Gayatri Ramaswamy', amount: 480, mode: 'Cash Counter', gst: 24.00, status: 'SUCCESS', items: '2x Iced Hibiscus Berry Tea + Cookie' },
  { id: 'INV-2026-031', time: 'Today, 02:05 PM', customer: 'Karthik Subbaraj', amount: 1450, mode: 'Paytm UPI QR', gst: 72.50, status: 'SUCCESS', items: 'Artisan Toastie Combo + Cold Brew + Dessert' },
  { id: 'INV-2026-030', time: 'Today, 01:52 PM', customer: 'Divya Nambiar', amount: 720, mode: 'UPI Soundbox', gst: 36.00, status: 'SUCCESS', items: 'Flat White + Avocado Sourdough' },
  { id: 'INV-2026-029', time: 'Today, 01:40 PM', customer: 'Siddharth V.', amount: 1300, mode: 'Card POS', gst: 65.00, status: 'SUCCESS', items: 'Lunch Special • Toastie + Salad + Cold Brew' },
  { id: 'INV-2026-028', time: 'Today, 01:28 PM', customer: 'Priya Venkatesh', amount: 620, mode: 'Paytm UPI QR', gst: 31.00, status: 'SUCCESS', items: 'Filter Kaapi + Banana Walnut Cake' },
  { id: 'INV-2026-027', time: 'Today, 01:15 PM', customer: 'Nikhil Kashyap', amount: 890, mode: 'Paytm UPI QR', gst: 44.50, status: 'SUCCESS', items: 'Cold Brew Growler Sample + Butter Croissant' },
  { id: 'INV-2026-026', time: 'Today, 01:05 PM', customer: 'Sanyukta Jain', amount: 680, mode: 'Paytm UPI QR', gst: 34.00, status: 'SUCCESS', items: 'Cappuccino + Blueberry Muffin + Biscotti' },
  { id: 'INV-2026-025', time: 'Today, 12:55 PM', customer: 'Girish Menon', amount: 940, mode: 'UPI Soundbox', gst: 47.00, status: 'SUCCESS', items: 'Pour Over Flight + Almond Cookie' },

  // Midday & Lunch (11:00 AM - 1:00 PM) - 12 Invoices
  { id: 'INV-2026-024', time: 'Today, 12:42 PM', customer: 'Harish Ranganathan', amount: 1650, mode: 'Paytm UPI QR', gst: 82.50, status: 'SUCCESS', items: 'Corporate Lunch • 3x Specialty Coffees + Toasties' },
  { id: 'INV-2026-023', time: 'Today, 12:30 PM', customer: 'Meera Chidambaram', amount: 880, mode: 'Paytm UPI QR', gst: 44.00, status: 'SUCCESS', items: 'Hazelnut Latte + Cinnamon Swirl + Cold Brew' },
  { id: 'INV-2026-022', time: 'Today, 12:18 PM', customer: 'Kishore Kumar', amount: 1100, mode: 'Card POS', gst: 55.00, status: 'SUCCESS', items: '2x Cold Brew Float + Sourdough Toast' },
  { id: 'INV-2026-021', time: 'Today, 12:05 PM', customer: 'Nandini Swamy', amount: 750, mode: 'Paytm UPI QR', gst: 37.50, status: 'SUCCESS', items: 'Classic Cold Brew + Avocado Sourdough' },
  { id: 'INV-2026-020', time: 'Today, 11:50 AM', customer: 'Deepak Joshi', amount: 1420, mode: 'Paytm UPI QR', gst: 71.00, status: 'SUCCESS', items: 'Artisan Combo • Pour Over + Toast + Brownie' },
  { id: 'INV-2026-019', time: 'Today, 11:38 AM', customer: 'Anjali Nambisan', amount: 480, mode: 'UPI Soundbox', gst: 24.00, status: 'SUCCESS', items: 'Traditional Filter Kaapi + Sourdough Toast' },
  { id: 'INV-2026-018', time: 'Today, 11:25 AM', customer: 'Suresh Raina', amount: 960, mode: 'Paytm UPI QR', gst: 48.00, status: 'SUCCESS', items: '2x Flat White + Almond Biscotti' },
  { id: 'INV-2026-017', time: 'Today, 11:15 AM', customer: 'Ritu Sen', amount: 1350, mode: 'Paytm UPI QR', gst: 67.50, status: 'SUCCESS', items: 'Whole Beans Bag (250g) + Cold Brew' },
  { id: 'INV-2026-016', time: 'Today, 11:02 AM', customer: 'Venkat Prabhu', amount: 1120, mode: 'Cash Counter', gst: 56.00, status: 'SUCCESS', items: 'Specialty Coffee Trio + Cookies Box' },
  { id: 'INV-2026-015', time: 'Today, 10:48 AM', customer: 'Padma Lakshmi', amount: 790, mode: 'Paytm UPI QR', gst: 39.50, status: 'SUCCESS', items: 'Matcha Latte + Butter Croissant' },
  { id: 'INV-2026-014', time: 'Today, 10:35 AM', customer: 'Manoj Bajpayee', amount: 1250, mode: 'Paytm UPI QR', gst: 62.50, status: 'SUCCESS', items: '2x Pour Over (Attikan) + Toastie' },
  { id: 'INV-2026-013', time: 'Today, 10:20 AM', customer: 'Shobha De', amount: 890, mode: 'UPI Soundbox', gst: 44.50, status: 'SUCCESS', items: 'Flat White + Dark Chocolate Brownie' },

  // Morning Rush (07:30 AM - 10:00 AM) - 12 Invoices
  { id: 'INV-2026-012', time: 'Today, 10:05 AM', customer: 'Bhuvaneshwari P.', amount: 920, mode: 'Paytm UPI QR', gst: 46.00, status: 'SUCCESS', items: '2x Filter Kaapi + 2x Butter Croissant' },
  { id: 'INV-2026-011', time: 'Today, 09:50 AM', customer: 'Chendur Pandian', amount: 1450, mode: 'Paytm UPI QR', gst: 72.50, status: 'SUCCESS', items: 'Client Meeting • 3x Cappuccinos + Toasties' },
  { id: 'INV-2026-010', time: 'Today, 09:38 AM', customer: 'Leela Samson', amount: 620, mode: 'Paytm UPI QR', gst: 31.00, status: 'SUCCESS', items: 'Cortado + Dark Chocolate Brownie' },
  { id: 'INV-2026-009', time: 'Today, 09:25 AM', customer: 'Rahul Deshmukh', amount: 850, mode: 'Paytm UPI QR', gst: 42.50, status: 'SUCCESS', items: 'Cold Brew + Avocado Sourdough Toast' },
  { id: 'INV-2026-008', time: 'Today, 09:12 AM', customer: 'Swati Bhatt', amount: 1300, mode: 'Paytm UPI QR', gst: 65.00, status: 'SUCCESS', items: 'Cold Brew Growler (1L) Takeaway' },
  { id: 'INV-2026-007', time: 'Today, 08:58 AM', customer: 'Vikram Iyer', amount: 720, mode: 'UPI Soundbox', gst: 36.00, status: 'SUCCESS', items: 'Flat White + Butter Croissant + Biscotti' },
  { id: 'INV-2026-006', time: 'Today, 08:45 AM', customer: 'Sanjay Dutt', amount: 800, mode: 'Card POS', gst: 40.00, status: 'SUCCESS', items: '2x Americano + Sourdough Toast' },
  { id: 'INV-2026-005', time: 'Today, 08:30 AM', customer: 'Tarun Tahiliani', amount: 1510, mode: 'Cash Counter', gst: 75.50, status: 'SUCCESS', items: 'Breakfast Meeting • 3x Coffees + Pastry Basket' },
  { id: 'INV-2026-004', time: 'Today, 08:15 AM', customer: 'Indu Sundaresan', amount: 480, mode: 'UPI Soundbox', gst: 24.00, status: 'SUCCESS', items: 'Filter Kaapi + Butter Croissant' },
  { id: 'INV-2026-003', time: 'Today, 08:02 AM', customer: 'Naveen Jindal', amount: 1450, mode: 'Paytm UPI QR', gst: 72.50, status: 'SUCCESS', items: 'Specialty Beans (500g) + Morning Brew' },
  { id: 'INV-2026-002', time: 'Today, 07:48 AM', customer: 'Radhika Sarath', amount: 650, mode: 'Paytm UPI QR', gst: 32.50, status: 'SUCCESS', items: 'Double Espresso + Sourdough Toast' },
  { id: 'INV-2026-001', time: 'Today, 07:35 AM', customer: 'Atheeswaran R. (Opening Staff)', amount: 180, mode: 'Paytm UPI QR', gst: 9.00, status: 'SUCCESS', items: 'First Light Dial-in Brew' }
];

// Verify Exact Totals (Single Source of Truth)
export const LEDGER_TOTALS = {
  totalRevenue: 58450,
  totalInvoices: 54,
  upiTotal: 48200,
  cardTotal: 6800,
  cashTotal: 3450,
  pendingSettlement: 14200,
  settledAmount: 44250,
  peakSlot: '4:30 PM - 6:00 PM (Evening Chai & Specialty Bakes)',
  topCustomer: 'Ashwin Balaji (₹1,850)'
};

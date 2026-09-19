// Verified Customer Support & Cross-Platform Reviews Data for Athees Café

export const MOCK_REVIEWS_SUMMARY = {
  averageRating: 4.8,
  totalReviews: 482,
  positivePercent: 92,
  neutralPercent: 5,
  criticalPercent: 3,
  platformBreakdown: {
    google: { rating: 4.8, count: 290, label: 'Google Maps' },
    zomato: { rating: 4.6, count: 118, label: 'Zomato Dining' },
    swiggy: { rating: 4.7, count: 54, label: 'Swiggy Dineout' },
    directQr: { rating: 4.9, count: 20, label: 'Countertop QR' }
  }
};

export const MOCK_REVIEWS = [
  {
    id: 'rev_01',
    author: 'Rohan Sharma',
    platform: 'google', // 'google' | 'zomato' | 'swiggy' | 'directQr'
    rating: 5,
    relativeTime: '2 hours ago',
    date: new Date(Date.now() - 2 * 3600000).toISOString(),
    content: 'Hands down the best specialty coffee in Indiranagar! The 12-hour steeped cold brew has zero acidity and notes of hazelnut. Also love how fast the Paytm Soundbox confirms payments without any cashier awkwardness.',
    tags: ['Specialty Coffee', 'Cold Brew', 'Fast Checkout'],
    likes: 14,
    replied: true,
    replyText: 'Thank you Rohan! Delighted you loved our 12-hour cold brew. Next time you drop by, ask our barista for the Attikan single-origin pour-over!'
  },
  {
    id: 'rev_02',
    author: 'Sneha Kulkarni',
    platform: 'zomato',
    rating: 5,
    relativeTime: 'Yesterday',
    date: new Date(Date.now() - 24 * 3600000).toISOString(),
    content: 'Artisan bakery done right in Bangalore. Their Avocado Sourdough toast with poached egg and balsamic glaze is top tier. Coffee beans are roasted fresh from Blue Tokai. Perfect work-from-café spot!',
    tags: ['Avocado Toast', 'Sourdough', 'Ambiance'],
    likes: 8,
    replied: true,
    replyText: 'Warm thanks Sneha! Our bakers ferment the sourdough for 24 hours fresh every morning. See you again on 100ft Road soon!'
  },
  {
    id: 'rev_03',
    author: 'Vikram Iyer',
    platform: 'google',
    rating: 4,
    relativeTime: '2 days ago',
    date: new Date(Date.now() - 48 * 3600000).toISOString(),
    content: 'Coffee is extraordinary—the Cortado and Cinnamon Swirl were divine. Only giving 4 stars because between 5:30 PM and 7:00 PM the seating was fully packed and we had to wait 12 minutes for a table.',
    tags: ['Cortado', 'Evening Wait Time', 'Seating'],
    likes: 19,
    replied: false,
    replyText: null,
    suggestedReply: 'Hello Vikram, thank you for your kind words on our Cortado and Cinnamon Swirl! We apologize for the evening seating rush. We are introducing priority quick-checkout for evening regulars to make table turnover smoother. We would love to host you again!'
  },
  {
    id: 'rev_04',
    author: 'Priya Venkatesh',
    platform: 'swiggy',
    rating: 5,
    relativeTime: '3 days ago',
    date: new Date(Date.now() - 72 * 3600000).toISOString(),
    content: 'Their South Indian Filter Kaapi brewed with estate beans is pure nostalgia with modern artisanal finesse. Pair it with the banana walnut cake!',
    tags: ['Filter Kaapi', 'Banana Cake', 'Heritage Brew'],
    likes: 6,
    replied: true,
    replyText: 'Thank you Priya! Our Filter Kaapi blend is specially curated with traditional chicory balance. So glad you enjoyed the pairing!'
  },
  {
    id: 'rev_05',
    author: 'Kabir Singhania',
    platform: 'google',
    rating: 5,
    relativeTime: '4 days ago',
    date: new Date(Date.now() - 96 * 3600000).toISOString(),
    content: 'Ordered a 1L Cold Brew growler for our team at an Indiranagar tech office. Kept everybody energized all afternoon. Fantastic customer service and packaging.',
    tags: ['Cold Brew Growler', 'Office Catering', 'Packaging'],
    likes: 11,
    replied: true,
    replyText: 'Cheers Kabir! We love fueling innovative tech teams across Bangalore with our growlers. Reach out anytime for team refills!'
  },
  {
    id: 'rev_06',
    author: 'Maya Krishnamurthy',
    platform: 'directQr',
    rating: 5,
    relativeTime: '5 days ago',
    date: new Date(Date.now() - 120 * 3600000).toISOString(),
    content: 'Scanned the counter QR, paid via UPI, and the speaker chimed immediately. Baristas are super knowledgeable about roasting profiles.',
    tags: ['UPI Payment', 'Barista Knowledge', 'Soundbox'],
    likes: 4,
    replied: false,
    replyText: null,
    suggestedReply: 'Thank you Maya! Our baristas love chatting about bean origin and elevation. Drop by anytime for cupping recommendations!'
  },
  {
    id: 'rev_07',
    author: 'Arjun Reddy',
    platform: 'zomato',
    rating: 4,
    relativeTime: '6 days ago',
    date: new Date(Date.now() - 144 * 3600000).toISOString(),
    content: 'Solid Flat White and Basque cheesecake. Would be great if they added a few more vegan and dairy-free pastry options in the display case.',
    tags: ['Flat White', 'Vegan Pastries', 'Dietary Request'],
    likes: 7,
    replied: false,
    replyText: null,
    suggestedReply: 'Hi Arjun, thank you for the helpful suggestion! We are currently piloting oat-milk pastries and vegan almond cakes with our bakery partners. Stay tuned!'
  },
  {
    id: 'rev_08',
    author: 'Divya Sundaram',
    platform: 'google',
    rating: 5,
    relativeTime: '1 week ago',
    date: new Date(Date.now() - 168 * 3600000).toISOString(),
    content: 'The courtyard ambiance with lush plants on 100ft Road is so peaceful. Spanish Latte is rich and not overly sweet. My favorite weekend sanctuary.',
    tags: ['Ambiance', 'Spanish Latte', 'Weekend Spot'],
    likes: 15,
    replied: true,
    replyText: 'Thank you Divya! We designed our courtyard to be a green sanctuary in the heart of Indiranagar. Happy to be your go-to weekend retreat!'
  }
];

export const MOCK_SUPPORT_TICKETS = [
  {
    id: 'tkt_101',
    ticketNumber: 'SUP-BLR-041',
    customerName: 'Sneha Kulkarni',
    customerPhone: '+91 98450 11290',
    category: 'LOST_AND_FOUND',
    priority: 'HIGH',
    status: 'IN_PROGRESS', // 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
    subject: 'Lost Ray-Ban sunglasses on Table 3 outdoor patio',
    details: 'Customer called stating she left her black tortoiseshell Ray-Ban sunglasses on Table 3 during evening coffee around 6:30 PM yesterday.',
    orderRef: 'INV-2026-106 (Cold Brew & Brownie)',
    assignedTo: 'Shift Lead Barista (Ramesh)',
    openedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    aiDraftResponse: 'Hi Sneha! Good news—our morning floor shift found your black Ray-Ban sunglasses near Table 3 patio. We have kept them safely in the store manager drawer. You can collect them anytime before 11:00 PM today!'
  },
  {
    id: 'tkt_102',
    ticketNumber: 'SUP-BLR-042',
    customerName: 'Preeti Mahajan',
    customerPhone: '+91 97313 33451',
    category: 'INVOICE_BILLING',
    priority: 'MEDIUM',
    status: 'OPEN',
    subject: 'Need B2B Corporate GST Tax Invoice for Reimbursement',
    details: 'Requires itemized PDF tax invoice copy with company GSTIN for yesterday\'s client breakfast meeting totaling ₹1,850.',
    orderRef: 'INV-2026-104 (Cold Brew Growler & Bakes)',
    assignedTo: 'Store Accounting',
    openedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    aiDraftResponse: 'Hello Preeti! We have generated your formal B2B GST tax invoice for order INV-2026-104 (₹1,850 + 5% GST). You can download the authenticated PDF copy directly here or reply with your company GSTIN for a revised header.'
  },
  {
    id: 'tkt_103',
    ticketNumber: 'SUP-BLR-043',
    customerName: 'Kabir Singhania',
    customerPhone: '+91 99002 88902',
    category: 'CATERING_ORDER',
    priority: 'HIGH',
    status: 'OPEN',
    subject: 'Bulk Coffee Growler & Pastry Box Order for 40 People',
    details: 'Inquiring about 4x 1L Cold Brew growlers and 30x assorted croissants for an office town hall this coming Friday 3:00 PM.',
    orderRef: 'New Corporate Inquiry',
    assignedTo: 'Store Manager',
    openedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    aiDraftResponse: 'Namaste Kabir! We would love to cater your team town hall this Friday! We can provide 4x 1L freshly steeped cold brew growlers plus 30 warm artisanal croissants. We will include glassware and napkins. Should we schedule delivery for 2:30 PM?'
  },
  {
    id: 'tkt_104',
    ticketNumber: 'SUP-BLR-044',
    customerName: 'Maya Krishnamurthy',
    customerPhone: '+91 98861 55673',
    category: 'DIETARY_QUESTION',
    priority: 'LOW',
    status: 'RESOLVED',
    subject: 'Inquiry regarding oat milk steaming wand separation',
    details: 'Customer asked if separate steaming pitcher and wand wipe protocols are used for non-dairy milk to prevent lactose cross-contamination.',
    orderRef: 'General Inquiry',
    assignedTo: 'Head Barista',
    openedAt: new Date(Date.now() - 26 * 3600000).toISOString(),
    aiDraftResponse: 'Hi Maya! Absolutely. At Athees Café, we maintain dedicated color-coded pitchers and strict steam-wand purge & sanitizing wipes between dairy and plant-based milks (Almond and Oat). Your beverage will be completely lactose-safe!'
  },
  {
    id: 'tkt_105',
    ticketNumber: 'SUP-BLR-045',
    customerName: 'Rahul Deshmukh',
    customerPhone: '+91 98860 77742',
    category: 'LOYALTY_OFFER',
    priority: 'LOW',
    status: 'RESOLVED',
    subject: 'Verification of ATHEES10 voucher redemption on POS',
    details: 'Customer asked if the 10% WhatsApp re-engagement offer code can be used for takeaway coffee beans in addition to dine-in.',
    orderRef: 'Voucher Campaign ATHEES10',
    assignedTo: 'Store Cashier',
    openedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    aiDraftResponse: 'Hello Rahul! Yes, your ATHEES10 voucher code is valid for both dine-in treats and 250g packaged specialty coffee beans above ₹249. Simply mention the code at counter checkout!'
  }
];

export const MOCK_CUSTOMER_SUGGESTIONS = [
  {
    id: 'sug_01',
    topic: 'Evening Rush Table Turnover (5 PM - 7 PM)',
    frequency: 'Mentioned by 18 patrons in reviews & chats',
    sentimentScore: 'Moderate Concern',
    summary: 'Patrons love the atmosphere but face 10-15 min wait times during the evening chai/coffee peak.',
    aiRecommendation: 'Activate the "Evening Rush Quick-Pick" counter combo with pre-brewed cold brew & bakes to reduce queue bottlenecks by 35%.',
    actionType: 'WORKFLOW_AUTOMATION',
    actionLabel: 'Launch Evening Fast-Track Workflow'
  },
  {
    id: 'sug_02',
    topic: 'Expanded Vegan & Eggless Bakes',
    frequency: 'Mentioned by 9 patrons',
    sentimentScore: 'Growth Opportunity',
    summary: 'High demand for dairy-free and eggless pastry alternatives alongside specialty oat-milk lattes.',
    aiRecommendation: 'Add 2 dedicated vegan options (Oat Flour Banana Muffin & Vegan Chocolate Ganache) with Mysore Bakery partner.',
    actionType: 'STORE_RULE',
    actionLabel: 'Add to Supplier Restock Guidelines'
  },
  {
    id: 'sug_03',
    topic: 'Outdoor Patio Laptop Power Outlets',
    frequency: 'Mentioned by 6 patrons',
    sentimentScore: 'Facility Request',
    summary: 'Remote workers sitting on the garden patio request additional weatherproof power strips.',
    aiRecommendation: 'Install 4 weatherproof under-bench charging ports along the east perimeter wall.',
    actionType: 'STORE_NOTE',
    actionLabel: 'Log Maintenance Task'
  },
  {
    id: 'sug_04',
    topic: 'Weekend Coffee Tasting / Cupping Workshop',
    frequency: 'Mentioned by 12 patrons',
    sentimentScore: 'High Enthusiasm',
    summary: 'Loyal regulars are eager to learn manual pour-over brewing and taste different roast elevations.',
    aiRecommendation: 'Schedule a Saturday morning 10:00 AM Coffee Cupping session limited to 15 patrons at ₹499/seat.',
    actionType: 'MARKETING_CAMPAIGN',
    actionLabel: 'Draft Cupping Event Invite'
  }
];

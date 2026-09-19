import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  HeartHandshake, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Sparkles, 
  Phone, 
  Search, 
  Filter, 
  ExternalLink, 
  Plus, 
  Check, 
  Edit3, 
  ThumbsUp, 
  Share2, 
  Layers, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  Tag,
  Coffee,
  Store,
  UserCheck
} from 'lucide-react';
import { 
  MOCK_REVIEWS_SUMMARY, 
  MOCK_REVIEWS, 
  MOCK_SUPPORT_TICKETS,
  MOCK_CUSTOMER_SUGGESTIONS 
} from '../../data/mockSupportReviewsData';
import { playPaytmChime } from '../../services/soundboxAudio';
import { normalizeWhatsAppNumber, buildWhatsAppUrl, openWhatsAppChat } from '../../utils/whatsappHelper';

export default function CustomerSupportView({ activeMerchant, onNavigateTab }) {
  const [activeSubTab, setActiveSubTab] = useState('reviews'); // 'reviews' | 'tickets' | 'suggestions'
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Reviews state
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [replyingReviewId, setReplyingReviewId] = useState(null);
  const [draftReplyText, setDraftReplyText] = useState('');

  // Support Tickets state
  const [tickets, setTickets] = useState(MOCK_SUPPORT_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [newTicketData, setNewTicketData] = useState({
    customerName: '',
    customerPhone: '',
    category: 'LOST_AND_FOUND',
    subject: '',
    details: '',
    priority: 'MEDIUM'
  });

  // Handle Review AI Reply Generation
  const handleGenerateAiReply = (rev) => {
    setReplyingReviewId(rev.id);
    setDraftReplyText(rev.suggestedReply || `Thank you for your warm review of ${activeMerchant?.name || 'Athees Café'}! We're thrilled you had a memorable visit. Next time you stop by Indiranagar, be sure to try our freshly steeped cold brew!`);
  };

  const handlePostReply = (revId) => {
    setReviews(prev => prev.map(r => {
      if (r.id === revId) {
        return {
          ...r,
          replied: true,
          replyText: draftReplyText
        };
      }
      return r;
    }));
    playPaytmChime(`Merchant reply published for customer review.`);
    setReplyingReviewId(null);
    setDraftReplyText('');
  };

  // Handle Support Ticket Resolution
  const handleResolveTicket = (ticketId) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: 'RESOLVED' };
      }
      return t;
    }));
    playPaytmChime(`Customer support inquiry marked as resolved.`);
  };

  const handleSendWhatsAppUpdate = (ticket) => {
    const rawMsg = ticket.aiDraftResponse || `Hello ${ticket.customerName}, this is ${activeMerchant?.name || 'Athees Café'} regarding your inquiry: ${ticket.subject}. We're happy to help!`;
    const cleanPhone = normalizeWhatsAppNumber(ticket.customerPhone);
    openWhatsAppChat(cleanPhone, rawMsg);
    playPaytmChime(`Opening WhatsApp chat to send customer resolution.`);
  };

  const handleCreateNewTicket = (e) => {
    e.preventDefault();
    if (!newTicketData.customerName || !newTicketData.subject) return;

    const newTicket = {
      id: `tkt_${Date.now()}`,
      ticketNumber: `SUP-BLR-${Math.floor(100 + Math.random() * 900)}`,
      customerName: newTicketData.customerName,
      customerPhone: newTicketData.customerPhone || '+91 98450 00000',
      category: newTicketData.category,
      priority: newTicketData.priority,
      status: 'OPEN',
      subject: newTicketData.subject,
      details: newTicketData.details || 'Customer walk-in recorded at front counter.',
      orderRef: 'Walk-in Counter Request',
      assignedTo: 'Shift Lead Barista',
      openedAt: new Date().toISOString(),
      aiDraftResponse: `Hello ${newTicketData.customerName}! Thank you for reaching out to Athees Café. We have logged your request regarding "${newTicketData.subject}" and our team is addressing it immediately!`
    };

    setTickets(prev => [newTicket, ...prev]);
    setIsNewTicketModalOpen(false);
    setNewTicketData({
      customerName: '',
      customerPhone: '',
      category: 'LOST_AND_FOUND',
      subject: '',
      details: '',
      priority: 'MEDIUM'
    });
    playPaytmChime(`New customer support ticket created.`);
  };

  // Filtered reviews
  const filteredReviews = reviews.filter(r => {
    const matchPlatform = platformFilter === 'ALL' || r.platform === platformFilter;
    const matchSearch = r.author.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        r.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (r.tags && r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchPlatform && matchSearch;
  });

  // Filtered tickets
  const filteredTickets = tickets.filter(t => {
    const matchStatus = ticketStatusFilter === 'ALL' || t.status === ticketStatusFilter;
    const matchSearch = t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const openTicketsCount = tickets.filter(t => t.status === 'OPEN').length;
  const inProgressTicketsCount = tickets.filter(t => t.status === 'IN_PROGRESS').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* 1. Header & Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="label-editorial text-[10px]">
            CUSTOMER ADVOCACY & REPUTATION INTELLIGENCE
          </div>
          <h1 className="display-title text-2xl font-bold tracking-tight text-[#f2ebd8] mt-1">
            Support & Online <em>Reviews</em><span className="dot">.</span>
          </h1>
          <p className="lead-editorial text-xs text-[#9a9382] mt-0.5">
            Monitor verified ratings across Google, Zomato, Swiggy and Soundbox QR, handle customer inquiries, and implement patron suggestions.
          </p>
        </div>

        {/* Aggregate Score Pill */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.1)] text-right">
            <div className="flex items-center justify-end gap-1.5 text-[#e9b94a]">
              <Star className="w-4 h-4 fill-[#e9b94a]" />
              <span className="text-xl font-bold font-sans text-[#f2ebd8]">
                {MOCK_REVIEWS_SUMMARY.averageRating}
              </span>
              <span className="text-xs text-[#9a9382] font-mono">/ 5.0</span>
            </div>
            <div className="text-[10px] font-mono text-[#9a9382] mt-0.5">
              482 Verified Customer Reviews
            </div>
          </div>

          <button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="btn-editorial btn-editorial-primary text-xs py-3 px-4 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Log Customer Inquiry</span>
          </button>
        </div>
      </div>

      {/* 2. Platform Breakdown Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'google', name: 'Google Maps', rating: '4.8 ★', count: '290 reviews', color: '#4285F4' },
          { key: 'zomato', name: 'Zomato Dining', rating: '4.6 ★', count: '118 reviews', color: '#E23744' },
          { key: 'swiggy', name: 'Swiggy Dineout', rating: '4.7 ★', count: '54 reviews', color: '#FC8019' },
          { key: 'directQr', name: 'Countertop QR', rating: '4.9 ★', count: '20 reviews', color: '#ed6f5c' }
        ].map(p => (
          <div 
            key={p.key}
            onClick={() => { setActiveSubTab('reviews'); setPlatformFilter(p.key); }}
            className={`p-3.5 rounded-2xl bg-[#1e1c18]/80 border transition cursor-pointer hover:border-[rgba(242,235,216,0.2)] ${
              platformFilter === p.key && activeSubTab === 'reviews'
                ? 'border-[#ed6f5c] shadow-sm'
                : 'border-[rgba(242,235,216,0.08)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#f2ebd8] font-sans flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                {p.name}
              </span>
              <span className="text-xs font-bold text-[#e9b94a] font-mono">{p.rating}</span>
            </div>
            <p className="text-[10px] text-[#9a9382] font-mono mt-1">{p.count}</p>
          </div>
        ))}
      </div>

      {/* 3. Sub-Tab Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center bg-[#1e1c18]/90 p-1 rounded-xl border border-[rgba(242,235,216,0.08)]">
          <button
            onClick={() => { setActiveSubTab('reviews'); setPlatformFilter('ALL'); }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition font-sans flex items-center gap-2 ${
              activeSubTab === 'reviews'
                ? 'bg-[#ed6f5c] text-white shadow-sm'
                : 'text-[#9a9382] hover:text-[#f2ebd8]'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Online Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tickets')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition font-sans flex items-center gap-2 ${
              activeSubTab === 'tickets'
                ? 'bg-[#ed6f5c] text-white shadow-sm'
                : 'text-[#9a9382] hover:text-[#f2ebd8]'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Support Desk</span>
            {openTicketsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono font-bold">
                {openTicketsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('suggestions')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition font-sans flex items-center gap-2 ${
              activeSubTab === 'suggestions'
                ? 'bg-[#ed6f5c] text-white shadow-sm'
                : 'text-[#9a9382] hover:text-[#f2ebd8]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Patron Suggestions ({MOCK_CUSTOMER_SUGGESTIONS.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#6e6860] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={activeSubTab === 'reviews' ? 'Search reviews, tags, items...' : 'Search tickets, customers...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.1)] rounded-xl text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] font-sans"
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIEW 1: ONLINE REVIEWS & RATINGS */}
      {/* ============================================================ */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-4">
          {/* Platform Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6e6860] mr-1">Filter Channel:</span>
            {[
              { id: 'ALL', label: 'All Channels' },
              { id: 'google', label: 'Google Maps' },
              { id: 'zomato', label: 'Zomato' },
              { id: 'swiggy', label: 'Swiggy' },
              { id: 'directQr', label: 'Countertop QR' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setPlatformFilter(f.id)}
                className={`editorial-pill ${platformFilter === f.id ? 'active' : ''}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map((rev) => (
              <div 
                key={rev.id} 
                className="lunor-card rounded-2xl p-5 shadow-sm space-y-3.5 relative overflow-hidden flex flex-col justify-between hover:border-[rgba(242,235,216,0.16)] transition"
              >
                <div className="space-y-2.5">
                  {/* Top: Author, Platform badge & Rating */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] flex items-center justify-center font-bold text-xs font-mono text-[#c8c0a8]">
                        {rev.author[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-[#f2ebd8] font-sans">{rev.author}</div>
                        <div className="text-[10px] text-[#9a9382] font-mono flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold ${
                            rev.platform === 'google' ? 'bg-[#4285F4]/15 text-[#4285F4]' :
                            rev.platform === 'zomato' ? 'bg-[#E23744]/15 text-[#E23744]' :
                            rev.platform === 'swiggy' ? 'bg-[#FC8019]/15 text-[#FC8019]' :
                            'bg-[#ed6f5c]/15 text-[#ed6f5c]'
                          }`}>
                            {rev.platform === 'directQr' ? 'Countertop QR' : rev.platform}
                          </span>
                          <span>• {rev.relativeTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 text-[#e9b94a]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-[#e9b94a]' : 'text-[#6e6860]'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-xs text-[#c8c0a8] font-body leading-relaxed">
                    "{rev.content}"
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {rev.tags.map((t, idx) => (
                      <span key={idx} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#1e1c18] border border-[rgba(242,235,216,0.08)] text-[#9a9382]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom: Merchant Response Section */}
                <div className="pt-3 border-t border-[rgba(242,235,216,0.06)] space-y-2">
                  {rev.replied ? (
                    <div className="p-2.5 rounded-xl bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.06)] space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#6e7448]">
                        <span className="flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Store Response Published
                        </span>
                        <span className="text-[#6e6860]">Public</span>
                      </div>
                      <p className="text-[11px] text-[#f2ebd8] italic font-body">
                        "{rev.replyText}"
                      </p>
                    </div>
                  ) : replyingReviewId === rev.id ? (
                    <div className="space-y-2 p-3 rounded-xl bg-[#1a1814] border border-[#ed6f5c]/30">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#ed6f5c]">
                        <span className="flex items-center gap-1 font-semibold">
                          <Sparkles className="w-3 h-3" /> AI Reply Draft (Athees Tone)
                        </span>
                        <button 
                          onClick={() => setReplyingReviewId(null)}
                          className="text-[#9a9382] hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={draftReplyText}
                        onChange={e => setDraftReplyText(e.target.value)}
                        className="w-full p-2 bg-[#12100d] border border-[rgba(242,235,216,0.1)] rounded-lg text-xs text-[#f2ebd8] focus:outline-none focus:border-[#ed6f5c] font-sans"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handlePostReply(rev.id)}
                          className="btn-editorial btn-editorial-primary text-xs py-1.5 px-3"
                        >
                          <Send className="w-3 h-3" />
                          <span>Publish Official Response</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#e9b94a] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Response Pending
                      </span>
                      <button
                        onClick={() => handleGenerateAiReply(rev)}
                        className="editorial-pill text-xs hover:border-[#ed6f5c]"
                      >
                        <Sparkles className="w-3 h-3 text-[#ed6f5c]" />
                        <span>AI Smart Reply</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 2: CUSTOMER SUPPORT & INQUIRY DESK */}
      {/* ============================================================ */}
      {activeSubTab === 'tickets' && (
        <div className="space-y-4">
          {/* Status Filters */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'ALL', label: `All Inquiries (${tickets.length})` },
                { id: 'OPEN', label: `Open (${openTicketsCount})`, highlight: openTicketsCount > 0 },
                { id: 'IN_PROGRESS', label: `In Progress (${inProgressTicketsCount})` },
                { id: 'RESOLVED', label: 'Resolved' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setTicketStatusFilter(st.id)}
                  className={`editorial-pill ${ticketStatusFilter === st.id ? 'active' : ''} ${
                    st.highlight && ticketStatusFilter !== st.id ? 'border-[#ed6f5c]/40 text-[#ed6f5c]' : ''
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-mono text-[#9a9382]">
              Avg Support Resolution Time: <strong className="text-[#f2ebd8]">4 mins</strong>
            </span>
          </div>

          {/* Tickets List */}
          <div className="space-y-3">
            {filteredTickets.map((tkt) => (
              <div 
                key={tkt.id} 
                className="lunor-card rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden hover:border-[rgba(242,235,216,0.16)] transition"
              >
                {/* Header of Ticket */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[rgba(242,235,216,0.06)]">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] text-[#c8c0a8]">
                      {tkt.ticketNumber}
                    </span>
                    <div>
                      <h4 className="font-semibold text-sm text-[#f2ebd8] font-sans">{tkt.subject}</h4>
                      <div className="text-[10px] text-[#9a9382] font-mono mt-0.5 flex items-center gap-2">
                        <span>Patron: <strong className="text-[#f2ebd8]">{tkt.customerName}</strong> ({tkt.customerPhone})</span>
                        <span>•</span>
                        <span>Ref: {tkt.orderRef}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-semibold ${
                      tkt.status === 'OPEN' ? 'bg-[#ed6f5c]/15 text-[#ed6f5c] border border-[#ed6f5c]/30' :
                      tkt.status === 'IN_PROGRESS' ? 'bg-[#e9b94a]/15 text-[#e9b94a] border border-[#e9b94a]/30' :
                      'bg-[#6e7448]/15 text-[#6e7448] border border-[#6e7448]/30'
                    }`}>
                      {tkt.status.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-[#6e6860]">
                      {new Date(tkt.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <p className="text-xs text-[#c8c0a8] font-body leading-relaxed bg-[#161410] p-3 rounded-xl border border-[rgba(242,235,216,0.04)]">
                  "{tkt.details}"
                </p>

                {/* AI Draft Resolution Box */}
                <div className="p-3.5 rounded-xl bg-[#1e1c18]/90 border border-[rgba(242,235,216,0.08)] space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#ed6f5c]">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Prepared Resolution (Store Guidelines Grounded)</span>
                    </span>
                    <span className="text-[#6e6860]">Ready for WhatsApp Dispatch</span>
                  </div>
                  <p className="text-xs text-[#f2ebd8] font-body italic">
                    "{tkt.aiDraftResponse}"
                  </p>
                </div>

                {/* Ticket Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="text-[10px] text-[#6e6860] font-mono flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#9a9382]" />
                    <span>Assigned to: {tkt.assignedTo}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSendWhatsAppUpdate(tkt)}
                      className="btn-editorial btn-editorial-primary text-xs py-1.5 px-3.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send WhatsApp Resolution</span>
                    </button>

                    {tkt.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleResolveTicket(tkt.id)}
                        className="editorial-pill text-xs hover:border-[#6e7448] text-[#6e7448]"
                      >
                        <Check className="w-3 h-3" />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 3: PATRON SUGGESTIONS & ACTIONABLE IMPROVEMENTS */}
      {/* ============================================================ */}
      {activeSubTab === 'suggestions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.1)] flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#ed6f5c] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-semibold text-[#f2ebd8] font-sans">
                Autonomous Feedback Synthesis Engine
              </h4>
              <p className="text-[#9a9382] font-body leading-relaxed">
                Arc Mate parses text reviews from Google, Zomato, and counter chats into prioritized merchant action items. You can convert any patron suggestion directly into a store automation or supplier rule.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_CUSTOMER_SUGGESTIONS.map((sug) => (
              <div 
                key={sug.id}
                className="lunor-card rounded-2xl p-5 shadow-sm space-y-3.5 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-sm text-[#f2ebd8] font-sans">{sug.topic}</h4>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#e9b94a]/15 text-[#e9b94a] border border-[#e9b94a]/30 font-semibold">
                      {sug.sentimentScore}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-[#ed6f5c]">{sug.frequency}</div>
                  <p className="text-xs text-[#c8c0a8] font-body leading-relaxed">
                    {sug.summary}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#1a1814] border border-[rgba(242,235,216,0.06)] space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#9a9382] block">
                    AI Strategic Recommendation:
                  </span>
                  <p className="text-xs text-[#f2ebd8] font-body">
                    {sug.aiRecommendation}
                  </p>
                </div>

                <div className="pt-2 border-t border-[rgba(242,235,216,0.06)] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#6e6860] uppercase">
                    Action Target: {sug.actionType}
                  </span>
                  <button
                    onClick={() => {
                      playPaytmChime(`Patron suggestion queued into store workflow engine.`);
                      if (onNavigateTab) onNavigateTab('workflow');
                    }}
                    className="btn-editorial btn-editorial-primary text-xs py-1.5 px-3"
                  >
                    <span>{sug.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: LOG NEW CUSTOMER INQUIRY / WALK-IN */}
      {/* ============================================================ */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#161410] border border-[rgba(242,235,216,0.15)] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(242,235,216,0.08)]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#ed6f5c]">New Support Record</span>
                <h3 className="text-base font-bold text-[#f2ebd8] font-sans">Log Patron Inquiry</h3>
              </div>
              <button 
                onClick={() => setIsNewTicketModalOpen(false)}
                className="text-xs font-mono text-[#9a9382] hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateNewTicket} className="space-y-3.5 text-xs font-sans">
              <div>
                <label className="block text-[#c8c0a8] mb-1 font-medium">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Deshmukh"
                  value={newTicketData.customerName}
                  onChange={e => setNewTicketData({ ...newTicketData, customerName: e.target.value })}
                  className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl px-3.5 py-2.5 text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#c8c0a8] mb-1 font-medium">Mobile (WhatsApp)</label>
                  <input
                    type="text"
                    placeholder="+91 98860 77742"
                    value={newTicketData.customerPhone}
                    onChange={e => setNewTicketData({ ...newTicketData, customerPhone: e.target.value })}
                    className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl px-3.5 py-2.5 text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#c8c0a8] mb-1 font-medium">Category</label>
                  <select
                    value={newTicketData.category}
                    onChange={e => setNewTicketData({ ...newTicketData, category: e.target.value })}
                    className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl px-3 py-2.5 text-[#f2ebd8] focus:outline-none focus:border-[#ed6f5c]"
                  >
                    <option value="LOST_AND_FOUND">Lost & Found</option>
                    <option value="INVOICE_BILLING">GST Tax Invoice</option>
                    <option value="CATERING_ORDER">Catering / Bulk Order</option>
                    <option value="DIETARY_QUESTION">Dietary / Allergen</option>
                    <option value="GENERAL_FEEDBACK">Feedback / Suggestion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#c8c0a8] mb-1 font-medium">Subject / Inquiry Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Left laptop charger under table 5"
                  value={newTicketData.subject}
                  onChange={e => setNewTicketData({ ...newTicketData, subject: e.target.value })}
                  className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl px-3.5 py-2.5 text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c]"
                />
              </div>

              <div>
                <label className="block text-[#c8c0a8] mb-1 font-medium">Details & Specifics</label>
                <textarea
                  rows={3}
                  placeholder="Provide any relevant context, table number, or customer note..."
                  value={newTicketData.details}
                  onChange={e => setNewTicketData({ ...newTicketData, details: e.target.value })}
                  className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl px-3.5 py-2 text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[rgba(242,235,216,0.08)]">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#9a9382] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-editorial btn-editorial-primary text-xs py-2 px-4"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Ticket & Draft AI Response</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

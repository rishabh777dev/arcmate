import React, { useState, useEffect } from 'react';
import { Users, Search, AlertTriangle, ArrowRight } from 'lucide-react';

export default function CustomersView() {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('actionmate_token');
    fetch('/api/customers', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(r => r.json())
      .then(d => setCustomers(Array.isArray(d) ? d : []))
      .catch(e => console.error(e));
  }, []);

  const filtered = customers.filter(c => {
    const matchesFilter = filter === 'ALL' || c.segment === filter;
    const matchesSearch = c.displayName?.toLowerCase().includes(search.toLowerCase()) || 
                          c.phoneMasked?.includes(search);
    return matchesFilter && matchesSearch;
  });

  const inactiveCount = customers.filter(c => c.segment === 'INACTIVE_REGULAR').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="label-editorial text-[10px]">
            <span className="ix">PLATE 03</span> PATRON COHORTS & RETENTION
          </div>
          <h1 className="display-title text-2xl font-bold tracking-tight text-[#f2ebd8] mt-1">
            Patron <em>Directory</em><span className="dot">.</span>
          </h1>
          <p className="lead-editorial text-xs text-[#9a9382] mt-0.5">
            Identify regular patrons at risk of churn, track visitation frequency, and monitor customer lifetime value.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.1)] text-right relative overflow-hidden">
          <span className="text-[10px] font-mono tracking-widest text-[#ed6f5c] uppercase">At-Risk Regulars</span>
          <div className="text-xl font-bold font-sans text-[#f2ebd8] mt-0.5">{inactiveCount} Patrons</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'ALL', label: `All (${customers.length})` },
            { id: 'INACTIVE_REGULAR', label: `Inactive Regulars (${inactiveCount})`, highlight: true },
            { id: 'ACTIVE_REGULAR', label: 'Active Regulars' },
            { id: 'OCCASIONAL', label: 'Occasional' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`editorial-pill ${filter === t.id ? 'active' : ''} ${
                t.highlight && filter !== t.id ? 'border-[#ed6f5c]/40 text-[#ed6f5c]' : ''
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#6e6860] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.1)] rounded-xl text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] font-sans"
          />
        </div>
      </div>

      {/* Clean Editorial Table */}
      <div className="lunor-card rounded-2xl overflow-hidden shadow-sm relative">
        <span className="corner tl"></span>
        <span className="corner tr"></span>
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1a1814] border-b border-[rgba(242,235,216,0.08)] text-[#9a9382] text-[10px] font-mono uppercase tracking-wider">
            <tr>
              <th className="py-3 px-5 font-normal">Patron</th>
              <th className="py-3 px-5 font-normal">Phone</th>
              <th className="py-3 px-5 font-normal">Cohort Segment</th>
              <th className="py-3 px-5 font-normal">Visits</th>
              <th className="py-3 px-5 font-normal">Total Spend</th>
              <th className="py-3 px-5 font-normal">Last Visit</th>
              <th className="py-3 px-5 text-right font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(242,235,216,0.04)] text-[#c8c0a8]">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-[rgba(242,235,216,0.03)] transition">
                <td className="py-3 px-5 font-medium text-[#f2ebd8] flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#1e1c18] border border-[rgba(242,235,216,0.08)] text-[#c8c0a8] flex items-center justify-center font-bold text-xs font-mono">
                    {c.displayName[0]}
                  </div>
                  <span className="font-sans">{c.displayName}</span>
                </td>
                <td className="py-3 px-5 font-mono text-[#9a9382]">{c.phoneMasked}</td>
                <td className="py-3 px-5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-semibold ${
                    c.segment === 'INACTIVE_REGULAR'
                      ? 'bg-[#ed6f5c]/15 text-[#ed6f5c] border border-[#ed6f5c]/30'
                      : c.segment === 'ACTIVE_REGULAR'
                      ? 'bg-[#6e7448]/15 text-[#6e7448] border border-[#6e7448]/30'
                      : 'bg-[rgba(242,235,216,0.06)] text-[#9a9382] border border-[rgba(242,235,216,0.1)]'
                  }`}>
                    {c.segment.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 px-5 font-mono">{c.totalVisits} orders</td>
                <td className="py-3 px-5 font-mono font-semibold text-[#f2ebd8]">₹{c.totalSpend.toLocaleString()}</td>
                <td className="py-3 px-5 font-mono text-[#9a9382]">{new Date(c.lastVisit).toLocaleDateString()}</td>
                <td className="py-3 px-5 text-right">
                  {c.segment === 'INACTIVE_REGULAR' ? (
                    <span className="text-[10px] font-mono font-semibold text-[#ed6f5c] flex items-center justify-end gap-1">
                      <AlertTriangle className="w-3 h-3" /> Offer Queued
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#6e6860]">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

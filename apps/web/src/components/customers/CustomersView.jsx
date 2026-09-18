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
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            <span>Clients & Cohorts</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">Patron Directory</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Track repeat visits, identify patrons who missed recent visits, and analyze customer spending patterns.
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-[#1A1B20] border border-white/[0.07] text-right">
          <span className="text-[10px] font-semibold text-amber-400 uppercase">At-Risk Regulars</span>
          <div className="text-base font-bold text-white">{inactiveCount} Patrons</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[#16171B] p-1 rounded-xl border border-white/[0.06] text-xs">
          {[
            { id: 'ALL', label: `All (${customers.length})` },
            { id: 'INACTIVE_REGULAR', label: `Inactive Regulars (${inactiveCount})`, highlight: true },
            { id: 'ACTIVE_REGULAR', label: 'Active Regulars' },
            { id: 'OCCASIONAL', label: 'Occasional' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filter === t.id
                  ? 'bg-[#24252C] text-white shadow-sm font-semibold'
                  : t.highlight
                  ? 'text-amber-400 hover:bg-amber-500/10'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#16171B] border border-white/[0.07] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/[0.2]"
          />
        </div>
      </div>

      {/* Clean Lunor Table */}
      <div className="lunor-card rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#191A20] border-b border-white/[0.06] text-zinc-400 text-[11px] font-medium">
            <tr>
              <th className="py-3 px-5">Patron</th>
              <th className="py-3 px-5">Phone</th>
              <th className="py-3 px-5">Cohort Segment</th>
              <th className="py-3 px-5">Visits</th>
              <th className="py-3 px-5">Total Spend</th>
              <th className="py-3 px-5">Last Visit</th>
              <th className="py-3 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-zinc-300">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-white/[0.02] transition">
                <td className="py-3 px-5 font-medium text-white flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#222329] border border-white/[0.06] text-zinc-300 flex items-center justify-center font-bold text-xs">
                    {c.displayName[0]}
                  </div>
                  <span>{c.displayName}</span>
                </td>
                <td className="py-3 px-5 font-mono text-zinc-400">{c.phoneMasked}</td>
                <td className="py-3 px-5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    c.segment === 'INACTIVE_REGULAR'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : c.segment === 'ACTIVE_REGULAR'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                  }`}>
                    {c.segment.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 px-5">{c.totalVisits} orders</td>
                <td className="py-3 px-5 font-semibold text-white">₹{c.totalSpend.toLocaleString()}</td>
                <td className="py-3 px-5 text-zinc-400">{new Date(c.lastVisit).toLocaleDateString()}</td>
                <td className="py-3 px-5 text-right">
                  {c.segment === 'INACTIVE_REGULAR' ? (
                    <span className="text-[11px] font-semibold text-amber-400 flex items-center justify-end gap-1">
                      <AlertTriangle className="w-3 h-3" /> Offer Queued
                    </span>
                  ) : (
                    <span className="text-[11px] text-zinc-500">Active</span>
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

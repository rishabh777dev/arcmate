import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Share2, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  RefreshCw,
  Layers,
  ArrowRight
} from 'lucide-react';

const CATEGORY_COLORS = {
  MERCHANT: { bg: 'bg-[#00BAF2]/10', border: 'border-[#00BAF2]/40', text: 'text-[#00BAF2]', dot: '#00BAF2' },
  DEVICE: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-400', dot: '#10B981' },
  FINANCIAL: { bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-400', dot: '#F59E0B' },
  POLICY: { bg: 'bg-rose-500/10', border: 'border-rose-500/40', text: 'text-rose-400', dot: '#EF4444' },
  COHORT: { bg: 'bg-purple-500/10', border: 'border-purple-500/40', text: 'text-purple-400', dot: '#A855F7' },
  ANOMALY: { bg: 'bg-red-500/10', border: 'border-red-500/40', text: 'text-red-400', dot: '#F43F5E' },
  ACTION: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/40', text: 'text-indigo-400', dot: '#6366F1' }
};

export default function KnowledgeGraphView() {
  const [graphData, setGraphData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('graph'); // 'graph' | 'triples' | 'ingest'
  
  // Ingest form state
  const [ingestCategory, setIngestCategory] = useState('POLICY');
  const [ingestTitle, setIngestTitle] = useState('');
  const [ingestContent, setIngestContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState(false);

  const fetchGraph = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/knowledge/graph');
      const data = await res.json();
      setGraphData(data);
      if (data.nodes && data.nodes.length > 0 && !selectedNode) {
        setSelectedNode(data.nodes[0]);
      }
    } catch (err) {
      console.error('Failed to fetch knowledge graph:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  const handleIngest = async (e) => {
    e.preventDefault();
    if (!ingestTitle.trim() || !ingestContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/knowledge/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: ingestCategory,
          title: ingestTitle,
          content: ingestContent
        })
      });
      const data = await res.json();
      if (data.success) {
        setIngestTitle('');
        setIngestContent('');
        setIngestSuccess(true);
        setTimeout(() => setIngestSuccess(false), 3000);
        fetchGraph();
        setActiveTab('graph');
      }
    } catch (err) {
      console.error('Ingest failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute node coordinates for visually pleasant radial/hierarchical layout
  const getNodePositions = (nodes) => {
    if (!nodes) return {};
    const center = { x: 340, y: 220 };
    const radius = 170;
    const positions = {};

    nodes.forEach((node, idx) => {
      if (node.category === 'MERCHANT') {
        positions[node.id] = { x: center.x, y: center.y };
      } else {
        const otherNodes = nodes.filter(n => n.category !== 'MERCHANT');
        const otherIdx = otherNodes.findIndex(n => n.id === node.id);
        const angle = (otherIdx / otherNodes.length) * 2 * Math.PI - Math.PI / 2;
        positions[node.id] = {
          x: center.x + radius * Math.cos(angle),
          y: center.y + radius * Math.sin(angle)
        };
      }
    });

    return positions;
  };

  const positions = graphData ? getNodePositions(graphData.nodes) : {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs">
      
      {/* Top Header Card */}
      <div className="lunor-card p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-4 h-4 text-blue-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Store Rules & Business Knowledge
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Active Store Rules
            </span>
          </div>
          <p className="text-zinc-400 max-w-2xl text-xs">
            Visual knowledge map governing store operations, working capital, paired Soundbox hardware, and discount guardrails (strict 15% margin ceiling).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-1.5 rounded-xl font-medium transition ${
              activeTab === 'graph' ? 'bg-blue-600 text-white font-bold' : 'lunor-button-subtle text-zinc-300'
            }`}
          >
            Knowledge Map
          </button>
          <button
            onClick={() => setActiveTab('triples')}
            className={`px-3 py-1.5 rounded-xl font-medium transition ${
              activeTab === 'triples' ? 'bg-blue-600 text-white font-bold' : 'lunor-button-subtle text-zinc-300'
            }`}
          >
            Rules & Policies ({graphData?.triples?.length || 3})
          </button>
          <button
            onClick={() => setActiveTab('ingest')}
            className={`px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 ${
              activeTab === 'ingest' ? 'bg-blue-600 text-white font-bold' : 'lunor-button-subtle text-zinc-300'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Store Rule</span>
          </button>
        </div>
      </div>

      {/* VIEW: GRAPH CANVAS */}
      {activeTab === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left 8 Cols: Interactive SVG Graph */}
          <div className="lg:col-span-8 lunor-card rounded-2xl p-4 flex flex-col relative overflow-hidden h-[540px]">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] z-10">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-zinc-400" />
                <span className="font-semibold text-white">Interactive Entity-Concept-Link Canvas</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00BAF2]"></span> Merchant
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Policy (15% Cap)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Device
                </span>
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="flex-1 w-full h-full relative flex items-center justify-center">
              {isLoading ? (
                <div className="flex items-center gap-2 text-zinc-400 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#00BAF2]" />
                  <span>Loading Cognee Knowledge Graph...</span>
                </div>
              ) : (
                <svg className="w-full h-full" viewBox="0 0 680 440">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3F3F46" />
                    </marker>
                    <marker id="arrow-active" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#00BAF2" />
                    </marker>
                  </defs>

                  {/* Render Edges */}
                  {graphData?.edges?.map(edge => {
                    const src = positions[edge.source];
                    const tgt = positions[edge.target];
                    if (!src || !tgt) return null;

                    const isConnected = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

                    return (
                      <g key={edge.id}>
                        <line
                          x1={src.x}
                          y1={src.y}
                          x2={tgt.x}
                          y2={tgt.y}
                          stroke={isConnected ? '#00BAF2' : '#27272A'}
                          strokeWidth={isConnected ? 2 : 1.2}
                          strokeDasharray={isConnected ? 'none' : '4,3'}
                          markerEnd={isConnected ? 'url(#arrow-active)' : 'url(#arrow)'}
                        />
                        <text
                          x={(src.x + tgt.x) / 2}
                          y={(src.y + tgt.y) / 2 - 5}
                          fill={isConnected ? '#00BAF2' : '#71717A'}
                          fontSize="8"
                          textAnchor="middle"
                          className="select-none font-mono"
                        >
                          {edge.relation}
                        </text>
                      </g>
                    );
                  })}

                  {/* Render Nodes */}
                  {graphData?.nodes?.map(node => {
                    const pos = positions[node.id];
                    if (!pos) return null;

                    const isSelected = selectedNode?.id === node.id;
                    const catTheme = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.MERCHANT;

                    return (
                      <g 
                        key={node.id} 
                        transform={`translate(${pos.x}, ${pos.y})`}
                        onClick={() => setSelectedNode(node)}
                        className="cursor-pointer transition-all group"
                      >
                        <circle
                          r={node.category === 'MERCHANT' ? 28 : 20}
                          fill={isSelected ? '#18181B' : '#141416'}
                          stroke={isSelected ? '#00BAF2' : catTheme.dot}
                          strokeWidth={isSelected ? 2.5 : 1.5}
                          className="group-hover:scale-110 transition-transform"
                        />
                        {isSelected && (
                          <circle
                            r={node.category === 'MERCHANT' ? 34 : 26}
                            fill="none"
                            stroke="#00BAF2"
                            strokeWidth="1"
                            opacity="0.4"
                            className="animate-ping"
                          />
                        )}
                        <text
                          y={3}
                          fill="#FFFFFF"
                          fontSize={node.category === 'MERCHANT' ? '10' : '9'}
                          fontWeight="bold"
                          textAnchor="middle"
                          className="select-none pointer-events-none"
                        >
                          {node.category === 'MERCHANT' ? 'SHOP' : node.category.slice(0, 3)}
                        </text>
                        <text
                          y={node.category === 'MERCHANT' ? 42 : 32}
                          fill={isSelected ? '#FFFFFF' : '#A1A1AA'}
                          fontSize="9"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          textAnchor="middle"
                          className="select-none pointer-events-none"
                        >
                          {node.label.length > 18 ? node.label.slice(0, 16) + '...' : node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          </div>

          {/* Right 4 Cols: Node Inspector */}
          <div className="lg:col-span-4 lunor-card rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#00BAF2]" />
                  <h3 className="font-bold text-white">Entity Inspector</h3>
                </div>
                {selectedNode && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[selectedNode.category]?.bg} ${CATEGORY_COLORS[selectedNode.category]?.border} ${CATEGORY_COLORS[selectedNode.category]?.text}`}>
                    {selectedNode.category}
                  </span>
                )}
              </div>

              {selectedNode ? (
                <div className="pt-4 space-y-3">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Entity Label</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{selectedNode.label}</h4>
                    <span className="text-[10px] font-mono text-zinc-400">{selectedNode.id}</span>
                  </div>

                  <div className="p-3 bg-[#131417] rounded-xl border border-white/[0.06] space-y-2">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold">Properties & Rules</span>
                    <pre className="text-[11px] text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(selectedNode.properties, null, 2)}
                    </pre>
                  </div>

                  {selectedNode.category === 'POLICY' && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1 text-rose-300">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Autonomous Guardrail Active</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-zinc-300">
                        Any campaign generated by Gemini 3.1 or n8n is strictly intercepted if discount exceeds 15%.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="pt-12 text-center text-zinc-500">
                  Click on any graph node to inspect its attributes and active triples.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-zinc-400 text-[11px]">
              <span>Graph Synchronized:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: TRIPLES TABLE */}
      {activeTab === 'triples' && (
        <div className="lunor-card rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="font-bold text-white text-sm">Cognee Knowledge Triples (ECL Schema)</h3>
              <p className="text-zinc-400 text-xs">Subject - Predicate - Object relationships parsed by the knowledge service</p>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-[#1A1B20] text-zinc-300 border border-white/[0.06] font-mono text-[11px]">
              {graphData?.triples?.length || 0} active triples
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06] text-zinc-500 text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Subject (Entity)</th>
                  <th className="py-2.5 px-3">Predicate (Relationship)</th>
                  <th className="py-2.5 px-3">Object (Target)</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-mono text-[11px]">
                {graphData?.triples?.map((t, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-3 text-white font-medium">{t.subject}</td>
                    <td className="py-3 px-3 text-[#00BAF2] font-semibold">[{t.predicate}]</td>
                    <td className="py-3 px-3 text-zinc-300">{t.object}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans">
                        Enforced
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: INGEST DOCUMENT FORM */}
      {activeTab === 'ingest' && (
        <div className="lunor-card rounded-2xl p-6 shadow-sm max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="font-bold text-white text-sm">Ingest Store Knowledge or Policy</h3>
              <p className="text-zinc-400 text-xs">Inject new operational rules, balance sheet data, or custom instructions into Cognee</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#1A1B20] text-zinc-300 border border-white/[0.06] rounded-xl">
              Sponsor: Cognee
            </span>
          </div>

          {ingestSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Knowledge successfully cognified and injected into the graph!</span>
            </div>
          )}

          <form onSubmit={handleIngest} className="space-y-4">
            <div>
              <label className="font-semibold text-zinc-400 block mb-1">Category</label>
              <select
                value={ingestCategory}
                onChange={e => setIngestCategory(e.target.value)}
                className="w-full bg-[#1A1B20] border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#00BAF2]"
              >
                <option value="POLICY">POLICY (Margin ceiling, discount rule, credit limit)</option>
                <option value="BALANCE_SHEET">BALANCE_SHEET (Working capital, daily sweep)</option>
                <option value="MACHINE_TELEMETRY">MACHINE_TELEMETRY (Soundbox 3.0, QR code)</option>
                <option value="MERCHANT_HABIT">MERCHANT_HABIT (Tone preference, peak hours)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-400 block mb-1">Document / Rule Title</label>
              <input
                type="text"
                value={ingestTitle}
                onChange={e => setIngestTitle(e.target.value)}
                placeholder="e.g. 'Dairy & Milk Items Zero-Discount Policy'"
                required
                className="w-full bg-[#1A1B20] border border-white/[0.08] rounded-xl px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#00BAF2]"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-400 block mb-1">Knowledge Content (Text / Rules / Limits)</label>
              <textarea
                rows={4}
                value={ingestContent}
                onChange={e => setIngestContent(e.target.value)}
                placeholder="e.g. 'Never apply discounts to dairy, milk, or packaged cold drinks as their gross retail margin is only 4%.' "
                required
                className="w-full bg-[#1A1B20] border border-white/[0.08] rounded-xl px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#00BAF2]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-[#00BAF2] hover:bg-cyan-400 text-slate-950 font-bold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Cognify & Add to Knowledge Graph</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}

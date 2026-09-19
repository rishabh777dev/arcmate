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
import { useTheme } from '../../context/ThemeContext';

const CATEGORY_COLORS = {
  MERCHANT: { bg: 'bg-[#ed6f5c]/10', border: 'border-[#ed6f5c]/40', text: 'text-[#ed6f5c]', dot: '#ed6f5c' },
  DEVICE: { bg: 'bg-[#6e7448]/15', border: 'border-[#6e7448]/40', text: 'text-[#6e7448]', dot: '#6e7448' },
  FINANCIAL: { bg: 'bg-[#e9b94a]/15', border: 'border-[#e9b94a]/40', text: 'text-[#e9b94a]', dot: '#e9b94a' },
  POLICY: { bg: 'bg-[#ed6f5c]/15', border: 'border-[#ed6f5c]/40', text: 'text-[#ed6f5c]', dot: '#ed6f5c' },
  COHORT: { bg: 'bg-[rgba(242,235,216,0.08)]', border: 'border-[rgba(242,235,216,0.2)]', text: 'text-[#f2ebd8]', dot: '#f2ebd8' },
  ANOMALY: { bg: 'bg-[#ed6f5c]/15', border: 'border-[#ed6f5c]/40', text: 'text-[#ed6f5c]', dot: '#ed6f5c' },
  ACTION: { bg: 'bg-[rgba(242,235,216,0.08)]', border: 'border-[rgba(242,235,216,0.2)]', text: 'text-[#c8c0a8]', dot: '#c8c0a8' }
};

export default function KnowledgeGraphView() {
  const { isDark } = useTheme();
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
      <div className="lunor-card p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <span className="corner tl"></span>
        <span className="corner tr"></span>
        <div>
          <div className="label-editorial text-[10px] mb-1">
            KNOWLEDGE TOPOLOGY & POLICY GRAPH
          </div>
          <h1 className="display-title text-2xl font-bold tracking-tight text-[#f2ebd8]">
            Store Rules & <em>Knowledge</em><span className="dot">.</span>
          </h1>
          <p className="lead-editorial text-xs text-[#9a9382] max-w-2xl mt-1">
            Visual knowledge map governing store operations, working capital, paired Soundbox hardware, and discount guardrails (strict 15% margin ceiling).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('graph')}
            className={`editorial-pill ${activeTab === 'graph' ? 'active' : ''}`}
          >
            Knowledge Map
          </button>
          <button
            onClick={() => setActiveTab('triples')}
            className={`editorial-pill ${activeTab === 'triples' ? 'active' : ''}`}
          >
            Rules & Policies ({graphData?.triples?.length || 3})
          </button>
          <button
            onClick={() => setActiveTab('ingest')}
            className={`editorial-pill ${activeTab === 'ingest' ? 'active' : ''}`}
          >
            <Plus className="w-3.5 h-3.5 text-[#ed6f5c]" />
            <span>Add Store Rule</span>
          </button>
        </div>
      </div>

      {/* VIEW: GRAPH CANVAS */}
      {activeTab === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left 8 Cols: Interactive SVG Graph */}
          <div className="lg:col-span-8 lunor-card rounded-2xl p-4 flex flex-col relative overflow-hidden h-[540px]">
            <span className="corner tl"></span>
            <span className="corner tr"></span>
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(242,235,216,0.06)] z-10">
              <div className="flex items-center gap-2 font-sans font-semibold text-[#f2ebd8]">
                <Share2 className="w-4 h-4 text-[#ed6f5c]" />
                <span>Entity-Concept-Link Graph Canvas</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-[#9a9382] font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ed6f5c]"></span> Merchant
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#e9b94a]"></span> Policy (15% Cap)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#6e7448]"></span> Device
                </span>
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="flex-1 w-full h-full relative flex items-center justify-center">
              {isLoading ? (
                <div className="flex items-center gap-2 text-[#9a9382] animate-pulse font-mono">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#ed6f5c]" />
                  <span>Loading Cognee Knowledge Graph...</span>
                </div>
              ) : (
                <svg className="w-full h-full" viewBox="0 0 680 440">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill={isDark ? "#6e6860" : "#a8a29e"} />
                    </marker>
                    <marker id="arrow-active" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#ed6f5c" />
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
                          stroke={isConnected ? '#ed6f5c' : (isDark ? 'rgba(242, 235, 216, 0.15)' : 'rgba(20, 18, 14, 0.15)')}
                          strokeWidth={isConnected ? 2 : 1.2}
                          strokeDasharray={isConnected ? 'none' : '4,3'}
                          markerEnd={isConnected ? 'url(#arrow-active)' : 'url(#arrow)'}
                        />
                        <text
                          x={(src.x + tgt.x) / 2}
                          y={(src.y + tgt.y) / 2 - 5}
                          fill={isConnected ? '#ed6f5c' : (isDark ? '#9a9382' : '#78716c')}
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
                          fill={isSelected ? (isDark ? '#1e1c18' : '#eee8dc') : (isDark ? '#161410' : '#ffffff')}
                          stroke={isSelected ? '#ed6f5c' : catTheme.dot}
                          strokeWidth={isSelected ? 2.5 : 1.5}
                          className="group-hover:scale-110 transition-transform"
                        />
                        {isSelected && (
                          <circle
                            r={node.category === 'MERCHANT' ? 34 : 26}
                            fill="none"
                            stroke="#ed6f5c"
                            strokeWidth="1"
                            opacity="0.4"
                            className="animate-ping"
                          />
                        )}
                        <text
                          y={3}
                          fill={isDark ? '#f2ebd8' : '#14120e'}
                          fontSize={node.category === 'MERCHANT' ? '10' : '9'}
                          fontWeight="bold"
                          textAnchor="middle"
                          className="select-none pointer-events-none font-mono"
                        >
                          {node.category === 'MERCHANT' ? 'SHOP' : node.category.slice(0, 3)}
                        </text>
                        <text
                          y={node.category === 'MERCHANT' ? 42 : 32}
                          fill={isSelected ? (isDark ? '#f2ebd8' : '#14120e') : (isDark ? '#9a9382' : '#57534e')}
                          fontSize="9"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          textAnchor="middle"
                          className="select-none pointer-events-none font-sans"
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
          <div className="lg:col-span-4 lunor-card rounded-2xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden">
            <span className="corner tl"></span>
            <span className="corner br"></span>
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(242,235,216,0.06)]">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#ed6f5c]" />
                  <h3 className="font-bold text-[#f2ebd8] font-sans">Entity Inspector</h3>
                </div>
                {selectedNode && (
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[selectedNode.category]?.bg} ${CATEGORY_COLORS[selectedNode.category]?.border} ${CATEGORY_COLORS[selectedNode.category]?.text}`}>
                    {selectedNode.category}
                  </span>
                )}
              </div>

              {selectedNode ? (
                <div className="pt-4 space-y-3">
                  <div>
                    <span className="text-[9px] text-[#6e6860] uppercase tracking-wider font-mono">Entity Label</span>
                    <h4 className="text-sm font-bold text-[#f2ebd8] mt-0.5 font-sans">{selectedNode.label}</h4>
                    <span className="text-[10px] font-mono text-[#9a9382]">{selectedNode.id}</span>
                  </div>

                  <div className="p-3 bg-[#12100d] rounded-xl border border-[rgba(242,235,216,0.06)] space-y-2">
                    <span className="text-[9px] text-[#9a9382] uppercase font-mono">Properties & Rules</span>
                    <pre className="text-[11px] text-[#c8c0a8] font-mono overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(selectedNode.properties, null, 2)}
                    </pre>
                  </div>

                  {selectedNode.category === 'POLICY' && (
                    <div className="p-3 bg-[#1e1c18] border border-[#ed6f5c]/30 rounded-xl space-y-1 text-[#ed6f5c]">
                      <div className="flex items-center gap-1.5 font-bold font-mono text-xs">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Autonomous Guardrail Active</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-[#9a9382] font-body">
                        Any campaign generated by Gemini 3.1 or n8n is strictly intercepted if discount exceeds 15%.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="pt-12 text-center text-[#6e6860] font-mono text-xs">
                  Click on any graph node to inspect its attributes and active triples.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[rgba(242,235,216,0.06)] flex items-center justify-between text-[#9a9382] text-[11px] font-mono">
              <span>Graph Synchronized:</span>
              <span className="font-semibold text-[#6e7448] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6e7448]"></span> Live
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: TRIPLES TABLE */}
      {activeTab === 'triples' && (
        <div className="lunor-card rounded-2xl p-6 shadow-sm space-y-4 relative overflow-hidden">
          <span className="corner tl"></span>
          <span className="corner tr"></span>
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(242,235,216,0.06)]">
            <div>
              <h3 className="font-bold text-[#f2ebd8] text-sm font-sans">Cognee Knowledge Triples (ECL Schema)</h3>
              <p className="text-[#9a9382] text-xs font-body">Subject - Predicate - Object relationships parsed by the knowledge service</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#1e1c18] text-[#c8c0a8] border border-[rgba(242,235,216,0.08)] font-mono text-[11px]">
              {graphData?.triples?.length || 0} active triples
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[rgba(242,235,216,0.06)] text-[#9a9382] text-[10px] font-mono uppercase tracking-wider">
                  <th className="py-2.5 px-3">Subject (Entity)</th>
                  <th className="py-2.5 px-3">Predicate (Relationship)</th>
                  <th className="py-2.5 px-3">Object (Target)</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(242,235,216,0.04)] font-mono text-[11px]">
                {graphData?.triples?.map((t, idx) => (
                  <tr key={idx} className="hover:bg-[rgba(242,235,216,0.02)] transition">
                    <td className="py-3 px-3 text-[#f2ebd8] font-medium">{t.subject}</td>
                    <td className="py-3 px-3 text-[#ed6f5c] font-semibold">[{t.predicate}]</td>
                    <td className="py-3 px-3 text-[#c8c0a8]">{t.object}</td>
                    <td className="py-3 px-3">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#6e7448]/15 text-[#6e7448] border border-[#6e7448]/30 font-mono">
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
        <div className="lunor-card rounded-2xl p-6 shadow-sm max-w-2xl mx-auto space-y-4 relative overflow-hidden">
          <span className="corner tl"></span>
          <span className="corner tr"></span>
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(242,235,216,0.06)]">
            <div>
              <h3 className="font-bold text-[#f2ebd8] text-sm font-sans">Ingest Store Knowledge or Policy</h3>
              <p className="text-[#9a9382] text-xs font-body">Inject new operational rules, balance sheet data, or custom instructions into Cognee</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 bg-[#1e1c18] text-[#c8c0a8] border border-[rgba(242,235,216,0.08)] rounded-xl">
              Engine: Cognee
            </span>
          </div>

          {ingestSuccess && (
            <div className="p-3 bg-[#6e7448]/15 border border-[#6e7448]/30 rounded-xl flex items-center gap-2 text-[#6e7448] font-mono text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Knowledge successfully cognified and injected into the graph!</span>
            </div>
          )}

          <form onSubmit={handleIngest} className="space-y-4">
            <div>
              <label className="font-medium text-[#c8c0a8] block mb-1 font-sans">Category</label>
              <select
                value={ingestCategory}
                onChange={e => setIngestCategory(e.target.value)}
                className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl px-3.5 py-2 text-[#f2ebd8] focus:outline-none focus:border-[#ed6f5c] font-sans text-xs"
              >
                <option value="POLICY">POLICY (Margin ceiling, discount rule, credit limit)</option>
                <option value="BALANCE_SHEET">BALANCE_SHEET (Working capital, daily sweep)</option>
                <option value="MACHINE_TELEMETRY">MACHINE_TELEMETRY (Soundbox 3.0, QR code)</option>
                <option value="MERCHANT_HABIT">MERCHANT_HABIT (Tone preference, peak hours)</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-[#c8c0a8] block mb-1 font-sans">Document / Rule Title</label>
              <input
                type="text"
                value={ingestTitle}
                onChange={e => setIngestTitle(e.target.value)}
                placeholder="e.g. 'Dairy & Milk Items Zero-Discount Policy'"
                required
                className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl px-3.5 py-2 text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] font-sans text-xs"
              />
            </div>

            <div>
              <label className="font-medium text-[#c8c0a8] block mb-1 font-sans">Knowledge Content (Text / Rules / Limits)</label>
              <textarea
                rows={4}
                value={ingestContent}
                onChange={e => setIngestContent(e.target.value)}
                placeholder="e.g. 'Never apply discounts to dairy, milk, or packaged cold drinks as their gross retail margin is only 4%.' "
                required
                className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl px-3.5 py-2 text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] font-sans text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-editorial btn-editorial-primary w-full justify-center text-xs py-2.5"
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

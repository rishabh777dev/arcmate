/**
 * Converts n8n workflow nodes and connections into React Flow format for the frontend canvas
 */
export function convertN8nToReactFlow(n8nWorkflow) {
  if (!n8nWorkflow || !n8nWorkflow.nodes) return { nodes: [], edges: [] };

  const rfNodes = n8nWorkflow.nodes.map(node => {
    let nodeStyle = 'bg-white border-blue-500 text-slate-800';
    let icon = 'Zap';

    if (node.type.includes('webhook') || node.type.includes('cron')) {
      nodeStyle = 'bg-blue-50 border-blue-600 text-blue-900 font-semibold';
      icon = 'PlayCircle';
    } else if (node.type.includes('if')) {
      nodeStyle = 'bg-amber-50 border-amber-500 text-amber-900';
      icon = 'ShieldCheck';
    } else if (node.type.includes('whatsApp') || node.type.includes('sms')) {
      nodeStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900';
      icon = 'MessageSquare';
    } else if (node.name.includes('Soundbox')) {
      nodeStyle = 'bg-cyan-50 border-cyan-500 text-cyan-900';
      icon = 'Volume2';
    }

    return {
      id: node.id,
      position: { x: node.position[0], y: node.position[1] },
      data: {
        label: node.name,
        type: node.type,
        icon,
        parameters: node.parameters
      },
      className: `p-3 rounded-xl border-2 shadow-sm ${nodeStyle} w-56 text-sm`
    };
  });

  const rfEdges = [];
  if (n8nWorkflow.connections) {
    Object.entries(n8nWorkflow.connections).forEach(([sourceNodeId, connectionGroup]) => {
      if (connectionGroup.main) {
        connectionGroup.main.forEach((outputList, outputIdx) => {
          outputList.forEach((targetObj, targetIdx) => {
            rfEdges.push({
              id: `edge_${sourceNodeId}_${targetObj.node}_${outputIdx}_${targetIdx}`,
              source: sourceNodeId,
              target: targetObj.node,
              animated: true,
              style: { stroke: '#00BAF2', strokeWidth: 2 }
            });
          });
        });
      }
    });
  }

  return { nodes: rfNodes, edges: rfEdges };
}

const fs = require('fs');

const filePath = 'src/components/AdminDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

const startIdx = lines.findIndex(l => l.includes('<span style={{ fontWeight: \'800\', color: \'var(--text-main)\' }}>{allBatchBids.length} Total Bids</span>'));

if (startIdx >= 0) {
  let tdStart = startIdx;
  while (tdStart > 0 && !lines[tdStart].includes('<td>')) {
    tdStart--;
  }

  let tdEnd = startIdx;
  while (tdEnd < lines.length && !lines[tdEnd].includes('</td>')) {
    tdEnd++;
  }

  // Find next column (Approval / status)
  let statusColEnd = tdEnd + 1;
  while (statusColEnd < lines.length && !lines[statusColEnd].includes('</td>')) {
    statusColEnd++;
  }

  console.log(`Replacing lines ${tdStart + 1} to ${statusColEnd + 1}`);

  const replacementLines = [
    `                                   <td>`,
    `                                     <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0284c7' }}>`,
    `                                       📦 Batch Container`,
    `                                     </div>`,
    `                                     <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600' }}>`,
    `                                       ({group.items.length} Sub-Indents)`,
    `                                     </div>`,
    `                                   </td>`,
    ``,
    `                                   <td>`,
    `                                     {(() => {`,
    `                                       const isAwarded = group.items.every((i) => i.status === 'Awarded');`,
    `                                       const awardedAlloc = (db.allocations || []).find((a) => group.items.some((item) => String(item.id) === String(a.rate_request_id) || String(item.request_no) === String(a.rate_request_id)));`,
    `                                       const awardedTrans = awardedAlloc ? (db.transporters || []).find((t) => t.id === awardedAlloc.transporter_id) : null;`,
    ``,
    `                                       return (`,
    `                                         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>`,
    `                                           {awardedAlloc ? (`,
    `                                             <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: '900' }}>`,
    `                                               🏆 Approved: {awardedTrans?.company_name || 'Transporter'}`,
    `                                             </div>`,
    `                                           ) : (`,
    `                                             <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: '800' }}>`,
    `                                               📦 Batch Container`,
    `                                             </div>`,
    `                                           )}`,
    `                                           <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>`,
    `                                             <button`,
    `                                               type="button"`,
    `                                               onClick={(e) => {`,
    `                                                 e.stopPropagation();`,
    `                                                 setSelectedRequestForParticularReport(firstItem);`,
    `                                               }}`,
    `                                               className="btn btn-secondary"`,
    `                                               style={{ padding: '3px 8px', fontSize: '0.72rem', border: '1px solid #0284c7', color: '#0284c7', borderRadius: '6px', fontWeight: '800' }}`,
    `                                             >`,
    `                                               📄 Particular Report`,
    `                                             </button>`,
    `                                             <button`,
    `                                               type="button"`,
    `                                               onClick={(e) => {`,
    `                                                 e.stopPropagation();`,
    `                                                 setSelectedAuditReportModal(firstItem);`,
    `                                               }}`,
    `                                               className="btn btn-secondary"`,
    `                                               style={{ padding: '3px 8px', fontSize: '0.72rem', border: '1px solid #38bdf8', color: '#38bdf8', borderRadius: '6px' }}`,
    `                                             >`,
    `                                               📋 Audit Log`,
    `                                             </button>`,
    `                                           </div>`,
    `                                         </div>`,
    `                                       );`,
    `                                     })()}`,
    `                                   </td>`
  ];

  lines.splice(tdStart, (statusColEnd - tdStart + 1), ...replacementLines);
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log('SUCCESSFULLY UPDATED PARENT BATCH ROW IN ADMIN DASHBOARD!');
} else {
  console.log('COULD NOT FIND allBatchBids START MARKER!');
}

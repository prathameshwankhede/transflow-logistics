const fs = require('fs');

const filePath = 'src/components/AdminDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

const startIdx = lines.findIndex(l => l.includes('<span style={{ fontWeight: \'700\', color: \'#475569\', fontSize: \'0.85rem\' }}>{bids.length} Transporter Bids</span>'));

if (startIdx >= 0) {
  // Find opening td (a few lines before)
  let tdStart = startIdx;
  while (tdStart > 0 && !lines[tdStart].includes('<td style={{ padding: \'12px 16px\' }}>')) {
    tdStart--;
  }

  // Find closing td (a few lines after)
  let tdEnd = startIdx;
  while (tdEnd < lines.length && !lines[tdEnd].includes('</td>')) {
    tdEnd++;
  }

  console.log(`FOUND TD RANGE: lines ${tdStart + 1} to ${tdEnd + 1}`);

  const replacementLines = [
    `                                                   <td style={{ padding: '12px 16px', minWidth: '230px' }}>`,
    `                                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>`,
    `                                                       {/* 📥 DIRECT TRANSPORTER QUOTES LIST */}`,
    `                                                       {bids.length > 0 ? (`,
    `                                                         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>`,
    `                                                           <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px' }}>`,
    `                                                             📥 {bids.length} Transporter Quote(s):`,
    `                                                           </div>`,
    `                                                           {bids.map((b, bIdx) => {`,
    `                                                             const trans = (db.transporters || []).find((t) => String(t.id) === String(b.transporter_id) || String(t.code) === String(b.transporter_id) || String(t.username) === String(b.transporter_id));`,
    `                                                             const isL1 = b.rate_per_unit === lowestRate;`,
    `                                                             return (`,
    `                                                               <div key={b.id || bIdx} style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>`,
    `                                                                 <span style={{ fontWeight: '800', color: '#1e293b' }}>`,
    `                                                                   🚚 {trans?.company_name || trans?.code || 'Transporter'}`,
    `                                                                 </span>`,
    `                                                                 <span style={{ fontWeight: '900', color: isL1 ? '#059669' : '#0284c7', background: isL1 ? '#dcfce7' : '#e0f2fe', padding: '1px 6px', borderRadius: '4px', border: isL1 ? '1px solid #16a34a' : '1px solid #7dd3fc' }}>`,
    `                                                                   ₹{Number(b.rate_per_unit).toLocaleString()}/MT {isL1 ? '🏆 L1' : ''}`,
    `                                                                 </span>`,
    `                                                               </div>`,
    `                                                             );`,
    `                                                           })}`,
    `                                                         </div>`,
    `                                                       ) : (`,
    `                                                         <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600', fontStyle: 'italic' }}>`,
    `                                                           ⏳ No quotes submitted yet`,
    `                                                         </div>`,
    `                                                       )}`,
    ``,
    `                                                       {/* 🔥 ACTIVE COUNTER RATE BADGE */}`,
    `                                                       {req.admin_counter_rate && (`,
    `                                                         <div style={{ fontSize: '0.74rem', background: '#fef3c7', color: '#d97706', border: '1px solid #f59e0b', padding: '3px 8px', borderRadius: '6px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>`,
    `                                                           🔥 Active Counter: ₹{(Number(req.admin_counter_rate) || 0).toLocaleString()}/MT`,
    `                                                         </div>`,
    `                                                       )}`,
    ``,
    `                                                       {/* ⚡ INSTANT COUNTER RATE ENTRY FORM */}`,
    `                                                       {req.status !== 'Awarded' && (`,
    `                                                         <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginTop: '2px' }}>`,
    `                                                           <input`,
    `                                                             type="number"`,
    `                                                             min="1"`,
    `                                                             placeholder="Counter ₹"`,
    `                                                             id={\`counter_input_\${req.id}\`}`,
    `                                                             defaultValue={req.admin_counter_rate || ''}`,
    `                                                             style={{ width: '90px', height: '28px', fontSize: '0.78rem', padding: '2px 6px', borderRadius: '6px', border: '1.5px solid #d97706', fontWeight: '800', background: '#ffffff', color: '#0f172a' }}`,
    `                                                           />`,
    `                                                           <button`,
    `                                                             type="button"`,
    `                                                             onClick={() => {`,
    `                                                               const inputEl = document.getElementById(\`counter_input_\${req.id}\`);`,
    `                                                               const val = parseFloat(inputEl?.value);`,
    `                                                               if (!val || isNaN(val) || val <= 0) {`,
    `                                                                 alert('Please enter a valid Counter Rate per MT (e.g. 2100).');`,
    `                                                                 return;`,
    `                                                               }`,
    `                                                               handleSetAdminCounterRate(req, val);`,
    `                                                             }}`,
    `                                                             className="btn"`,
    `                                                             style={{ height: '28px', padding: '2px 8px', fontSize: '0.72rem', background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '900', cursor: 'pointer', whiteSpace: 'nowrap' }}`,
    `                                                             title="Send Counter Rate / Target Negotiation Rate to Transporters"`,
    `                                                           >`,
    `                                                             🔥 Counter`,
    `                                                           </button>`,
    `                                                         </div>`,
    `                                                       )}`,
    `                                                     </div>`,
    `                                                   </td>`
  ];

  lines.splice(tdStart, (tdEnd - tdStart + 1), ...replacementLines);
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log('SUCCESSFULLY REPLACED LINES IN ADMIN DASHBOARD!');
} else {
  console.log('COULD NOT FIND START MARKER IN FILE!');
}

const fs = require('fs');

const filePath = 'src/components/AdminDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const target = `                                                  <td style={{ padding: '12px 16px' }}>\n                                                    </div>\n                                                  </td>`;

const replacement = `                                                  <td style={{ padding: '12px 16px' }}>
                                                    <div>
                                                      <span style={{ fontWeight: '700', color: '#475569', fontSize: '0.85rem' }}>{bids.length} Transporter Bids</span>
                                                      {lowestRate !== null && (
                                                        <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                                          💰 Lowest L1 Quote: ₹{(lowestRate || 0).toLocaleString()}/MT
                                                        </div>
                                                      )}
                                                      {req.admin_counter_rate && (
                                                        <div style={{ fontSize: '0.74rem', background: '#fef3c7', color: '#d97706', border: '1px solid #f59e0b', padding: '2px 8px', borderRadius: '6px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                                          🔥 Counter: ₹{(Number(req.admin_counter_rate) || 0).toLocaleString()}/MT
                                                        </div>
                                                      )}

                                                      {/* ⚡ INSTANT ADMIN COUNTER RATE SETTER / BROADCASTER */}
                                                      {req.status !== 'Awarded' && (
                                                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginTop: '6px' }}>
                                                          <input
                                                            type="number"
                                                            min="1"
                                                            placeholder="Counter ₹"
                                                            id={\`counter_input_\${req.id}\`}
                                                            defaultValue={req.admin_counter_rate || ''}
                                                            style={{ width: '85px', height: '28px', fontSize: '0.78rem', padding: '2px 6px', borderRadius: '6px', border: '1.5px solid #d97706', fontWeight: '800', background: '#ffffff', color: '#0f172a' }}
                                                          />
                                                          <button
                                                            type="button"
                                                            onClick={() => {
                                                              const inputEl = document.getElementById(\`counter_input_\${req.id}\`);
                                                              const val = parseFloat(inputEl?.value);
                                                              if (!val || isNaN(val) || val <= 0) {
                                                                alert('Please enter a valid Counter Rate per MT (e.g. 2100).');
                                                                return;
                                                              }
                                                              handleSetAdminCounterRate(req, val);
                                                            }}
                                                            className="btn"
                                                            style={{ height: '28px', padding: '2px 8px', fontSize: '0.72rem', background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '900', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                                            title="Send Counter Rate / Target Negotiation Rate to Transporters"
                                                          >
                                                            🔥 Counter
                                                          </button>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </td>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('SUCCESSFULLY REPLACED CELL IN ADMIN DASHBOARD!');
} else {
  console.log('TARGET NOT FOUND BY CRLF/LF CONVERTING...');
  const normContent = content.replace(/\r\n/g, '\n');
  const normTarget = target.replace(/\r\n/g, '\n');
  if (normContent.includes(normTarget)) {
    const updated = normContent.replace(normTarget, replacement);
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('SUCCESSFULLY REPLACED AFTER NORMALIZING CRLF/LF!');
  } else {
    console.log('STILL NOT FOUND. CHECKING AROUND INDEX...');
  }
}

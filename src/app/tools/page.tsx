'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { getAllTools, getAllCategories } from '@/lib/toolsService';
import { AITool, ToolCategory } from '@/data/tools';

const CATEGORY_COLORS: Record<string, string> = {
  'Audit Data Analytics':'#6c5ce7','Audit Management':'#a29bfe','General Ledger & ERP':'#00cec9',
  'AP/AR Automation':'#00b894','Communication & Collaboration':'#fd79a8','Video Conferencing & Webinars':'#e17055',
  'CRM & Client Management':'#fdcb6e','Project Management':'#0984e3','Knowledge Management':'#74b9ff',
  'Business Intelligence & Analytics':'#55efc4','Business Intelligence & Reporting':'#00cec9',
  'Database & Data Warehousing':'#636e72','HR & Talent Management':'#fd79a8','Cybersecurity':'#e17055',
  'Generative AI & Automation':'#a29bfe','Customer Service & Support':'#00cec9','Marketing Automation':'#fdcb6e',
  'Financial Close & Reconciliation':'#6c5ce7','Risk Management & Compliance':'#e17055','Risk & Compliance':'#ff7675',
  'Data Analytics & Visualization':'#55efc4','Contract Management':'#74b9ff','Expense Management':'#00b894',
  'Sales Enablement':'#fd79a8','File Storage & Document Management':'#636e72','Website & CMS':'#0984e3',
  'Tax Compliance':'#fdcb6e','Tax Provision & Research':'#e17055','Time Tracking & Billing':'#00b894',
  'Time Tracking & Productivity':'#6c5ce7','SEO & Digital Marketing':'#a29bfe','Social Media Management':'#fd79a8',
  'Document Management':'#636e72','Accounting & Finance':'#00cec9','Data Governance & Privacy':'#74b9ff',
  'Fraud Detection & Forensics':'#e17055','Learning & Development':'#fdcb6e',
};

function getCatColor(cat: string): string { return CATEGORY_COLORS[cat] ?? '#636e72'; }
function getAvgRating(tool: AITool): number | null {
  if (!tool.ratings.length) return null;
  return tool.ratings.reduce((s, r) => s + r.score, 0) / tool.ratings.length;
}

function TierPill({ tier }: { tier: string }) {
  const c: Record<string,{bg:string;text:string}> = {
    free:{bg:'#00b89420',text:'#00b894'},starter:{bg:'#0984e320',text:'#74b9ff'},
    professional:{bg:'#6c5ce720',text:'#a29bfe'},enterprise:{bg:'#fd79a820',text:'#fd79a8'},
  };
  const s = c[tier] ?? c.professional;
  return (
    <span style={{background:s.bg,color:s.text,fontSize:10,fontWeight:600,letterSpacing:0.4,padding:'2px 7px',borderRadius:20,flexShrink:0,marginLeft:6}}>
      {tier}
    </span>
  );
}

function ToolCard({ tool, onClick }: { tool: AITool; onClick: () => void }) {
  const avg = getAvgRating(tool);
  return (
    <div onClick={onClick} style={{background:'#131320',border:'1px solid #ffffff12',borderRadius:10,padding:14,cursor:'pointer',transition:'all 0.2s'}}
      onMouseEnter={e=>{const d=e.currentTarget as HTMLDivElement;d.style.background='#1e1e30';d.style.borderColor='#ffffff22';d.style.transform='translateY(-1px)'}}
      onMouseLeave={e=>{const d=e.currentTarget as HTMLDivElement;d.style.background='#131320';d.style.borderColor='#ffffff12';d.style.transform='none'}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:8}}>
        <div style={{fontSize:13.5,fontWeight:500,color:'#e8e8f0',lineHeight:1.3}}>{tool.name}</div>
        <TierPill tier={tool.pricingTier}/>
      </div>
      <div style={{fontSize:11.5,color:'#9090a8',lineHeight:1.5,marginBottom:10,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'} as React.CSSProperties}>
        {tool.description}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:5,flexWrap:'wrap'}}>
        {tool.bestFor.map(s=>(
          <span key={s} style={{fontSize:10,color:'#5a5a72',background:'#1a1a24',border:'1px solid #ffffff12',padding:'2px 7px',borderRadius:4}}>{s}</span>
        ))}
        {avg && <span style={{fontSize:11,color:'#fdcb6e',marginLeft:'auto'}}>⭐ {avg.toFixed(1)}</span>}
      </div>
    </div>
  );
}

function DetailPanel({ tool, onClose, allTools }: { tool: AITool; onClose: () => void; allTools: AITool[] }) {
  const similar = allTools.filter(t => t.id !== tool.id && t.category === tool.category).slice(0, 3);
  const color = getCatColor(tool.category);
  return (
    <div style={{width:360,flexShrink:0,background:'#111118',borderLeft:'1px solid #ffffff12',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{padding:20,overflowY:'auto',flex:1}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
          <div>
            <div style={{fontSize:18,fontWeight:600,color:'#e8e8f0',lineHeight:1.2}}>{tool.name}</div>
            <div style={{fontSize:11.5,color,marginTop:4}}>{tool.category}</div>
          </div>
          <button onClick={onClose} style={{background:'none',border:'1px solid #ffffff12',borderRadius:6,padding:'4px 10px',fontSize:12,color:'#9090a8',cursor:'pointer',fontFamily:'inherit'}}>✕</button>
        </div>
        <p style={{fontSize:13,color:'#9090a8',lineHeight:1.6,marginBottom:16}}>{tool.detailedDescription}</p>
        {tool.ratings.length > 0 && (
          <div style={{marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:600,letterSpacing:1,color:'#5a5a72',textTransform:'uppercase',marginBottom:6}}>Ratings</div>
            <div style={{display:'flex',gap:8}}>
              {tool.ratings.map(r=>(
                <div key={r.source} style={{flex:1,background:'#1a1a24',border:'1px solid #ffffff12',borderRadius:8,padding:8,textAlign:'center'}}>
                  <div style={{fontSize:20,fontWeight:600,color:'#fdcb6e'}}>⭐ {r.score}</div>
                  <div style={{fontSize:10,color:'#5a5a72',marginTop:2}}>{r.source}</div>
                  <div style={{fontSize:10,color:'#5a5a72'}}>{r.reviewCount.toLocaleString()} reviews</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:600,letterSpacing:1,color:'#5a5a72',textTransform:'uppercase',marginBottom:6}}>Decision guide</div>
          <div style={{background:'#00b89410',border:'1px solid #00b89430',borderRadius:8,padding:10,marginBottom:8}}>
            <div style={{fontSize:11,fontWeight:600,color:'#00b894',marginBottom:3}}>✓ Use when</div>
            <div style={{fontSize:12,color:'#00b894',lineHeight:1.5}}>{tool.whenToUse}</div>
          </div>
          <div style={{background:'#e1705510',border:'1px solid #e1705530',borderRadius:8,padding:10}}>
            <div style={{fontSize:11,fontWeight:600,color:'#e17055',marginBottom:3}}>✗ Avoid when</div>
            <div style={{fontSize:12,color:'#e17055',lineHeight:1.5}}>{tool.whenNotToUse}</div>
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:600,letterSpacing:1,color:'#5a5a72',textTransform:'uppercase',marginBottom:6}}>Key features</div>
          <div style={{display:'flex',flexDirection:'column',gap:5}}>
            {tool.keyFeatures.map((f,i)=>(
              <div key={i} style={{fontSize:12,color:'#9090a8',display:'flex',alignItems:'flex-start',gap:6}}>
                <span style={{color:'#a29bfe',flexShrink:0,marginTop:1}}>→</span>{f}
              </div>
            ))}
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:600,letterSpacing:1,color:'#5a5a72',textTransform:'uppercase',marginBottom:6}}>Fit</div>
          <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
            {tool.bestFor.map(s=>(<span key={s} style={{fontSize:10,color:'#5a5a72',background:'#1a1a24',border:'1px solid #ffffff12',padding:'2px 7px',borderRadius:4}}>{s}</span>))}
            <TierPill tier={tool.pricingTier}/>
            <span style={{fontSize:10,color:'#9090a8',background:'#1a1a24',border:'1px solid #ffffff12',padding:'2px 7px',borderRadius:4}}>{tool.learningCurve} curve</span>
            <span style={{fontSize:10,color:'#9090a8',background:'#1a1a24',border:'1px solid #ffffff12',padding:'2px 7px',borderRadius:4}}>{tool.implementationTime}</span>
          </div>
        </div>
        {similar.length > 0 && (
          <div style={{marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:600,letterSpacing:1,color:'#5a5a72',textTransform:'uppercase',marginBottom:6}}>Similar tools</div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {similar.map(s=>(
                <Link key={s.id} href={`/tools/${s.id}`} style={{textDecoration:'none'}}>
                  <div style={{background:'#1a1a24',border:'1px solid #ffffff12',borderRadius:8,padding:'8px 10px',cursor:'pointer'}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='#ffffff22'}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='#ffffff12'}}>
                    <div style={{fontSize:12.5,fontWeight:500,color:'#e8e8f0'}}>{s.name}</div>
                    <div style={{fontSize:11,color:'#5a5a72',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <a href={tool.website} target="_blank" rel="noopener noreferrer"
            style={{display:'inline-flex',alignItems:'center',gap:6,background:'#6c5ce7',color:'#fff',borderRadius:8,padding:'9px 16px',fontSize:13,fontWeight:500,textDecoration:'none'}}>
            Visit {tool.name} →
          </a>
          <Link href={`/tools/${tool.id}`}
            style={{display:'inline-flex',alignItems:'center',gap:6,background:'transparent',color:'#9090a8',borderRadius:8,border:'1px solid #ffffff22',padding:'9px 16px',fontSize:13,fontWeight:500,textDecoration:'none'}}>
            Full profile
          </Link>
        </div>
      </div>
    </div>
  );
}

function UniverseView({ categories, tools, onCategoryClick, selectedCat }: {
  categories: ToolCategory[]; tools: AITool[]; onCategoryClick: (cat: ToolCategory) => void; selectedCat: ToolCategory | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 600 });
  useEffect(() => {
    const update = () => { if (containerRef.current) setDims({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight }) };
    update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
  }, []);
  const positions = useMemo(() => {
    const cols = Math.ceil(Math.sqrt(categories.length * 1.5));
    const rows = Math.ceil(categories.length / cols);
    return categories.map((_, i) => {
      const col = i % cols; const row = Math.floor(i / cols);
      const jx = ((i * 137 + 17) % 200 - 100) / 900;
      const jy = ((i * 251 + 43) % 200 - 100) / 900;
      return { x: (0.08 + (col / (cols - 1)) * 0.84 + jx) * dims.w, y: (0.08 + (row / ((rows - 1) || 1)) * 0.78 + jy) * dims.h };
    });
  }, [categories, dims]);
  return (
    <div ref={containerRef} style={{position:'relative',width:'100%',height:'100%',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 30% 40%, #6c5ce708 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, #00cec908 0%, transparent 60%)',pointerEvents:'none'}}/>
      {categories.map((cat, i) => {
        const count = tools.filter(t => t.category === cat).length;
        const pos = positions[i]; const r = Math.max(44, Math.min(76, 30 + count * 4.5));
        const color = getCatColor(cat); const isActive = selectedCat === cat;
        const shortName = cat.length > 20 ? cat.split(' ').slice(0, 2).join(' ') : cat;
        return (
          <div key={cat} onClick={() => onCategoryClick(cat)}
            style={{position:'absolute',left:pos.x,top:pos.y,width:r*2,height:r*2,transform:`translate(-50%,-50%) scale(${isActive?1.15:1})`,borderRadius:'50%',background:isActive?`${color}30`:`${color}15`,border:`1px solid ${isActive?color:color+'44'}`,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',zIndex:isActive?20:1,boxShadow:isActive?`0 0 24px ${color}30`:'none'}}
            onMouseEnter={e=>{if(!isActive){const d=e.currentTarget as HTMLDivElement;d.style.transform='translate(-50%,-50%) scale(1.08)';d.style.zIndex='10'}}}
            onMouseLeave={e=>{if(!isActive){const d=e.currentTarget as HTMLDivElement;d.style.transform='translate(-50%,-50%) scale(1)';d.style.zIndex='1'}}}>
            <div style={{fontSize:10.5,fontWeight:500,textAlign:'center',padding:'0 8px',lineHeight:1.3,color,pointerEvents:'none',userSelect:'none'}}>{shortName}</div>
            <div style={{fontSize:9.5,color,opacity:.7,marginTop:2,pointerEvents:'none'}}>{count}</div>
          </div>
        );
      })}
      <div style={{position:'absolute',bottom:16,left:'50%',transform:'translateX(-50%)',display:'flex',gap:14,background:'#111118',border:'1px solid #ffffff12',borderRadius:8,padding:'7px 14px',flexWrap:'wrap',justifyContent:'center'}}>
        {[{label:'Free',color:'#00b894'},{label:'Starter',color:'#74b9ff'},{label:'Professional',color:'#a29bfe'},{label:'Enterprise',color:'#fd79a8'}].map(l=>(
          <div key={l.label} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'#5a5a72'}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:l.color}}/>{l.label}
          </div>
        ))}
        <div style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'#5a5a72'}}>
          <div style={{width:14,height:7,borderRadius:4,background:'#6c5ce730',border:'1px solid #6c5ce7'}}/>Size = tool count
        </div>
      </div>
    </div>
  );
}

export default function AllToolsPage() {
  const allTools = useMemo(() => getAllTools(), []);
  const allCategories = useMemo(() => getAllCategories(), []);
  const [view, setView] = useState<'grid'|'universe'>('grid');
  const [selectedCat, setSelectedCat] = useState<ToolCategory|null>(null);
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name'|'rating'|'tier'>('name');
  const [selectedTool, setSelectedTool] = useState<AITool|null>(null);

  const filteredTools = useMemo(() => {
    let tools = [...allTools];
    if (searchQuery) { const q = searchQuery.toLowerCase(); tools = tools.filter(t => t.name.toLowerCase().includes(q)||t.description.toLowerCase().includes(q)||t.category.toLowerCase().includes(q)||t.keyFeatures.some(f=>f.toLowerCase().includes(q))) }
    if (selectedCat) tools = tools.filter(t => t.category === selectedCat);
    if (selectedSize !== 'all') tools = tools.filter(t => t.bestFor.includes(selectedSize as any));
    if (selectedTier !== 'all') tools = tools.filter(t => t.pricingTier === selectedTier);
    return tools;
  }, [allTools, searchQuery, selectedCat, selectedSize, selectedTier]);

  const sortedTools = useMemo(() => {
    const t = [...filteredTools];
    if (sortBy === 'name') return t.sort((a,b)=>a.name.localeCompare(b.name));
    if (sortBy === 'rating') return t.sort((a,b)=>(getAvgRating(b)??0)-(getAvgRating(a)??0));
    if (sortBy === 'tier') { const o: Record<string,number>={free:0,starter:1,professional:2,enterprise:3}; return t.sort((a,b)=>o[a.pricingTier]-o[b.pricingTier]) }
    return t;
  }, [filteredTools, sortBy]);

  const grouped = useMemo(() => {
    const g: Record<string,AITool[]> = {};
    sortedTools.forEach(t => { if (!g[t.category]) g[t.category]=[]; g[t.category].push(t) });
    return g;
  }, [sortedTools]);

  const catList = useMemo(() => Object.keys(grouped).sort(), [grouped]);
  const catCounts = useMemo(() => { const c: Record<string,number>={}; allTools.forEach(t=>{c[t.category]=(c[t.category]||0)+1}); return c }, [allTools]);
  const handleUniverseClick = useCallback((cat: ToolCategory) => { setSelectedCat(prev=>prev===cat?null:cat); setView('grid') }, []);

  const SIZES = ['all','small','medium','large','enterprise'];
  const TIERS = ['all','free','starter','professional','enterprise'];
  const TIER_COLORS: Record<string,string> = {free:'#00b894',starter:'#74b9ff',professional:'#a29bfe',enterprise:'#fd79a8',all:'#9090a8'};

  return (
    <div style={{display:'flex',flexDirection:'column',height:'calc(100vh - 65px)',background:'#0a0a0f',color:'#e8e8f0',overflow:'hidden'}}>
      {/* TOP BAR */}
      <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 20px',borderBottom:'1px solid #ffffff12',background:'#0a0a0f',flexShrink:0,zIndex:10}}>
        <div style={{fontSize:14,fontWeight:600,letterSpacing:-0.3,color:'#e8e8f0',whiteSpace:'nowrap'}}>Stack<span style={{color:'#a29bfe'}}>Match</span></div>
        <div style={{flex:1,maxWidth:400,position:'relative'}}>
          <span style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'#5a5a72',fontSize:14}}>⌕</span>
          <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search tools, categories, features..."
            style={{width:'100%',background:'#1a1a24',border:'1px solid #ffffff12',borderRadius:8,padding:'7px 12px 7px 30px',fontSize:13,color:'#e8e8f0',fontFamily:'inherit',outline:'none'}}/>
        </div>
        <div style={{display:'flex',gap:5,marginLeft:'auto'}}>
          {(['grid','universe'] as const).map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{background:view===v?'#6c5ce7':'#1a1a24',border:`1px solid ${view===v?'#6c5ce7':'#ffffff12'}`,borderRadius:6,padding:'5px 12px',fontSize:12,color:view===v?'#fff':'#9090a8',cursor:'pointer',fontFamily:'inherit',transition:'all .15s'}}>
              {v==='grid'?'⊞ Grid':'◉ Universe'}
            </button>
          ))}
        </div>
        <span style={{fontSize:12,color:'#5a5a72',padding:'4px 10px',border:'1px solid #ffffff12',borderRadius:20,whiteSpace:'nowrap'}}>{sortedTools.length} tools</span>
      </div>

      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* SIDEBAR */}
        <div style={{width:216,flexShrink:0,background:'#111118',borderRight:'1px solid #ffffff12',overflowY:'auto',padding:'10px 0'}}>
          <div style={{padding:'4px 0 8px'}}>
            <div style={{fontSize:10,fontWeight:600,letterSpacing:'1.2px',color:'#5a5a72',padding:'6px 16px',textTransform:'uppercase'}}>Company size</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:5,padding:'4px 14px'}}>
              {SIZES.map(s=>(
                <button key={s} onClick={()=>setSelectedSize(s)} style={{fontSize:11,padding:'3px 9px',borderRadius:20,border:`1px solid ${selectedSize===s?'#6c5ce7':'#ffffff12'}`,color:selectedSize===s?'#a29bfe':'#5a5a72',background:selectedSize===s?'#6c5ce722':'none',cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize'}}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{padding:'4px 0 8px'}}>
            <div style={{fontSize:10,fontWeight:600,letterSpacing:'1.2px',color:'#5a5a72',padding:'6px 16px',textTransform:'uppercase'}}>Pricing</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:5,padding:'4px 14px'}}>
              {TIERS.map(t=>{const c=TIER_COLORS[t];return(
                <button key={t} onClick={()=>setSelectedTier(t)} style={{fontSize:11,padding:'3px 9px',borderRadius:20,border:`1px solid ${selectedTier===t?c:'#ffffff12'}`,color:selectedTier===t?c:'#5a5a72',background:selectedTier===t?`${c}22`:'none',cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize'}}>{t}</button>
              )})}
            </div>
          </div>
          <div style={{height:1,background:'#ffffff12',margin:'8px 16px'}}/>
          <div style={{padding:'4px 0'}}>
            <div style={{fontSize:10,fontWeight:600,letterSpacing:'1.2px',color:'#5a5a72',padding:'6px 16px 4px',textTransform:'uppercase'}}>Categories</div>
            <div onClick={()=>setSelectedCat(null)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'5px 16px',fontSize:12.5,cursor:'pointer',color:selectedCat===null?'#a29bfe':'#9090a8',background:selectedCat===null?'#1e1e30':'none'}}>
              <div style={{display:'flex',alignItems:'center'}}><div style={{width:7,height:7,borderRadius:'50%',background:'#6c5ce7',marginRight:7}}/> All Categories</div>
              <span style={{fontSize:11,color:selectedCat===null?'#6c5ce7':'#5a5a72',fontFamily:'monospace'}}>{allTools.length}</span>
            </div>
            {allCategories.sort().map(cat=>(
              <div key={cat} onClick={()=>setSelectedCat(prev=>prev===cat?null:cat)}
                style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'4px 16px',fontSize:12,cursor:'pointer',color:selectedCat===cat?'#e8e8f0':'#9090a8',background:selectedCat===cat?'#1e1e30':'none'}}
                onMouseEnter={e=>{if(selectedCat!==cat)(e.currentTarget as HTMLDivElement).style.background='#1a1a24'}}
                onMouseLeave={e=>{if(selectedCat!==cat)(e.currentTarget as HTMLDivElement).style.background='none'}}>
                <div style={{display:'flex',alignItems:'center',minWidth:0}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:getCatColor(cat),marginRight:7,flexShrink:0}}/>
                  <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:11.5}}>{cat}</span>
                </div>
                <span style={{fontSize:10.5,color:selectedCat===cat?'#6c5ce7':'#5a5a72',fontFamily:'monospace',marginLeft:4}}>{catCounts[cat]??0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div style={{flex:1,display:'flex',overflow:'hidden'}}>
          <div style={{flex:1,overflowY:view==='grid'?'auto':'hidden',position:'relative'}}>
            {view === 'grid' && (
              <>
                <div style={{padding:'14px 20px 12px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #ffffff12',background:'#0a0a0f',position:'sticky',top:0,zIndex:5}}>
                  <span style={{fontSize:13,color:'#9090a8'}}>
                    {selectedCat ? <><span style={{color:'#e8e8f0',fontWeight:500}}>{selectedCat}</span> — {sortedTools.length} tools</> : <><span style={{color:'#e8e8f0',fontWeight:500}}>{sortedTools.length}</span> tools</>}
                  </span>
                  <select value={sortBy} onChange={e=>setSortBy(e.target.value as typeof sortBy)} style={{background:'#1a1a24',border:'1px solid #ffffff12',borderRadius:6,padding:'4px 8px',fontSize:12,color:'#9090a8',fontFamily:'inherit',outline:'none',cursor:'pointer'}}>
                    <option value="name">Sort: Name</option>
                    <option value="rating">Sort: Rating</option>
                    <option value="tier">Sort: Price</option>
                  </select>
                </div>
                {catList.length === 0 ? (
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:200,color:'#5a5a72',fontSize:13,gap:8}}>
                    <span>No tools match your filters</span>
                    <span style={{fontSize:11}}>Try adjusting the category, size, or pricing filter</span>
                  </div>
                ) : catList.map(cat=>{
                  const color=getCatColor(cat);
                  return (
                    <div key={cat} style={{padding:20}}>
                      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                        <span style={{fontSize:11,fontWeight:600,letterSpacing:0.5,padding:'3px 10px',borderRadius:20,background:`${color}20`,color}}>{cat}</span>
                        <span style={{fontSize:11,color:'#5a5a72'}}>{grouped[cat].length} tools</span>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))',gap:10}}>
                        {grouped[cat].map(tool=>(
                          <ToolCard key={tool.id} tool={tool} onClick={()=>setSelectedTool(prev=>prev?.id===tool.id?null:tool)}/>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            {view === 'universe' && (
              <div style={{width:'100%',height:'100%'}}>
                <UniverseView categories={allCategories} tools={allTools} onCategoryClick={handleUniverseClick} selectedCat={selectedCat}/>
              </div>
            )}
          </div>
          {selectedTool && <DetailPanel tool={selectedTool} onClose={()=>setSelectedTool(null)} allTools={allTools}/>}
        </div>
      </div>
    </div>
  );
}

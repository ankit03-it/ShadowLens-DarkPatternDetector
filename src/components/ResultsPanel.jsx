import { useEffect, useState } from 'react';

function ResultsPanel({ data }) {
  const [barWidths, setBarWidths] = useState(data.breakdown.map(() => 0));

  useEffect(() => {
    data.breakdown.forEach((item, idx) => {
      setTimeout(() => {
        setBarWidths(prev => {
          const newWidths = [...prev];
          newWidths[idx] = item.severity;
          return newWidths;
        });
      }, 150 + idx * 110);
    });
  }, [data]);

  const getTagColor = (tag) => {
    if (tag.includes('breach') || tag.includes('scarcity')) return 'red';
    if (tag.includes('trick') || tag.includes('hidden')) return 'orange';
    if (tag.includes('ok') || tag.includes('https')) return 'green';
    return 'orange';
  };

  return (
    <div className="flex flex-col gap-2 text-left mt-1" style={{ maxWidth: '340px' }}>
      {/* Score Trio */}
      <div className="grid grid-cols-3 gap-1.75">
        <div className="rounded-lg p-2.5 text-center bg-white/4 border border-redError/30 bg-redError/7">
          <div className="font-serif text-4xl font-black text-white">{data.patterns}</div>
          <div className="text-tiny text-white/30 uppercase tracking-widest mt-0.75">Patterns</div>
        </div>
        <div className="rounded-lg p-2.5 text-center bg-white/4 border border-orange/30 bg-orange/6">
          <div className="font-serif text-4xl font-black text-white">{data.riskScore}</div>
          <div className="text-tiny text-white/30 uppercase tracking-widest mt-0.75">Risk score</div>
        </div>
        <div className="rounded-lg p-2.5 text-center bg-white/4 border border-greenAccent/30 bg-greenAccent/6">
          <div className="font-serif text-4xl font-black text-white">{data.compliant}</div>
          <div className="text-tiny text-white/30 uppercase tracking-widest mt-0.75">Compliant</div>
        </div>
      </div>

      {/* Chart Panel */}
      <div className="bg-white/3 border border-white/7 rounded-lg p-3">
        <div className="text-tiny font-mono text-white/22 tracking-wider uppercase mb-2.25">// severity breakdown</div>
        
        {data.breakdown.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.75 mb-1.25">
            <span className="text-tiny text-white/35 w-18 flex-shrink-0 font-mono">{item.name}</span>
            <div className="flex-1 h-1.25 bg-white/6 rounded-xs overflow-hidden">
              <div
                className="h-full rounded-xs transition-all"
                style={{
                  background: item.color,
                  width: `${barWidths[idx]}%`,
                  transitionDuration: '1100ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              ></div>
            </div>
            <span className="text-tiny text-white/30 w-6 text-right font-mono">{item.severity}%</span>
          </div>
        ))}
      </div>

      {/* AI Panel */}
      <div className="bg-white/3 border border-white/7 rounded-lg p-3">
        <div className="flex items-center gap-1.5 mb-2 text-tiny font-mono text-white/22 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-purple animate-pulseSlow"></div>
          AI forensic report
        </div>
        
        <div className="text-base leading-relaxed text-white/42 font-light mb-2">
          {data.report.split(' — ').map((part, idx) => (
            <span key={idx}>
              {part.split(/(\*\*[^*]+\*\*)/g).map((segment, i) => 
                segment.startsWith('**') ? (
                  <strong key={i} className="text-white/75 font-medium">
                    {segment.slice(2, -2)}
                  </strong>
                ) : (
                  segment
                )
              )}
              {idx < data.report.split(' — ').length - 1 && ' — '}
            </span>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1.25">
          {data.tags.map((tag, idx) => {
            const tagColor = getTagColor(tag);
            const colorClasses = {
              red: 'text-red border-red/30 bg-red/7',
              orange: 'text-orange border-orange/30 bg-orange/7',
              green: 'text-greenAccent border-greenAccent/30 bg-greenAccent/7'
            };
            
            return (
              <span 
                key={idx} 
                className={`px-2.25 py-0.75 rounded-full text-tiny font-mono border ${colorClasses[tagColor]}`}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ResultsPanel;

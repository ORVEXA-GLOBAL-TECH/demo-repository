import React from 'react';

export function BarChart({ data = [], height = 180 }) {
  if (!data || data.length === 0) return null;
  const maxValue = Math.max(...data.map(d => Math.max(d.target || 0, d.achieved || 0)));

  return (
    <div style={{ height: `${height}px`, display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '10px 0 20px' }}>
      {data.map((item, idx) => {
        const achievedPct = maxValue ? (item.achieved / maxValue) * 100 : 0;
        const targetPct = maxValue ? (item.target / maxValue) * 100 : 0;

        return (
          <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '80%', width: '100%', justifyContent: 'center' }}>
              {/* Target Bar */}
              <div
                style={{
                  width: '12px',
                  height: `${targetPct}%`,
                  backgroundColor: '#e2e8f0',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.6s ease'
                }}
                title={`Target: ₹${item.target?.toLocaleString()}`}
              />
              {/* Achieved Bar */}
              <div
                style={{
                  width: '16px',
                  height: `${achievedPct}%`,
                  backgroundColor: item.achieved >= item.target ? '#16a34a' : '#2563eb',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.6s ease',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
                }}
                title={`Achieved: ₹${item.achieved?.toLocaleString()}`}
              />
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px', fontWeight: '700', whiteSpace: 'nowrap' }}>
              {item.month ? item.month.split(' ')[0] : item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DoughnutChart({ segments = [], size = 160 }) {
  const total = segments.reduce((sum, s) => sum + (s.value || 0), 0);
  let accumulatedAngle = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
        {segments.map((seg, idx) => {
          const strokeDash = (seg.value / total) * 283; // 2 * pi * r (r=45)
          const strokeOffset = -accumulatedAngle;
          accumulatedAngle += (seg.value / total) * 283;

          return (
            <circle
              key={idx}
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={seg.color}
              strokeWidth="16"
              strokeDasharray={`${strokeDash} 283`}
              strokeDashoffset={strokeOffset}
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
          );
        })}
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {segments.map((seg, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: seg.color }} />
            <span style={{ color: '#475569', fontWeight: '600' }}>{seg.label}:</span>
            <strong style={{ color: '#0f172a' }}>{seg.value} ({total ? Math.round((seg.value/total)*100) : 0}%)</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

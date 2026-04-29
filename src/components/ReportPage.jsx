import { jsPDF } from 'jspdf';

function PieChart({ title, series, centerText }) {
  const total = series.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  const slices = series.map((item) => {
    const start = currentAngle;
    currentAngle += (item.value / total) * 360;
    return `${item.color} ${start}deg ${currentAngle}deg`;
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/5 p-5 shadow-[0_16px_38px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-purple/15 blur-3xl pointer-events-none"></div>
      <h3 className="text-white text-xl font-semibold mb-4">{title}</h3>
      <div className="relative flex flex-col md:flex-row md:items-center gap-5">
        <div
          className="relative w-44 h-44 rounded-full ring-1 ring-white/10 shadow-[0_0_40px_rgba(124,92,255,0.25)]"
          style={{ background: `conic-gradient(${slices.join(', ')})` }}
        >
          <div className="absolute inset-6 rounded-full bg-[#09071a] border border-white/10 flex items-center justify-center text-center text-white/90 text-sm font-semibold px-2 shadow-inner">
            {centerText}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 flex-1">
          {series.map((item) => (
            <div key={item.name} className="flex items-center gap-2.5 rounded-lg border border-white/8 bg-white/4 px-3 py-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-white/80 text-sm">{item.name}</span>
              <span className="text-white font-bold text-sm ml-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportPage({ data, onBackHome }) {
  const finalAdvice = 'Prioritize transparent pricing, frictionless cancellation, explicit consent, and neutral UX copy to reduce manipulation risk and improve trust.';
  const genuinePercent =
    data.genuinenessShare.find((item) => item.name.toLowerCase().includes('genuine'))?.value ?? 0;
  const patternSeverity = new Map(
    data.breakdown.map((item) => [item.name.toLowerCase(), item.severity])
  );

  const getGenuineTone = (value) => {
    if (value >= 70) {
      return {
        label: 'Safe',
        cardClass: 'border-emerald-300/60 bg-emerald-50',
        textClass: 'text-emerald-700',
      };
    }
    if (value >= 45) {
      return {
        label: 'Caution',
        cardClass: 'border-amber-300/70 bg-amber-50',
        textClass: 'text-amber-700',
      };
    }
    return {
      label: 'Danger',
      cardClass: 'border-red-300/70 bg-red-50',
      textClass: 'text-red-700',
    };
  };

  const getAdviceTone = (pattern) => {
    const severity = patternSeverity.get(pattern.toLowerCase()) ?? 55;
    if (severity >= 80) {
      return {
        label: 'Danger',
        boxClass: 'border-red-200 bg-red-50/80',
        adviceTextClass: 'text-red-700',
        badgeClass: 'bg-red-100 text-red-700 border-red-200',
      };
    }
    if (severity >= 60) {
      return {
        label: 'Warning',
        boxClass: 'border-amber-200 bg-amber-50/80',
        adviceTextClass: 'text-amber-700',
        badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
      };
    }
    return {
      label: 'Safe',
      boxClass: 'border-emerald-200 bg-emerald-50/80',
      adviceTextClass: 'text-emerald-700',
      badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
  };

  const genuineTone = getGenuineTone(genuinePercent);

  const handleDownloadReport = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const ensureSpace = (needed = 24) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    const addWrapped = (text, fontSize = 11, lineHeight = 18, color = [35, 28, 70]) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, contentWidth);
      lines.forEach((line) => {
        ensureSpace(lineHeight);
        doc.text(line, margin, y);
        y += lineHeight;
      });
    };

    doc.setFillColor(90, 52, 209);
    doc.roundedRect(margin, y, contentWidth, 52, 10, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('ShadowLens Report', margin + 16, y + 32);
    y += 72;

    doc.setTextColor(80, 74, 110);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
    y += 20;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 24, 60);
    doc.setFontSize(13);
    doc.text('Summary', margin, y);
    y += 18;

    addWrapped(`Detected Patterns: ${data.patterns} | Risk Score: ${data.riskScore}/100 | Genuine: ${data.genuinenessShare[0]?.value ?? 0}%`, 11, 16);
    addWrapped(data.report, 11, 17);
    y += 8;

    ensureSpace(24);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Detected Pattern Breakdown', margin, y);
    y += 18;

    data.breakdown.forEach((item) => {
      addWrapped(`• ${item.name}: ${item.severity}% severity`, 11, 16);
    });
    y += 6;

    ensureSpace(24);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Findings', margin, y);
    y += 18;

    data.findings.forEach((item, index) => {
      addWrapped(`${index + 1}. Location: ${item.location}`, 11, 16, [35, 28, 70]);
      addWrapped(`Pattern: ${item.pattern}`, 11, 16, [90, 52, 209]);
      addWrapped(`Advice: ${item.advice}`, 11, 16, [35, 28, 70]);
      y += 4;
    });

    ensureSpace(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 24, 60);
    doc.text('Final Advice', margin, y);
    y += 18;
    addWrapped(finalAdvice, 11, 17);

    doc.save('shadowlens-report.pdf');
  };

  return (
    <section className="w-full h-full">
      <div className="w-full h-full border border-white/12 overflow-hidden">
        <div className="grid grid-cols-1 xl:grid-cols-2">
          <div className="relative bg-white text-[#161237] p-6 md:p-8 text-left min-h-[calc(100vh-180px)]">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,rgba(124,92,255,0.10),transparent_36%)]"></div>
            <div className="relative">
              <span className="inline-flex items-center text-xs font-semibold tracking-wide uppercase text-[#5a34d1] bg-[#efeaff] border border-[#cdbfff] rounded-full px-3 py-1 mb-3">
                AI Forensic Report
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-black mb-4 relative">Generated Report</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 relative">
              <div className="rounded-xl border border-[#2a2550]/12 bg-[#f8f6ff] px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-[#2a2550]/55 mb-1">Patterns</p>
                <p className="text-2xl font-black text-[#1b1640]">{data.patterns}</p>
              </div>
              <div className="rounded-xl border border-[#2a2550]/12 bg-[#f8f6ff] px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-[#2a2550]/55 mb-1">Risk score</p>
                <p className="text-2xl font-black text-[#1b1640]">{data.riskScore}/100</p>
              </div>
              <div className={`rounded-xl border px-4 py-3 ${genuineTone.cardClass}`}>
                <p className="text-xs uppercase tracking-wider text-[#2a2550]/55 mb-1">Genuine</p>
                <p className={`text-2xl font-black ${genuineTone.textClass}`}>{genuinePercent}%</p>
                <p className={`text-xs font-semibold mt-1 ${genuineTone.textClass}`}>{genuineTone.label}</p>
              </div>
            </div>

            <p className="text-[#2a2550]/80 text-base leading-relaxed mb-4 relative">
              We detected <strong>{data.patterns} dark patterns</strong> with a <strong>risk score of {data.riskScore}/100</strong>.
              The strongest concerns appear in <strong>{data.findings[0]?.location}</strong> and <strong>{data.findings[1]?.location}</strong>,
              where users are exposed to coercive choices and hidden friction.
            </p>
            <p className="text-[#2a2550]/80 text-base leading-relaxed mb-5 relative">
              Additional issues were found in <strong>{data.findings[2]?.location}</strong> and <strong>{data.findings[3]?.location}</strong>,
              showing repeated use of manipulative patterns that can reduce trust and increase compliance risk.
            </p>

            <div className="space-y-3 mb-6 relative">
              {data.findings.map((item, index) => {
                const tone = getAdviceTone(item.pattern);
                return (
                <div key={`${item.location}-${index}`} className={`border rounded-xl p-4 shadow-[0_10px_20px_rgba(42,37,80,0.08)] ${tone.boxClass}`}>
                  <p className="text-[#1b1640] text-sm font-semibold mb-1">{item.location}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-[#5a34d1] text-sm font-medium">Pattern: {item.pattern}</p>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${tone.badgeClass}`}>
                      {tone.label}
                    </span>
                  </div>
                  <p className={`text-sm font-medium ${tone.adviceTextClass}`}>Advice: {item.advice}</p>
                </div>
              );
              })}
            </div>

            <div className="border border-[#5a34d1]/25 bg-[#f2ecff] rounded-xl p-4 mb-6 relative">
              <p className="text-[#2a2550] text-base leading-relaxed">
                <strong>Advice:</strong> {finalAdvice}
              </p>
            </div>

            <button
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-purpleBorder bg-[linear-gradient(90deg,rgba(90,52,209,1)_0%,rgba(124,92,255,1)_100%)] text-white text-lg font-semibold font-sans cursor-pointer transition-all hover:brightness-110 hover:shadow-[0_12px_28px_rgba(124,92,255,0.45)] active:scale-98 shadow-[0_10px_24px_rgba(124,92,255,0.35)]"
              onClick={handleDownloadReport}
            >
              <span aria-hidden="true">⬇</span>
              Download PDF report
            </button>
          </div>

          <div className="relative bg-[#0b081f]/80 p-6 md:p-8 flex flex-col gap-5 min-h-[calc(100vh-180px)]">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_90%_0%,rgba(167,126,255,0.22),transparent_40%)]"></div>
            <PieChart
              title="Pattern Type Distribution"
              series={data.patternTypeShare}
              centerText={`${data.patterns} patterns`}
            />

            <PieChart
              title="Website Genuineness"
              series={data.genuinenessShare}
              centerText={`${data.genuinenessShare[0]?.value ?? 0}% Genuine`}
            />

            <button
              className="mt-auto self-end inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/25 bg-white/8 text-white text-base font-semibold font-sans cursor-pointer transition-all hover:bg-white/14 hover:border-white/45 active:scale-98 shadow-[0_8px_22px_rgba(0,0,0,0.3)]"
              onClick={onBackHome}
            >
              <span aria-hidden="true">←</span>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReportPage;

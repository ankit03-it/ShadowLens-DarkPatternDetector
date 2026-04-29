import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DarkPatternCard from './components/DarkPatternCard';
import ScanForm from './components/ScanForm';
import LoadingState from './components/LoadingState';
import ReportPage from './components/ReportPage.jsx';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scanData, setScanData] = useState(null);

  const handleBackHome = () => {
    setIsLoading(false);
    setShowResults(false);
  };

  const handleScan = (text, url) => {
    if (!text && !url) return false;
    
    setIsLoading(true);
    setShowResults(false);
    
    // Simulate scan progress
    setTimeout(() => {
      setScanData({
        patterns: 7,
        riskScore: 82,
        compliant: 2,
        breakdown: [
          { name: 'Fake urgency', severity: 94, color: '#e05555' },
          { name: 'Roach motel', severity: 78, color: '#e08030' },
          { name: 'Trick wording', severity: 71, color: '#e08030' },
          { name: 'Hidden costs', severity: 65, color: '#c0a030' },
          { name: 'Fake reviews', severity: 55, color: '#7c5cff' },
        ],
        report: 'Found 7 dark patterns — risk score 82/100. The countdown timer resets on refresh, a classic fake scarcity tactic. Cancellation requires a phone call during business hours (roach motel). Pre-ticked consent boxes likely violate GDPR Art. 7.',
        tags: ['fake-scarcity', 'roach-motel', 'gdpr-breach', 'trick-wording', 'hidden-cost', 'https-ok'],
        patternTypeShare: [
          { name: 'Fake urgency', value: 32, color: '#ef4444' },
          { name: 'Roach motel', value: 22, color: '#f59e0b' },
          { name: 'Hidden opt-in', value: 18, color: '#8b5cf6' },
          { name: 'Confirm shaming', value: 16, color: '#3b82f6' },
          { name: 'Fake reviews', value: 12, color: '#10b981' },
        ],
        genuinenessShare: [
          { name: 'Genuine', value: 38, color: '#22c55e' },
          { name: 'Manipulative', value: 62, color: '#ef4444' },
        ],
        findings: [
          {
            location: 'Pricing section checkout',
            pattern: 'Fake urgency',
            advice: 'Remove resetting countdown timers and show real stock/time values only.',
          },
          {
            location: 'Subscription settings',
            pattern: 'Roach motel',
            advice: 'Allow one-click cancel flow in account settings without phone-only exit.',
          },
          {
            location: 'Consent and signup boxes',
            pattern: 'Hidden opt-in',
            advice: 'Keep consent boxes unchecked by default and request explicit opt-in.',
          },
          {
            location: 'Upgrade popups',
            pattern: 'Confirm shaming',
            advice: 'Use neutral decline copy without guilt language or pressure wording.',
          },
        ],
      });
      setIsLoading(false);
      setShowResults(true);
    }, 2500);
    
    return true;
  };

  const cardConfigs = [
    {
      id: 1,
      badge: 'FAKE URGENCY',
      badgeType: 'red',
      style: { left: '4%', top: '8%' },
      rotate: -6,
      bracketType: 'large',
      content: {
        type: 'timer',
        title: 'Flash Sale — 73% OFF',
        minutes: 8,
        seconds: 47
      }
    },
    {
      id: 2,
      badge: 'ROACH MOTEL',
      badgeType: 'orange',
      style: { left: '2%', top: '45%' },
      rotate: 4,
      bracketType: 'small',
      content: {
        type: 'subscription',
        title: 'Manage subscription',
        subtitle: 'You are on Premium Pro plan',
        plan: 'Premium Pro',
        price: '$49/mo'
      }
    },
    {
      id: 3,
      badge: 'HIDDEN OPT-IN',
      badgeType: 'purple',
      style: { left: '6%', top: '75%' },
      rotate: -4,
      bracketType: 'medium',
      content: {
        type: 'optIn',
        title: 'Complete your order',
        options: ['Newsletter updates', 'Share with partners']
      }
    },
    {
      id: 4,
      badge: 'CONFIRM SHAMING',
      badgeType: 'orange',
      style: { right: '5%', top: '12%' },
      rotate: 7,
      bracketType: 'medium',
      content: {
        type: 'confirmShaming',
        title: 'Are you sure?',
        message: 'Do you really want to miss out on your exclusive member discount and permanently lose all your loyalty points?'
      }
    },
    {
      id: 5,
      badge: 'FAKE REVIEWS',
      badgeType: 'purple',
      style: { right: '3%', top: '42%' },
      rotate: -5,
      bracketType: 'small',
      content: {
        type: 'reviews',
        rating: 4.9,
        count: 48291,
        reviews: [
          'Sarah M. — "Absolutely changed my life!"',
          'John D. — "Worth every single penny!"',
          'Amy K. — "I tell everyone about this!"'
        ]
      }
    },
    {
      id: 6,
      badge: 'BAIT & SWITCH',
      badgeType: 'red',
      style: { right: '7%', top: '70%' },
      rotate: 3,
      bracketType: 'medium',
      content: {
        type: 'pricing',
        title: 'Choose your plan',
        plans: [
          { tier: 'FREE', price: '$0', note: '3 uses/month', free: true },
          { tier: 'PRO', price: '$99', note: 'per month', popular: true }
        ]
      }
    }
  ];

  const getCardFootprint = (type) => {
    switch (type) {
      case 'confirmShaming':
        return { width: 20, height: 30 };
      case 'optIn':
      case 'reviews':
        return { width: 20, height: 26 };
      case 'timer':
      case 'subscription':
      case 'pricing':
      default:
        return { width: 20, height: 22 };
    }
  };

  const buildNonOverlappingLayout = (configs) => {
    const placedRects = [];
    const padding = 5;
    const minCenterDistance = 28;
    const centerCopySafeZone = {
      left: 29,
      top: 16,
      right: 71,
      bottom: 94,
    };
    const isRectOverlapping = (a, b, extraPadding = 0) =>
      !(
        a.right + extraPadding < b.left ||
        a.left > b.right + extraPadding ||
        a.bottom + extraPadding < b.top ||
        a.top > b.bottom + extraPadding
      );

    return configs.map((config) => {
      const footprint = getCardFootprint(config.content.type);
      const maxLeft = 98 - footprint.width;
      const maxTop = 96 - footprint.height;
      let attempt = 0;
      let left = 4;
      let top = 8;
      let placed = false;

      while (attempt < 250 && !placed) {
        left = Math.random() * (maxLeft - 4) + 4;
        top = Math.random() * (maxTop - 6) + 6;

        const rect = {
          left,
          top,
          right: left + footprint.width,
          bottom: top + footprint.height,
        };
        const rectCenterX = left + footprint.width / 2;
        const rectCenterY = top + footprint.height / 2;

        const overlaps = placedRects.some((other) => isRectOverlapping(rect, other, padding));
        const overlapsCenterCopy = isRectOverlapping(rect, centerCopySafeZone, 1);
        const tooCloseToOtherCards = placedRects.some((other) => {
          const otherCenterX = (other.left + other.right) / 2;
          const otherCenterY = (other.top + other.bottom) / 2;
          const distance = Math.hypot(rectCenterX - otherCenterX, rectCenterY - otherCenterY);
          return distance < minCenterDistance;
        });

        if (!overlaps && !tooCloseToOtherCards && !overlapsCenterCopy) {
          placedRects.push(rect);
          placed = true;
        }

        attempt += 1;
      }

      if (!placed) {
        for (const dynamicPadding of [padding, 3, 1, 0]) {
          for (let y = 6; y <= maxTop; y += 2) {
            for (let x = 4; x <= maxLeft; x += 2) {
              const rect = {
                left: x,
                top: y,
                right: x + footprint.width,
                bottom: y + footprint.height,
              };
              const blockedByCards = placedRects.some((other) => isRectOverlapping(rect, other, dynamicPadding));
              const blockedByCenterCopy = isRectOverlapping(rect, centerCopySafeZone, 1);
              if (!blockedByCards && !blockedByCenterCopy) {
                left = x;
                top = y;
                placedRects.push(rect);
                placed = true;
                break;
              }
            }
            if (placed) break;
          }
          if (placed) break;
        }
      }

      if (!placed) {
        for (let y = 6; y <= maxTop; y += 2) {
          for (let x = 4; x <= maxLeft; x += 2) {
            const rect = {
              left: x,
              top: y,
              right: x + footprint.width,
              bottom: y + footprint.height,
            };
            const blockedByCards = placedRects.some((other) => isRectOverlapping(rect, other, 0));
            const blockedByCenterCopy = isRectOverlapping(rect, centerCopySafeZone, 1);
            if (!blockedByCards && !blockedByCenterCopy) {
              left = x;
              top = y;
              placedRects.push(rect);
              placed = true;
              break;
            }
          }
          if (placed) break;
        }
      }

      return {
        ...config,
        style: {
          left: `${left}%`,
          top: `${top}%`,
        },
      };
    });
  };

  const [randomizedCardConfigs] = useState(() =>
    buildNonOverlappingLayout(cardConfigs)
  );

  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden">
      {/* Base space backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 100% at 68% 14%, rgba(60, 24, 130, 0.22) 0%, rgba(14, 10, 36, 0.7) 38%, rgba(4, 4, 16, 0.95) 70%, #02020b 100%)',
        }}
      ></div>

      {/* Sparse star field */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(70)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 1.2 + 0.4}px`,
              height: `${Math.random() * 1.2 + 0.4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.35 + 0.08,
            }}
          ></div>
        ))}
      </div>

      {/* Distant soft orb on top-left */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '110px',
          height: '110px',
          top: '120px',
          left: '170px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(191, 145, 255, 0.38) 0%, rgba(130, 90, 210, 0.18) 45%, transparent 100%)',
          filter: 'blur(14px)',
        }}
      ></div>

      {/* Vertical light shaft */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '320px',
          height: '760px',
          top: '-220px',
          left: '44%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(180deg, rgba(167, 126, 255, 0.26) 0%, rgba(111, 77, 219, 0.12) 28%, rgba(52, 32, 120, 0) 100%)',
          filter: 'blur(44px)',
          opacity: 0.7,
        }}
      ></div>

      {/* Planet body */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '760px',
          height: '760px',
          top: '-410px',
          right: '-300px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at 32% 22%, rgba(201, 162, 255, 0.74) 0%, rgba(150, 109, 241, 0.62) 18%, rgba(104, 69, 208, 0.54) 36%, rgba(56, 35, 141, 0.72) 56%, rgba(24, 15, 75, 0.9) 75%, rgba(8, 6, 26, 0) 100%)',
          boxShadow: 'inset -200px -230px 330px rgba(4, 2, 18, 0.8)',
        }}
      ></div>

      {/* Planet rim glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '800px',
          height: '800px',
          top: '-420px',
          right: '-310px',
          borderRadius: '50%',
          background:
            'conic-gradient(from 2120deg at 50% 50%, rgba(255, 255, 255, 0.96) 110deg, rgba(248, 214, 255, 0.95) 23deg, rgba(221, 164, 255, 0.88) 74deg, rgba(174, 116, 244, 0.72) 124deg, rgba(110, 72, 214, 0.44) 184deg, rgba(68, 45, 152, 0.22) 262deg, rgba(255, 255, 255, 0.96) 360deg)',
          WebkitMask: 'radial-gradient(circle, transparent 66.5%, black 69.5%, black 81%, transparent 85%)',
          mask: 'radial-gradient(circle, transparent 66.5%, black 69.5%, black 81%, transparent 85%)',
          filter: 'drop-shadow(0 0 28px rgba(243, 198, 255, 0.5)) drop-shadow(0 0 92px rgba(140, 95, 245, 0.32))',
        }}
      ></div>

      {/* Soft lower highlight band */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '820px',
          height: '820px',
          top: '-450px',
          right: '-340px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at 35% 82%, rgba(255, 251, 255, 0.93) 0%, rgba(252, 197, 255, 0.62) 18%, rgba(191, 129, 249, 0.42) 36%, rgba(97, 63, 196, 0.18) 54%, rgba(40, 24, 100, 0) 68%)',
          filter: 'blur(16px)',
          opacity: 0.9,
        }}
      ></div>

      {/* Lower atmospheric glow near planet */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '920px',
          height: '920px',
          top: '-510px',
          right: '-430px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 64%, rgba(140, 96, 255, 0.34) 0%, rgba(115, 76, 236, 0.24) 24%, rgba(79, 49, 183, 0.14) 42%, rgba(30, 20, 84, 0) 67%)',
          filter: 'blur(64px)',
          opacity: 0.9,
        }}
      ></div>

      {/* Corner transparency for half-moon look */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(430px 430px at 100% 0%, rgba(2, 2, 11, 0.98) 0%, rgba(2, 2, 11, 0.82) 30%, rgba(2, 2, 11, 0.38) 48%, rgba(2, 2, 11, 0) 66%)',
        }}
      ></div>

      {/* Global vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 48%, rgba(0, 0, 0, 0.25) 100%)',
        }}
      ></div>

      <div className="relative z-10 w-full min-h-screen flex flex-col">
        <Navbar />

        {/* Stage Container - matches .stage from mockup */}
        <div className={`relative w-full flex-grow ${showResults && scanData ? '' : 'flex items-center justify-center'}`}>
          {showResults && scanData ? (
            <ReportPage data={scanData} onBackHome={handleBackHome} />
          ) : (
            <>
              {/* Center Content - matches .center-copy - render FIRST for z-index to work */}
              <div className="relative" style={{ zIndex: 30 }} >
                <div className="text-center max-w-xs px-4 pointer-events-auto">
                <h1 className="font-serif text-5xl font-black text-white leading-tight mb-3.5 -tracking-0.25">
                  Detect the<br /><em>dark</em><br />patterns!
                </h1>
                <p className="text-sm text-white/55 leading-relaxed mb-7 font-light">
                  Paste any URL or text and our AI<br />
                  exposes every deceptive UX trick.
                </p>

                {!isLoading && !showResults && (
                  <ScanForm onScan={handleScan} />
                )}

                {isLoading && <LoadingState />}
              </div>
              </div>

              {/* Dark Pattern Cards - absolutely positioned - render AFTER for z-index to work */}
              {randomizedCardConfigs.map(config => (
                <DarkPatternCard key={config.id} config={config} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

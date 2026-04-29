import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function DarkPatternCard({ config }) {
  const [minutes, setMinutes] = useState(config.content.minutes || 0);
  const [seconds, setSeconds] = useState(config.content.seconds || 0);

  useEffect(() => {
    if (config.content.type !== 'timer') return;

    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev === 0) {
          setMinutes(m => Math.max(0, m - 1));
          return 59;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [config.content.type]);

  const getBracketSize = () => {
    if (config.bracketType === 'small') return { width: '30px', height: '24px' };
    if (config.bracketType === 'medium') return { width: '44px', height: '36px' };
    return { width: '38px', height: '32px' };
  };

  const getBracketColor = () => {
    if (config.bracketType === 'small') return 'border-purple/50';
    return 'border-purple/75';
  };

  const renderContent = () => {
    const { type, ...content } = config.content;

    switch (type) {
      case 'timer':
        return (
          <div className="bg-darkCard p-3" style={{ width: '176px' }}>
            <div className="text-tiny font-mono text-white/30 tracking-widest mb-1.25">// COUNTDOWN TIMER</div>
            <div className="text-base font-bold text-white mb-2">{content.title}</div>
            <div className="flex gap-1 items-center mb-2">
              <div className="bg-redBg text-white text-xs font-bold py-1 px-1.5 rounded text-center min-w-6.5 font-mono leading-none" style={{ width: '26px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{String(minutes).padStart(2, '0')}</div>
              <div className="text-redBg font-bold text-sm">:</div>
              <div className="bg-redBg text-white text-xs font-bold py-1 px-1.5 rounded text-center min-w-6.5 font-mono leading-none" style={{ width: '26px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{String(seconds).padStart(2, '0')}</div>
              <div className="text-redBg font-bold text-sm">:</div>
              <div className="bg-redBg text-white text-xs font-bold py-1 px-1.5 rounded text-center min-w-6.5 font-mono leading-none" style={{ width: '26px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>00</div>
            </div>
            <div className="bg-redBg text-white text-tiny font-bold py-1.75 rounded cursor-pointer text-center leading-tight">BUY NOW — OFFER ENDS SOON</div>
          </div>
        );

      case 'subscription':
        return (
          <div className="bg-lightCard p-3" style={{ width: '162px' }}>
            <div className="text-base font-bold text-lightText mb-0.5">{content.title}</div>
            <div className="text-tiny text-mutedTextLight mb-2">{content.subtitle}</div>
            <div className="bg-purple/15 rounded py-1.5 px-2.5 flex justify-between items-center mb-1">
              <span className="text-tiny font-bold text-purple">{content.plan}</span>
              <span className="text-xl font-black text-purple">{content.price}</span>
            </div>
            <div className="text-tiny text-lightBorder text-center cursor-pointer underline mb-0.5">cancel subscription</div>
            <div className="text-tiny text-lightBorder/85 leading-snug">
              To cancel, call 1-800-555-0199 between 9am–5pm EST, Mon–Fri. Processing takes up to 45 business days.
            </div>
          </div>
        );

      case 'optIn':
        return (
          <div className="bg-white p-3" style={{ width: '168px' }}>
            <div className="text-base font-bold text-lightText mb-1.25">{content.title}</div>
            {content.options.map((option, idx) => (
              <div key={idx} className="flex justify-between items-center mb-1.25">
                <span className="text-sm text-gray-700">{option}</span>
                <div className="rounded bg-purple flex items-center justify-center flex-shrink-0" style={{ width: '15px', height: '15px' }}>
                  <span className="text-tiny text-white font-bold">✓</span>
                </div>
              </div>
            ))}
            <div className="text-tiny text-lightBorder/80 leading-relaxed mt-1.25 border-t border-gray-200 pt-1.25">
              By clicking Continue you agree to share data with our 142 advertising partners. Boxes pre-selected for convenience.
            </div>
            <div className="bg-lightText text-white text-tiny font-semibold p-1.5 rounded text-center mt-1.5 cursor-pointer">Continue →</div>
          </div>
        );

      case 'confirmShaming':
        return (
          <div className="bg-white p-3" style={{ width: '172px' }}>
            <div className="text-base font-bold text-lightText mb-0.75">{content.title}</div>
            <div className="text-sm text-gray-600 leading-snug mb-2">
              Do you really want to <strong>miss out</strong> on your exclusive member discount and permanently lose all your loyalty points?
            </div>
            <div className="bg-purple text-white text-sm font-bold p-1.5 rounded text-center mb-1 cursor-pointer">Keep my benefits</div>
            <div className="text-tiny text-lightBorder/70 text-center cursor-pointer">Yes, I want to lose my rewards</div>
          </div>
        );

      case 'reviews':
        return (
          <div className="bg-darkCard p-3" style={{ width: '165px' }}>
            <div className="text-tiny font-mono text-white/30 tracking-widest mb-1">// SOCIAL PROOF</div>
            <div className="text-yellow-400 text-xl tracking-wider mb-0.5">★★★★★</div>
            <div className="text-xs text-white/35 mb-1.5 leading-tight">{content.rating} · {content.count.toLocaleString()} verified reviews</div>
            {content.reviews.map((review, idx) => (
              <div key={idx} className="text-sm text-white/55 leading-snug mb-1">
                {review.split(' — ').length === 2 ? (
                  <>
                    <span className="text-white/25">{review.split(' — ')[0]} — </span>
                    {review.split(' — ')[1]}
                  </>
                ) : (
                  review
                )}
              </div>
            ))}
          </div>
        );

      case 'pricing':
        return (
          <div className="bg-lightCard p-3" style={{ width: '170px' }}>
            <div className="text-base font-bold text-lightText mb-1.5">{content.title}</div>
            <div className="grid grid-cols-2 gap-1.5">
              {content.plans.map((plan, idx) => (
                <div key={idx} className={`border-2 rounded-lg p-1.75 text-center relative ${plan.free ? 'border-purple' : 'border-lightBorder'}`}>
                  {plan.popular && <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-orange text-white text-tiny font-bold px-1.25 py-0.5 rounded whitespace-nowrap">POPULAR</div>}
                  <div className="text-tiny font-bold mb-0.25" style={{ color: plan.free ? '#5a30c8' : '#888' }}>
                    {plan.tier}
                  </div>
                  <div className="text-xl font-black text-lightText leading-none">{plan.price}</div>
                  <div className="text-tiny text-gray-500 mt-0.5">{plan.note}</div>
                </div>
              ))}
            </div>
            <div className="text-tiny text-lightBorder/70 mt-1.25 leading-relaxed">
              *Billed annually at $1,188. Free plan auto-upgrades after trial.
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
     <motion.div 
      drag 
      dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
      initial={{ rotate: config.rotate || 0 }}
      animate={{ rotate: config.rotate || 0 }}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1, zIndex: 50, cursor: 'grabbing' }}
      className="absolute cursor-grab" 
      style={{ ...config.style, zIndex: 20 }}
    >
      <div 
        className="relative float-slow" 
        style={{ animationDelay: `${config.id * 0.4}s` }}
      >
        {/* Top-left bracket */}
        <div 
          className={`absolute border-2 ${getBracketColor()} border-r-0 border-b-0`} 
          style={{
            ...getBracketSize(),
            top: '-9px',
            left: '-9px',
            borderTopLeftRadius: '8px'
          }}
        ></div>
        
        <div className="rounded-lg overflow-hidden relative">
          {/* Badge */}
          <div 
            className={`absolute z-10 text-tiny font-bold font-mono py-0.5 px-1.5 rounded text-white ${
              config.badgeType === 'red' ? 'bg-red' :
              config.badgeType === 'orange' ? 'bg-orange' :
              'bg-purple'
            }`}
            style={{
              top: '7px',
              right: '7px',
              fontSize: '7px'
            }}
          >
            {config.badge}
          </div>
          
          {/* Content */}
          {renderContent()}
        </div>
        
        {/* Bottom-right bracket */}
        <div 
          className={`absolute border-2 ${getBracketColor()} border-l-0 border-t-0`}
          style={{
            ...getBracketSize(),
            bottom: '-9px',
            right: '-9px',
            borderBottomRightRadius: '8px'
          }}
        ></div>
      </div>
    </motion.div>
  );
}

export default DarkPatternCard;

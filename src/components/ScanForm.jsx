import { useState } from 'react';

function ScanForm({ onScan }) {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleScan = () => {
    if (!text && !url) {
      setHasError(true);
      setTimeout(() => setHasError(false), 1400);
      return;
    }
    onScan(text, url);
  };

  return (
    <div id="inputSection" className="flex flex-col gap-3">
      <div className="flex flex-col gap-2.5 text-left">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-purple/60 font-mono pointer-events-none">T_</span>
          <input
            className={`w-full bg-white/7 border border-white/15 rounded-full px-4.5 pl-11 py-3 text-base text-white font-sans outline-none transition-all ${
              hasError 
                ? 'border-redError/60 bg-redError/10 shadow-lg shadow-redError/10' 
                : 'focus:border-purpleBorder focus:bg-purpleLight focus:shadow-lg focus:shadow-purple/10'
            }`}
            id="txIn"
            placeholder="Paste website text or content here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleScan()}
          />
        </div>
        
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-purple/50 font-mono pointer-events-none">URL</span>
          <input
            className={`w-full bg-white/7 border border-white/15 rounded-full px-4.5 pl-11 py-3 text-base text-white font-sans outline-none transition-all ${
              hasError 
                ? 'border-redError/60 bg-redError/10 shadow-lg shadow-redError/10' 
                : 'focus:border-purpleBorder focus:bg-purpleLight focus:shadow-lg focus:shadow-purple/10'
            }`}
            id="urlIn"
            placeholder="https://suspicious-website.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleScan()}
          />
        </div>
      </div>
      
      <button 
        className="w-full px-6 py-3.5 rounded-full border border-purpleBorder bg-purpleLight text-white text-lg font-medium font-sans cursor-pointer transition-all hover:bg-purple/18 hover:border-purple/90 active:scale-98"
        onClick={handleScan}
      >
        Scan for dark patterns
      </button>
    </div>
  );
}

export default ScanForm;

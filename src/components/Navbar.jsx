function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-5 relative z-50 border-b border-white/10">
      <div className="flex items-center gap-2.5">
        <div className="grid grid-cols-3 gap-0.75 w-5.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple/80"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple/80"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple/80"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple/80"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple/80"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple/80"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple/80"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple/80"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple/80"></span>
        </div>
        <span className="text-base font-semibold text-white">ShadowLens</span>
      </div>
      
      <div className="hidden md:flex gap-7">
        <a href="#about" className="text-lg text-white/65 cursor-pointer hover:text-white transition">About us</a>
      </div>
    </nav>
  );
}

export default Navbar;

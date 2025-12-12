import Image from 'next/image';

export default function Footer() {
  const partners = ['Developer', 'EPC', 'Bitmain', 'Transformers', 'Cooling Systems', 'Infrastructure'];

  return (
    <footer className="fixed bottom-0 left-[180px] right-0 bg-[#0a0b0d] border-t border-white/5 z-40">
      <div className="w-full">
        <div className="flex items-center justify-center">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center w-20 h-12 bg-white/5 border-r border-white/5 last:border-r-0 hover:bg-white/10 hover:border-[#8AFD81]/30 transition-all"
            >
              {/* Placeholder pour logo - à remplacer par les vrais logos */}
              <div className="text-white/30 text-[10px] font-medium uppercase tracking-wider">{partner}</div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

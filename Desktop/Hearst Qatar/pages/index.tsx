import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import KPICard from '../components/KPICard';

export default function Overview() {
  const kpis = [
    { title: 'Total Installed Power', value: '100+', unit: 'MW' },
    { title: 'Number of Containers', value: 32, unit: '' },
    { title: 'Total Machines', value: 5760, unit: 'ASICs' },
    { title: 'Total Hashrate', value: 1020, unit: 'PH/s' },
    { title: 'Daily Production', value: 2.45, unit: 'BTC/day' },
  ];

  return (
    <>
      <Head>
        <title>QATAR - Bitcoin Strategic Reserve</title>
        <meta name="description" content="100+ MW Bitcoin mining park in Qatar" />
      </Head>

      <section className="relative bg-white py-8">
        <div className="max-w-7xl mx-auto">
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[#0b1120] tracking-wide">
                QATAR - Bitcoin Strategic Reserve
              </h1>
            </div>
            
            <div className="mb-8">
              <div className="bg-[#0a0b0d] rounded-[8px] p-6 border border-white/5 hover:border-[#8AFD81]/20 transition-colors w-full">
                <div className="flex gap-6 w-full overflow-x-auto">
                  <div className="flex-shrink-0 flex-1 min-w-[150px]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Total Installed Power</h3>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                        {kpis[0].value}
                      </p>
                      <span className="text-lg text-white/60 font-medium tracking-wide">{kpis[0].unit}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex-1 min-w-[150px]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Number of Containers</h3>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                        {typeof kpis[1].value === 'number' ? kpis[1].value.toLocaleString('en-US') : kpis[1].value}
                      </p>
                      <span className="text-lg text-white/60 font-medium tracking-wide">{kpis[1].unit}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex-1 min-w-[150px]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Total Machines</h3>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                        {typeof kpis[2].value === 'number' ? kpis[2].value.toLocaleString('en-US') : kpis[2].value}
                      </p>
                      <span className="text-lg text-white/60 font-medium tracking-wide">{kpis[2].unit}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex-1 min-w-[150px]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Total Hashrate</h3>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                        {typeof kpis[3].value === 'number' ? kpis[3].value.toLocaleString('en-US') : kpis[3].value}
                      </p>
                      <span className="text-lg text-white/60 font-medium tracking-wide">{kpis[3].unit}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex-1 min-w-[150px]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Daily Production</h3>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                        {typeof kpis[4].value === 'number' ? kpis[4].value.toFixed(2) : kpis[4].value}
                      </p>
                      <span className="text-lg text-white/60 font-medium tracking-wide">{kpis[4].unit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-[#64748b] mb-6 max-w-3xl leading-relaxed">
              The 100MW QATAR project represents a state-of-the-art Bitcoin mining infrastructure located in Qatar, 
              designed to utilize over 100 MW of electrical capacity. This world-class facility is optimized for 
              maximum hashrate density while maintaining exceptional energy efficiency through advanced Hydro cooling systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Link
                href="/dashboard"
                className="bg-[#8AFD81] hover:bg-[#6FD96A] text-black font-semibold py-3 px-8 rounded-[8px] transition-colors"
              >
                View Dashboard
              </Link>
              <Link
                href="/substation-3d-auto"
                className="bg-white hover:bg-gray-50 text-[#0b1120] font-semibold py-3 px-8 rounded-[8px] border-2 border-[#8AFD81] transition-colors"
              >
                View 3D Site
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#f8f9fa] rounded-[8px] p-6 border border-[#e2e8f0] overflow-hidden">
            <div className="relative w-full h-[400px] rounded-[8px] overflow-hidden">
              <Image
                src="/Overview.jpg"
                alt="Mining containers park with substations & transformers"
                fill
                className="object-cover"
                priority
              />
            </div>
            <p className="text-[#64748b] text-sm text-center mt-4">Mining containers park with substations & transformers</p>
          </div>
        </div>
      </section>

      <section className="pt-8 pb-0 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[1.25rem] font-bold text-[#0b1120] mb-6 tracking-wide">Project Overview</h2>
          <div className="space-y-4 text-[#64748b] text-sm leading-relaxed">
            <p>
              The park is organized into <strong className="text-[#0b1120]">4 distinct sections</strong>, each approximately 25 MW, 
              enabling modular management and simplified maintenance. Each section is powered from a main substation via 
              dedicated transformers, ensuring reliable and secure electrical distribution.
            </p>
            <p>
              All mining operations utilize <strong className="text-[#0b1120]">Bitmain Hydro cooling systems</strong> for optimal thermal 
              management, allowing for higher density installations and improved energy efficiency. The facility operates 
              with a global uptime exceeding 99%, demonstrating exceptional reliability.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}


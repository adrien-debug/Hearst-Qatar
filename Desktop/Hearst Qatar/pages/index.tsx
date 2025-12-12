import Head from 'next/head';
import Link from 'next/link';
import { Suspense } from 'react';
import KPICard from '../components/KPICard';
import Overview3DScene from '../components/3d/Overview3DScene';

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

      <section className="relative bg-white py-4 sm:py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div>
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0b1120] tracking-wide">
                QATAR - Bitcoin Strategic Reserve
              </h1>
            </div>
            
            <div className="mb-4">
              <div className="bg-[#0a0b0d] rounded-[8px] p-4 sm:p-6 border border-white/5 hover:border-[#8AFD81]/20 transition-colors w-full overflow-x-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 w-full">
                  <div className="flex-shrink-0 w-full">
                    <div className="flex items-center justify-center mb-3">
                      <h3 className="text-xs font-medium text-white uppercase tracking-wider text-center">Total Installed Power</h3>
                    </div>
                    <div className="flex items-baseline justify-center space-x-2">
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8AFD81] tracking-tight">
                        {kpis[0].value}
                      </p>
                      <span className="text-sm sm:text-base md:text-lg text-white font-medium tracking-wide">{kpis[0].unit}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-full">
                    <div className="flex items-center justify-center mb-3">
                      <h3 className="text-xs font-medium text-white uppercase tracking-wider text-center">Number of Containers</h3>
                    </div>
                    <div className="flex items-baseline justify-center space-x-2">
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8AFD81] tracking-tight">
                        {typeof kpis[1].value === 'number' ? kpis[1].value.toLocaleString('en-US') : kpis[1].value}
                      </p>
                      <span className="text-sm sm:text-base md:text-lg text-white font-medium tracking-wide">{kpis[1].unit}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-full">
                    <div className="flex items-center justify-center mb-3">
                      <h3 className="text-xs font-medium text-white uppercase tracking-wider text-center">Total Machines</h3>
                    </div>
                    <div className="flex items-baseline justify-center space-x-2">
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8AFD81] tracking-tight">
                        {typeof kpis[2].value === 'number' ? kpis[2].value.toLocaleString('en-US') : kpis[2].value}
                      </p>
                      <span className="text-sm sm:text-base md:text-lg text-white font-medium tracking-wide">{kpis[2].unit}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-full">
                    <div className="flex items-center justify-center mb-3">
                      <h3 className="text-xs font-medium text-white uppercase tracking-wider text-center">Total Hashrate</h3>
                    </div>
                    <div className="flex items-baseline justify-center space-x-2">
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8AFD81] tracking-tight">
                        {typeof kpis[3].value === 'number' ? kpis[3].value.toLocaleString('en-US') : kpis[3].value}
                      </p>
                      <span className="text-sm sm:text-base md:text-lg text-white font-medium tracking-wide">{kpis[3].unit}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-full">
                    <div className="flex items-center justify-center mb-3">
                      <h3 className="text-xs font-medium text-white uppercase tracking-wider text-center">Daily Production</h3>
                    </div>
                    <div className="flex items-baseline justify-center space-x-2">
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8AFD81] tracking-tight">
                        {typeof kpis[4].value === 'number' ? kpis[4].value.toFixed(2) : kpis[4].value}
                      </p>
                      <span className="text-sm sm:text-base md:text-lg text-white font-medium tracking-wide">{kpis[4].unit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0 pb-4 sm:pb-6 md:pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-[#f8f9fa] rounded-[8px] p-3 sm:p-4 md:p-6 border border-[#e2e8f0] overflow-hidden">
            <Suspense fallback={
              <div className="relative w-full h-[400px] rounded-[8px] overflow-hidden bg-gray-900 flex items-center justify-center">
                <div className="text-white text-sm">Chargement de la visualisation 3D...</div>
              </div>
            }>
              <Overview3DScene />
            </Suspense>
            <p className="text-[#64748b] text-sm text-center mt-4">Mining containers park with substations & transformers</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link
              href="/dashboard"
              className="bg-[#8AFD81] hover:bg-[#6FD96A] text-black font-semibold py-3 px-8 rounded-[8px] transition-colors text-center"
            >
              View Dashboard
            </Link>
            <Link
              href="/substation-3d-auto"
              className="bg-white hover:bg-gray-50 text-[#0b1120] font-semibold py-3 px-8 rounded-[8px] border-2 border-[#8AFD81] transition-colors text-center"
            >
              View 3D Site
            </Link>
          </div>
        </div>
      </section>

      <section className="py-4 sm:py-6 md:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs sm:text-sm text-[#64748b] mb-4 sm:mb-6 max-w-3xl leading-relaxed">
            The 100MW QATAR project represents a state-of-the-art Bitcoin mining infrastructure located in Qatar, 
            designed to utilize over 100 MW of electrical capacity. This world-class facility is optimized for 
            maximum hashrate density while maintaining exceptional energy efficiency through advanced Hydro cooling systems.
          </p>
        </div>
      </section>

      <section className="pt-4 sm:pt-6 md:pt-8 pb-0 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-lg sm:text-xl md:text-[1.25rem] font-bold text-[#0b1120] mb-4 sm:mb-6 tracking-wide">Project Overview</h2>
          <div className="space-y-3 sm:space-y-4 text-[#64748b] text-xs sm:text-sm leading-relaxed">
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



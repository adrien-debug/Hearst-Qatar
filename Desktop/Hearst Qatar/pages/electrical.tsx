import Head from 'next/head';
import { useState } from 'react';
import { buildElectricalStructure, ElectricalNode } from '../data/electricalMock';
import ElectricalNodeComponent from '../components/ElectricalNode';

export default function Electrical() {
  const [selectedSection, setSelectedSection] = useState<string | undefined>(undefined);
  const [electricalStructure] = useState<ElectricalNode>(buildElectricalStructure());

  const handleSectionSelect = (sectionId: string) => {
    if (selectedSection === sectionId) {
      setSelectedSection(undefined);
    } else {
      setSelectedSection(sectionId);
    }
  };

  const resetSelection = () => {
    setSelectedSection(undefined);
  };

  return (
    <>
      <Head>
        <title>Electrical Layout - 100MW QATAR</title>
        <meta name="description" content="Mining park electrical diagram" />
      </Head>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-baseline mb-4">
            <h1 className="text-[1.75rem] font-bold text-[#0b1120] bg-white px-6 py-4 rounded-[8px] inline-block tracking-wide border border-[#e2e8f0]">
              Electrical Layout 100+ MW
            </h1>
            {selectedSection && (
              <button
                onClick={resetSelection}
                className="text-[#8AFD81] hover:text-[#6FD96A] bg-transparent border-none font-medium py-2 px-4 text-sm transition-colors cursor-pointer tracking-wide"
              >
                Reset
              </button>
            )}
          </div>
          <p className="text-sm text-[#64748b] max-w-3xl leading-relaxed">
            Interactive schematic view of the complete electrical infrastructure, from the main substation through 
            transformers to individual mining containers. Click on any section to highlight its connected components.
          </p>
        </div>

        <div className="mb-6 p-4 bg-[#8AFD81]/10 border border-[#8AFD81]/30 rounded-[8px]">
          <p className="text-[#0b1120] text-sm">
            💡 <strong>Tip:</strong> Click on a section to highlight its connected transformers and containers.
          </p>
        </div>

        <div className="mb-8 bg-gradient-to-br from-white via-white to-slate-50/50 rounded-xl p-6 border border-slate-200/60 shadow-lg backdrop-blur-sm">
          <h2 className="text-base font-bold text-[#0b1120] mb-6 tracking-wide">Legend</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-br from-blue-50/80 to-indigo-50/60 border border-blue-200/50">
              <div className="w-5 h-5 rounded-lg border-2 border-blue-500/70 bg-gradient-to-br from-blue-100/60 to-blue-200/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]"></div>
              <span className="text-[#0b1120] text-sm font-medium">Substation</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-br from-[#8AFD81]/15 to-emerald-50/40 border border-[#8AFD81]/30">
              <div className="w-5 h-5 rounded-lg border-2 border-[#8AFD81]/70 bg-gradient-to-br from-[#8AFD81]/20 to-emerald-100/40 shadow-[0_0_15px_rgba(138,253,129,0.2)]"></div>
              <span className="text-[#0b1120] text-sm font-medium">Section</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-br from-orange-50/80 to-amber-50/60 border border-orange-200/50">
              <div className="w-5 h-5 rounded-lg border-2 border-orange-500/70 bg-gradient-to-br from-orange-100/60 to-orange-200/40 shadow-[0_0_15px_rgba(249,115,22,0.2)]"></div>
              <span className="text-[#0b1120] text-sm font-medium">Transformer</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-br from-slate-50/80 to-gray-50/60 border border-slate-200/50">
              <div className="w-5 h-5 rounded-lg border-2 border-slate-500/70 bg-gradient-to-br from-slate-100/60 to-slate-200/40 shadow-[0_0_15px_rgba(100,116,139,0.15)]"></div>
              <span className="text-[#0b1120] text-sm font-medium">Container</span>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 border border-emerald-200/50">
              <div className="w-5 h-5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] border-2 border-emerald-400/60"></div>
              <span className="text-[#0b1120] text-sm font-medium">Status: OK</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-br from-amber-50/80 to-amber-100/40 border border-amber-200/50">
              <div className="w-5 h-5 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] border-2 border-amber-400/60"></div>
              <span className="text-[#0b1120] text-sm font-medium">Status: Warning</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-br from-red-50/80 to-red-100/40 border border-red-200/50">
              <div className="w-5 h-5 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] border-2 border-red-400/60"></div>
              <span className="text-[#0b1120] text-sm font-medium">Status: Off</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white via-slate-50/30 to-white rounded-xl p-8 border border-slate-200/60 shadow-xl backdrop-blur-sm overflow-x-auto">
          <div className="min-w-max">
            <ElectricalNodeComponent
              node={electricalStructure}
              selectedSection={selectedSection}
              onSelect={handleSectionSelect}
              level={0}
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[8px] p-6 border border-[#e2e8f0] shadow-sm">
            <h3 className="text-base font-semibold text-[#0b1120] mb-4 tracking-wide">Electrical Architecture</h3>
            <p className="text-sm text-[#64748b] mb-4">Complete infrastructure breakdown and component specifications.</p>
            <ul className="space-y-2 text-[#64748b] text-sm">
              <li>• <strong className="text-[#0b1120]">Main Substation:</strong> 120 MW capacity, 132 kV → 33 kV transformation</li>
              <li>• <strong className="text-[#0b1120]">4 Sections:</strong> ~25 MW each, independently managed</li>
              <li>• <strong className="text-[#0b1120]">16 Transformers:</strong> 4 MVA each (4 per section)</li>
              <li>• <strong className="text-[#0b1120]">32 Containers:</strong> 8 containers per section, 3.2 MW each</li>
              <li>• <strong className="text-[#0b1120]">Distribution:</strong> 1 transformer feeds 2 containers</li>
            </ul>
          </div>
          <div className="bg-white rounded-[8px] p-6 border border-[#e2e8f0] shadow-sm">
            <h3 className="text-base font-semibold text-[#0b1120] mb-4 tracking-wide">Electrical Flow</h3>
            <p className="text-sm text-[#64748b] mb-4">Power distribution path from grid to mining equipment.</p>
            <div className="text-[#64748b] text-sm space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-[#8AFD81] font-bold">→</span>
                <span>Grid Connection (132 kV)</span>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-[#8AFD81] font-bold">→</span>
                <span>Main Substation (33 kV output)</span>
              </div>
              <div className="flex items-center space-x-2 ml-8">
                <span className="text-[#8AFD81] font-bold">→</span>
                <span>Sections 1-4 (33 kV distribution)</span>
              </div>
              <div className="flex items-center space-x-2 ml-12">
                <span className="text-[#8AFD81] font-bold">→</span>
                <span>Transformers (0.4 kV step-down)</span>
              </div>
              <div className="flex items-center space-x-2 ml-16">
                <span className="text-[#8AFD81] font-bold">→</span>
                <span>Mining Containers (ASIC power)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


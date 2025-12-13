import React from 'react';

interface ProjectSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentCount: number;
}

export default function ProjectSuccessModal({ 
  isOpen, 
  onClose, 
  equipmentCount 
}: ProjectSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0a0b0d] border border-[#8AFD81]/20 rounded-lg shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 animate-scaleIn">
        {/* En-tête avec fond vert lime */}
        <div className="bg-[#8AFD81] text-[#0a0b0d] p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0a0b0d]/10 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#0a0b0d]">Projet créé avec succès!</h2>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-4">
          {/* Excel généré */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8AFD81]/20 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M9 17v-6m-3 3h6m-6 0h6m6 0v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6l4 4h6a2 2 0 012 2z" 
                  stroke="#8AFD81" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Excel généré et téléchargé</p>
            </div>
          </div>

          {/* Équipements placés */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8AFD81]/20 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" 
                  stroke="#8AFD81" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">
                {equipmentCount} équipements placés dans la scène 3D
              </p>
            </div>
          </div>

          {/* Message de redirection */}
          <div className="pt-2 border-t border-white/10">
            <p className="text-white/80 text-sm">
              Vous êtes maintenant dans l'environnement 3D du projet.
            </p>
          </div>
        </div>

        {/* Bouton OK */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[#8AFD81] text-[#0a0b0d] hover:bg-[#8AFD81]/80 rounded-lg transition-all font-semibold flex items-center justify-center gap-2"
          >
            <span>OK</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import Head from 'next/head';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/router';
import { DeploymentProvider } from '../contexts/DeploymentContext';
import { Project3DProvider, useProject3D } from '../contexts/Project3DContext';
import DeploymentTabs from '../components/3d/DeploymentTabs';
import Element3DGallery from '../components/3d/Element3DGallery';
import Substation3DScene from '../components/3d/Substation3DScene';
import NewProjectModal, { ProjectConfig } from '../components/NewProjectModal';
import SoilTypeSelector from '../components/3d/SoilTypeSelector';
import SavedProjects3DList from '../components/3d/SavedProjects3DList';
import ProjectSuccessModal from '../components/3d/ProjectSuccessModal';

type ViewMode = 'gallery' | 'project3d';

function Substation3DPageContent() {
  const router = useRouter();
  const { hasProject, setProject, loadProject, clearProject } = useProject3D();
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  
  // #region agent log
  React.useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'substation-3d.tsx:18',message:'viewMode state changed',data:{viewMode,hasProject},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
  }, [viewMode, hasProject]);
  // #endregion
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectConfig | null>(null);
  const [soilSelectorOpen, setSoilSelectorOpen] = useState(false);
  const [savedProjectsListOpen, setSavedProjectsListOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [equipmentCount, setEquipmentCount] = useState(0);

  // Toujours commencer par la galerie, même s'il y a un projet sauvegardé
  useEffect(() => {
    const { project, layout } = router.query;
    
    if (project && layout) {
      // Projet passé via URL (depuis la configuration)
      try {
        const projectData = JSON.parse(project as string);
        const layoutData = JSON.parse(layout as string);
        setProject(projectData, layoutData, false);
        setTimeout(() => {
          setViewMode('project3d');
        }, 100);
        router.replace('/substation-3d', undefined, { shallow: true });
      } catch (error) {
        console.error('Erreur lors du chargement du projet depuis URL:', error);
      }
    } else {
      // Toujours afficher la galerie par défaut
      setViewMode('gallery');
    }
  }, [router.query, setProject]);

  const handleBackToGallery = () => {
    setViewMode('gallery');
    clearProject();
    router.replace('/substation-3d', undefined, { shallow: true });
  };

  const handleElementSelect = (elementType: string, elementId?: string) => {
    console.log('Element selected:', elementType, elementId);
    // Vous pouvez ajouter une navigation ou une action ici
  };

  const handleProjectCreated = (projectData: ProjectConfig) => {
            setCurrentProject(projectData);
    setNewProjectModalOpen(false);
            setSoilSelectorOpen(true);
  };

  const handleSoilSelected = async (soilType: string) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'substation-3d.tsx:62',message:'handleSoilSelected entry',data:{hasCurrentProject:!!currentProject,soilType,viewMode},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (!currentProject) return;

    // Mettre à jour le projet avec le type de sol
    const projectWithSoil = { ...currentProject, soil_type: soilType };
    setCurrentProject(projectWithSoil);
    setSoilSelectorOpen(false);
    
    try {
      // Générer le layout 3D
      const { generateLayout3D } = await import('../utils/layoutGenerator');
      
      const layout = generateLayout3D(projectWithSoil);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'substation-3d.tsx:75',message:'Layout generated',data:{layoutLength:layout.length,projectName:projectWithSoil.project_name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      console.log('✅ Layout 3D généré:', layout.length, 'éléments');
      
      if (layout.length === 0) {
        console.warn('⚠️ Aucun élément dans le layout généré');
        alert('Aucun équipement à placer. Vérifiez les paramètres du projet.');
        return;
      }
      
      // Sauvegarder le projet et le layout via le contexte
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'substation-3d.tsx:85',message:'Before setProject call',data:{viewModeBefore:viewMode,projectName:projectWithSoil.project_name,layoutLength:layout.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.log('💾 Sauvegarde du projet:', projectWithSoil.project_name, 'Layout:', layout.length, 'éléments');
      setProject(projectWithSoil, layout, true);
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'substation-3d.tsx:88',message:'After setProject, before setViewMode',data:{viewModeBefore:viewMode},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      // Rediriger immédiatement vers la vue 3D du projet créé
      console.log('🔄 Redirection automatique vers l\'environnement 3D du projet créé');
      
      // Utiliser requestAnimationFrame pour s'assurer que le rendu est prêt
      requestAnimationFrame(() => {
        setViewMode('project3d');
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'substation-3d.tsx:91',message:'After setViewMode call',data:{viewModeSet:'project3d'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
      });
      
      const count = layout.filter(e => 
        e.type === 'Container' || e.type === 'Transformateur' || e.type === 'PowerBlock'
      ).length;
      
      setEquipmentCount(count);
      
      // Afficher le modal de succès après un court délai pour permettre le rendu de la vue 3D
      setTimeout(() => {
        setSuccessModalOpen(true);
      }, 800);
    } catch (error) {
      console.error('Erreur lors de la génération du layout:', error);
      alert('Erreur lors de la génération du layout 3D');
    }
  };

  const handleCancelSoilSelection = () => {
    setSoilSelectorOpen(false);
    setCurrentProject(null);
  };

  return (
    <>
      <Head>
        <title>
          {viewMode === 'gallery' 
            ? 'Galerie 3D - Éléments Substation' 
            : 'Visualisation 3D - Projet Substation'}
        </title>
        <meta 
          name="description" 
          content={
            viewMode === 'gallery'
              ? "Galerie visuelle 3D de tous les éléments disponibles"
              : "Visualisation 3D interactive de votre projet"
          } 
        />
      </Head>

      <DeploymentProvider>
        <div className="fixed top-0 left-0 w-screen h-screen bg-gray-900 z-50" style={{ margin: 0, padding: 0 }}>
          {/* Onglets de déploiements */}
          <DeploymentTabs 
            className="absolute top-0 left-0 right-0 z-[100]" 
            onNewProject={() => setNewProjectModalOpen(true)}
            showNewProject={viewMode === 'gallery'}
          />
      
          {/* Bouton pour retourner à la galerie depuis la vue 3D */}
          {viewMode === 'project3d' && (
            <div className="absolute top-20 left-4 z-[120] flex gap-2">
              <button
                onClick={handleBackToGallery}
                className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Galerie
              </button>
            </div>
          )}

          {/* Contenu selon le mode */}
          {(() => {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'substation-3d.tsx:154',message:'Render decision',data:{viewMode,willShowGallery:viewMode === 'gallery',willShow3D:viewMode === 'project3d'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
            // #endregion
            return null;
          })()}
          {viewMode === 'gallery' ? (
            <div className="absolute top-20 left-0 right-0 bottom-0 overflow-y-auto">
              <Element3DGallery 
                onElementSelect={handleElementSelect}
                onBackTo3D={hasProject ? () => setViewMode('project3d') : undefined}
                onShowSavedProjects={() => setSavedProjectsListOpen(true)}
              />
            </div>
          ) : (
            <div className="absolute top-20 left-0 right-0 bottom-0 w-full h-full">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Chargement de l'environnement 3D...</p>
                  </div>
                </div>
              }>
                <Substation3DScene />
              </Suspense>
            </div>
          )}
        </div>

        {/* Modal Nouveau Projet */}
        <NewProjectModal
          isOpen={newProjectModalOpen}
          onClose={() => setNewProjectModalOpen(false)}
          onProjectCreated={handleProjectCreated}
        />

        {/* Sélecteur de type de sol */}
        {soilSelectorOpen && currentProject && (
          <SoilTypeSelector
            projectConfig={currentProject}
            onSoilSelected={handleSoilSelected}
            onCancel={handleCancelSoilSelection}
          />
        )}

        {/* Liste des projets sauvegardés */}
        {savedProjectsListOpen && (
          <SavedProjects3DList
            onLoadProject={(project, layout) => {
              // Créer un SavedProject3D temporaire pour loadProject
              const savedProject = {
                id: `temp_${Date.now()}`,
                name: project.project_name,
                project,
                layout,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              loadProject(savedProject);
              setTimeout(() => {
                setViewMode('project3d');
              }, 100);
            }}
            onClose={() => setSavedProjectsListOpen(false)}
          />
        )}

        {/* Modal de succès */}
        <ProjectSuccessModal
          isOpen={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          equipmentCount={equipmentCount}
        />
      </DeploymentProvider>
    </>
  );
}

export default function Substation3DPage() {
  return (
    <Project3DProvider>
      <Substation3DPageContent />
    </Project3DProvider>
  );
}

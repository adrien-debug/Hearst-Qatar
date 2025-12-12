export interface ElectricalNode {
  id: string;
  name: string;
  type: 'substation' | 'section' | 'transformer' | 'container' | 'generator';
  capacityMW?: number;
  capacityMVA?: number;
  status: 'OK' | 'Warning' | 'Off';
  parentId?: string;
  section?: string;
  children?: ElectricalNode[];
}

export function buildElectricalStructure(): ElectricalNode {
  const containers: ElectricalNode[] = [];
  const transformers: ElectricalNode[] = [];
  const switchgears: ElectricalNode[] = [];

  // Create containers, transformers and switchgears for each power block
  // Structure: 4 Power Blocks, 6 Transformers per PB, 2 HD5 containers per Transformer
  for (let pb = 1; pb <= 4; pb++) {
    const powerBlockTransformers: ElectricalNode[] = [];
    
    for (let tr = 1; tr <= 6; tr++) {
      const transformerContainers: ElectricalNode[] = [];
      
      // 2 HD5 containers per transformer
      for (let hd5 = 1; hd5 <= 2; hd5++) {
        const containerId = `PB${pb}_TR${tr.toString().padStart(2, '0')}_HD5_${hd5 === 1 ? 'A' : 'B'}`;
        transformerContainers.push({
          id: containerId,
          name: `Container HD5 ${pb}-${tr}-${hd5 === 1 ? 'A' : 'B'}`,
          type: 'container',
          capacityMW: 3.2,
          status: 'OK',
          parentId: `PB${pb}_TR${tr.toString().padStart(2, '0')}`,
          section: `PowerBlock_${pb}`,
        });
      }
      
      // Switchgear for this transformer
      const switchgearId = `PB${pb}_SG_${tr.toString().padStart(2, '0')}`;
      switchgears.push({
        id: switchgearId,
        name: `Switchgear ${pb}-${tr}`,
        type: 'transformer', // Reusing type for compatibility
        status: 'OK',
        parentId: `PB${pb}_TR${tr.toString().padStart(2, '0')}`,
        section: `PowerBlock_${pb}`,
      });
      
      const transformerId = `PB${pb}_TR${tr.toString().padStart(2, '0')}`;
      powerBlockTransformers.push({
        id: transformerId,
        name: `Transformer ${pb}-${tr}`,
        type: 'transformer',
        capacityMVA: 4,
        status: 'OK',
        parentId: `PowerBlock_${pb}`,
        section: `PowerBlock_${pb}`,
        children: transformerContainers,
      });
    }
    
    transformers.push(...powerBlockTransformers);
  }

  // Create power blocks
  const powerBlocks: ElectricalNode[] = [];
  for (let pb = 1; pb <= 4; pb++) {
    const pbTransformers = transformers.filter(t => t.section === `PowerBlock_${pb}`);
    powerBlocks.push({
      id: `PowerBlock_${pb}`,
      name: `Power Block ${pb}`,
      type: 'section',
      capacityMW: 50, // 6 transformers * ~8.3 MW each
      status: pb === 3 ? 'Warning' : 'OK',
      parentId: 'Substation_200MW',
      section: `PowerBlock_${pb}`,
      children: pbTransformers,
    });
  }

  // Create generators section (8 generators, each with 2 containers)
  const generators: ElectricalNode[] = [];
  for (let gen = 1; gen <= 8; gen++) {
    const generatorContainers: ElectricalNode[] = [];
    
    // 2 HD5 containers per generator (left and right)
    for (let hd5 = 1; hd5 <= 2; hd5++) {
      const containerId = `GEN${gen.toString().padStart(2, '0')}_HD5_${hd5 === 1 ? 'L' : 'R'}`;
      generatorContainers.push({
        id: containerId,
        name: `Container HD5 Gen${gen}-${hd5 === 1 ? 'Left' : 'Right'}`,
        type: 'container',
        capacityMW: 3.2,
        status: 'OK',
        parentId: `Generator_${gen.toString().padStart(2, '0')}`,
        section: 'Generators',
      });
    }
    
    const generatorId = `Generator_${gen.toString().padStart(2, '0')}`;
    generators.push({
      id: generatorId,
      name: `Generator ${gen}`,
      type: 'generator',
      capacityMW: 10, // 10 MW per generator
      status: 'OK',
      parentId: 'Substation_200MW',
      section: 'Generators',
      children: generatorContainers,
    });
  }

  // Main substation (200 MW) with power blocks and generators
  return {
    id: 'Substation_200MW',
    name: 'Substation 200 MW',
    type: 'substation',
    capacityMVA: 200,
    status: 'OK',
    children: [...powerBlocks, ...generators],
  };
}





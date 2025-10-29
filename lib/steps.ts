import { Step, StepType } from './types';

export function parseXml(response: string, startId: number = 1): Step[] {
  console.log('parseXml input:', response.substring(0, 500));
  
  const xmlMatch = response.match(/<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/);
  
  if (!xmlMatch) {
    console.log('No boltArtifact found in response, trying to find any XML structure...');
    
    // Try to find any XML-like structure
    const anyXmlMatch = response.match(/<boltAction[^>]*>([\s\S]*?)<\/boltAction>/);
    if (anyXmlMatch) {
      console.log('Found boltAction without boltArtifact wrapper');
      // Wrap the content in a boltArtifact for parsing
      const wrappedResponse = `<boltArtifact title="Generated Project">${response}</boltArtifact>`;
      return parseXml(wrappedResponse, startId);
    }
    
    console.log('No XML structure found in response, creating basic step');
    
    // Create a basic step if no XML is found
    return [{
      id: startId,
      title: 'Generate Project',
      description: 'AI is generating your project...',
      type: StepType.RunScript,
      status: 'pending',
      code: response
    }];
  }

  const xmlContent = xmlMatch[1];
  const steps: Step[] = [];
  let stepId = startId;
  
  // Ensure unique IDs by using timestamp as base if startId is 1
  const baseId = startId === 1 ? Date.now() : startId;

  const titleMatch = response.match(/title="([^"]*)"/);
  const artifactTitle = titleMatch ? titleMatch[1] : 'Project Files';

  steps.push({
    id: baseId + stepId++,
    title: artifactTitle,
    description: '',
    type: StepType.CreateFolder,
    status: 'pending'
  });

  const actionRegex = /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g;
  
  let match;
  while ((match = actionRegex.exec(xmlContent)) !== null) {
    const type = match[1];
    const filePath = match[2];
    const content = match[3];

    if (type === 'file') {
      steps.push({
        id: baseId + stepId++,
        title: `Create ${filePath || 'file'}`,
        description: '',
        type: StepType.CreateFile,
        status: 'pending',
        code: content.trim(),
        path: filePath
      });
    } else if (type === 'shell') {
      steps.push({
        id: baseId + stepId++,
        title: 'Run command',
        description: '',
        type: StepType.RunScript,
        status: 'pending',
        code: content.trim()
      });
    }
  }

  console.log('Parsed steps:', steps);
  return steps;
}
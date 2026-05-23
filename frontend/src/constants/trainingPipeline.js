export const PIPELINE_STAGES = [
  { id: 'discovering', label: 'Discovering Files', icon: 'discover' },
  { id: 'reading', label: 'Reading Content', icon: 'read' },
  { id: 'chunking', label: 'Chunking Source Files', icon: 'chunk' },
  { id: 'embedding', label: 'Generating Embeddings', icon: 'embed' },
  { id: 'uploading', label: 'Uploading to ChromaDB', icon: 'upload' },
  { id: 'metadata', label: 'Updating Metadata', icon: 'meta' },
];

export const STAGE_INDEX = PIPELINE_STAGES.reduce((acc, s, i) => {
  acc[s.id] = i;
  return acc;
}, {});

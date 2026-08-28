export const tools = {
  lightroom: { label: 'Lightroom', rating: 'portable', description: 'portable', keywords: 'portable', labelField: 'portable', adjustments: 'portable' },
  darktable: { label: 'darktable', rating: 'portable', description: 'portable', keywords: 'portable', labelField: 'portable', adjustments: 'portable' },
  immich: { label: 'Immich', rating: 'portable', description: 'portable', keywords: 'portable', labelField: 'unknown', adjustments: 'lossy' },
  'immich-readonly': { label: 'Immich (read-only)', rating: 'lossy', description: 'lossy', keywords: 'lossy', labelField: 'lossy', adjustments: 'lossy' },
  snapseed: { label: 'Snapseed', rating: 'unknown', description: 'unknown', keywords: 'unknown', labelField: 'unknown', adjustments: 'lossy' },
  'generic-xmp': { label: 'Generic XMP', rating: 'portable', description: 'portable', keywords: 'portable', labelField: 'portable', adjustments: 'unknown' }
};

const fieldLabels = {
  rating: 'Rating',
  description: 'Description',
  keywords: 'Keywords',
  labelField: 'Color label',
  adjustments: 'Edit adjustments'
};

const severity = { portable: 0, unknown: 1, lossy: 2 };

export function assessRoute(sourceId, destinationId) {
  const source = tools[sourceId];
  const destination = tools[destinationId];
  if (!source || !destination) throw new Error('Unknown capability profile');
  const fields = Object.keys(fieldLabels).map((key) => {
    const sourceState = source[key];
    const destinationState = destination[key];
    const state = severity[sourceState] >= severity[destinationState] ? sourceState : destinationState;
    return { key, label: fieldLabels[key], state };
  });
  const maxSeverity = Math.max(...fields.map((field) => severity[field.state]));
  const verdict = maxSeverity === 2 ? 'attention' : maxSeverity === 1 ? 'test first' : 'portable';
  let note = 'This declared route keeps the sample fields portable. Verify a representative import before moving originals.';
  if (destinationId === 'immich-readonly') note = 'This read-only destination cannot write these fields. Keep the editor catalog and every sidecar.';
  else if (fields.some((field) => field.key === 'adjustments' && field.state !== 'portable')) note = 'Render critical edited versions and keep the original sidecar; the report does not translate photo edit settings.';
  return { source: source.label, destination: destination.label, fields, verdict, note };
}

export const recipes = {
  'lightroom:immich': ['Write metadata to XMP in Lightroom.', 'Back up the catalog and originals together.', 'Import a 20-image sample, then compare ratings and captions.', 'Export finished master renders for virtual-copy variants.'],
  'lightroom:snapseed': ['Keep the Lightroom catalog as adjustment authority.', 'Export a rendered 16-bit TIFF for continued visual editing.', 'Do not expect Camera Raw develop settings to appear in Snapseed.', 'Retain the original DNG and XMP as a pair.'],
  'darktable:immich': ['Write darktable sidecars before copying.', 'Preserve .xmp files with matching basenames.', 'Render critical history stacks for visual parity.', 'Re-scan the destination folder after transfer.']
  ,'darktable:snapseed': ['Keep darktable sidecars with each original.', 'Render a TIFF for visual edits before transfer.', 'Test one album in Snapseed.', 'Keep the source archive as the edit record.']
  ,'immich:lightroom': ['Export a representative folder with sidecars.', 'Keep the Immich library intact until review.', 'Import the sample into Lightroom.', 'Compare captions, keywords, and ratings.']
  ,'generic-xmp:immich': ['Copy originals and XMP sidecars together.', 'Archive the JSON handoff report.', 'Test one destination album.', 'Keep rendered copies for critical edits.']
};

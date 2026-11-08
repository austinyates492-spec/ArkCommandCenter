import test from 'node:test';
import assert from 'node:assert/strict';
import {imageSpeciesNames,portraitCandidates,PORTRAIT_SOURCE,PORTRAIT_LICENSE} from './creature-images.js';

test('portraits prioritize exact ASA species including variants before fallback',()=>{
 assert.deepEqual(imageSpeciesNames('Rex'),['Rex']);
 assert.deepEqual(imageSpeciesNames('Tek Rex'),['Tek Rex','Rex']);
 assert.deepEqual(imageSpeciesNames('Aberrant Ovis'),['Aberrant Ovis','Ovis']);
 assert.deepEqual(imageSpeciesNames('Aberrant Spino'),['Aberrant Spino','Spinosaurus','Spino']);
 assert.deepEqual(imageSpeciesNames('https://evil.com'),[]);
 assert.deepEqual(portraitCandidates('Tek Rex'),[
  'https://raw.githubusercontent.com/arkutils/species-images/main/images/Tek%20Rex_ASA.png',
  'https://raw.githubusercontent.com/arkutils/species-images/main/images/Tek%20Rex.png',
  'https://raw.githubusercontent.com/arkutils/species-images/main/images/Rex_ASA.png',
  'https://raw.githubusercontent.com/arkutils/species-images/main/images/Rex.png'
 ]);
});
test('creature art source identifies public repository and license',()=>{
 assert.equal(PORTRAIT_SOURCE,'https://github.com/arkutils/species-images');
 assert.match(PORTRAIT_LICENSE,/\/LICENSE$/);
 assert.equal(portraitCandidates('').length,0);
});

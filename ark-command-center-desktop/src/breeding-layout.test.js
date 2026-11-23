import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const src=readFileSync(new URL('./BreedingLab.jsx',import.meta.url),'utf8');
const css=readFileSync(new URL('./breeding-lab-premium.css',import.meta.url),'utf8');

test('approved Breeding Lab has two aligned upper panels and full-width milestone timeline',()=>{
 for(const marker of ['breeding-top-grid','breeding-profile-panel','breeding-calculator-panel','breeding-timeline-panel','breeding-art-stage','CreatureLineArt','RexArtwork','breeding-milestones'])assert.ok(src.includes(marker),marker);
 for(const marker of ['grid-template-columns:repeat(2,minmax(0,1fr))','align-items:stretch','display:flex;flex-direction:column','breeding-timeline-track'])assert.ok(css.includes(marker),marker);
});
test('keeps original ASA breeding rate calculations, verified data, warnings, and timer actions',()=>{
 for(const marker of ['data.mature/Number(rates.mature||1)','data.hatch','data.gestation','rates.hatch||1','8*Number(rates.cuddle||1)','data.cooldownMin','data.cooldownMax','data.eggTempC','data.sourceDatasetVersion','data.sourceReview','source-checked baselines','Not verified','onTimer('])assert.ok(src.toLowerCase().includes(marker.toLowerCase()),marker);
 assert.match(src,/hatching\*60,'Incubation'/);
 assert.match(src,/mature\*60,'Maturation'/);
 assert.match(src,/Math\.floor\(\(mature-0\.00001\)\/cuddle\)/);
});
test('correct phase boundaries with one overall maturation timeline and 90% milestone',()=>{
 for(const marker of ['start:0,end:10','start:10,end:50','start:50,end:100','portion:0.1','portion:0.5','portion:0.9','portion:1','mature*stage.portion*3600'])assert.ok(src.includes(marker),marker);
 assert.ok(src.includes('These are elapsed times, not independent phase percentages.'));

});
test('theme tokens and mobile layouts preserve selected appearance',()=>{
 for(const marker of ['--ark-accent','--ark-bright','--ark-surface','--ark-line','--ark-heading','--personality-border','@media(max-width:480px)','@media(max-width:1180px)'])assert.ok(css.includes(marker),marker);
});

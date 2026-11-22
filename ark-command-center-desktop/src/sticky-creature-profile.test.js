import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('creature profile stays pinned on tall desktops without its own scrollbar',()=>{
 const css=readFileSync(new URL('./taming-lab-art.css',import.meta.url),'utf8');
 assert.match(css,/\.taming-workspace>\.taming-combined-panel\{position:sticky;top:16px;max-height:none;overflow:visible\}/);
 assert.doesNotMatch(css,/\.taming-workspace>\.taming-combined-panel\{position:sticky;[^}]*overflow-y:auto/);
 assert.match(css,/@media\(min-width:1191px\) and \(min-height:850px\)/);
 assert.equal(css.split('grid-template-columns:minmax(280px,35fr) minmax(0,65fr)').length-1,2,'dashboard uses 35/65 split for base and desktop layout');
 assert.match(css,/@media\(min-width:1191px\) and \(max-height:849px\)/);
 assert.match(css,/\.taming-workspace>\.taming-combined-panel\{position:static;top:auto;overflow:visible;max-height:none\}/);
});

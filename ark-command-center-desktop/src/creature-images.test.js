import test from 'node:test';
import assert from 'node:assert/strict';
import {imageSpeciesNames,imageTitleOptions,pickCreatureImage,lookupCreatureImage} from './creature-images.js';

test('portrait lookup uses exact species, with variants falling back to their parents',()=>{
 assert.deepEqual(imageSpeciesNames('Rex'),['Rex']);
 assert.deepEqual(imageSpeciesNames('Tek Rex'),['Tek Rex','Rex']);
 assert.deepEqual(imageSpeciesNames('Aberrant Ovis'),['Aberrant Ovis','Ovis']);
 assert.deepEqual(imageSpeciesNames('https://evil.com'),[]);
 assert.ok(imageTitleOptions('Karkinos').includes('File:Karkinos.png'));
});
test('chooses documented render before thumbnail when present and rejects untrusted hosts',()=>{
 const creature='Rex';
 const selected=pickCreatureImage(creature,[
  {title:'File:Rex.png',imageinfo:[{url:'https://ark.wiki.gg/images/Rex.png',descriptionurl:'https://ark.wiki.gg/wiki/File:Rex.png'}]},
  {title:'File:Ark Rex render.png',imageinfo:[{url:'https://ark.wiki.gg/images/Ark_Rex.png',thumburl:'https://ark.wiki.gg/images/thumb/Ark_Rex.png',descriptionurl:'https://ark.wiki.gg/wiki/File:Ark_Rex_render.png'}]}
 ]);
 assert.equal(selected.file,'File:Ark Rex render.png');
 assert.equal(selected.url,'https://ark.wiki.gg/images/thumb/Ark_Rex.png');
 assert.equal(pickCreatureImage(creature,[{title:'File:Rex.png',imageinfo:[{url:'https://evil.example/img.png'}]}]),null);
});
test('fetches a wiki-backed image when available, and falls back when it is not',async()=>{
 const fakeFetch=async url=>{
  const request=new URL(url);
  assert.equal(request.hostname,'ark.wiki.gg');
  assert.equal(request.searchParams.get('origin'),'*');
  assert.match(request.searchParams.get('titles'),/File:Ovis.png/);
  return {ok:true,json:async()=>({query:{pages:[{title:'File:Ovis.png',imageinfo:[{url:'https://ark.wiki.gg/images/Ovis.png'}]}]}})};
 };
 assert.equal((await lookupCreatureImage('Ovis',{fetcher:fakeFetch})).file,'File:Ovis.png');
 assert.equal(await lookupCreatureImage('Ovis',{fetcher:async()=>({ok:true,json:async()=>({query:{pages:[]}})})}),null);
});

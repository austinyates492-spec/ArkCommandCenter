// Curated gathering guidance, not benchmarked yield rankings. Wiki mechanics can differ between ASA/ASE and server rules.
const raw={
 "Metal": [
  "Metal",
  "Metal Pick",
  [
   "Ankylosaurus|Primary land harvester",
   "Mantis|Equip a pick",
   "Dunkleosteus|Underwater ore nodes",
   "Argentavis|Transport support, not a miner"
  ],
  "Use an Anky for ore and a weight-focused Argentavis where flyers and carrying are permitted."
 ],
 "Crystal": [
  "Crystal",
  "Metal Pick",
  [
   "Ankylosaurus|Land crystal",
   "Dunkleosteus|Underwater crystal where present",
   "Mantis|Equip a pick"
  ],
  "Look for crystal formations; check cave access before bringing large mounts."
 ],
 "Obsidian": [
  "Obsidian",
  "Metal Pick",
  [
   "Ankylosaurus|Land nodes",
   "Mantis|Equip a pick",
   "Dunkleosteus|Submerged nodes where present"
  ],
  "Volcanic and mountain rocks are common sources."
 ],
 "Oil": [
  "Oil",
  "Metal Pick",
  [
   "Ankylosaurus|Accessible land nodes",
   "Dunkleosteus|Underwater oil nodes",
   "Basilosaurus|Passive oil production"
  ],
  "For automated extraction, use the distinct Oil Vein layer rather than oil rocks."
 ],
 "Oil Vein / Oil Well": [
  "Oil_Pump",
  "Oil Pump",
  [],
  "Place an Oil Pump on a compatible vein, where building and server rules allow. This is passive extraction, not creature harvesting."
 ],
 "Silica Pearls": [
  "Silica_Pearls",
  "Hands / SCUBA gear",
  [
   "Anglerfish|Pearl bed harvesting",
   "Otter|Small quantities from fish"
  ],
  "Pearl beds can be collected by hand; underwater routes may require breathing gear."
 ],
 "Black Pearls": [
  "Black_Pearl",
  "Hands / SCUBA gear",
  [
   "Anglerfish|Collect suitable black clam nodes",
   "Dunkleosteus|Large harvestable black clam nodes where present",
   "Otter|Occasional pearls from fish"
  ],
  "Source varies by map: black clams, aquatic creature drops or other map-specific sources."
 ],
 "Rare Flowers": [
  "Rare_Flower",
  "Hands",
  [
   "Therizinosaurus|Delicate gathering attack",
   "Moschops|Specialized harvest levels",
   "Megachelon|Passive production where available"
  ],
  "Target suitable plants or beaver dams; avoid disturbing nearby threats."
 ],
 "Rare Mushrooms": [
  "Rare_Mushroom",
  "Metal Pick / hands",
  [
   "Therizinosaurus|Delicate harvest",
   "Moschops|Specialized harvest levels",
   "Megachelon|Passive production where available"
  ],
  "Swamp vegetation, crystal byproducts and beaver dams can yield mushrooms."
 ],
 "Mushrooms": [
  "Mushroom",
  "Hands",
  [],
  "Collect the appropriate mushroom plants; species and effects vary by biome."
 ],
 "Wood Coal": [
  "Charcoal",
  "Campfire / forge",
  [],
  "Collect charcoal from burned trees where supported, or burn wood in a suitable structure."
 ],
 "Plant Species X": [
  "Plant_Species_X_Seed",
  "Hands",
  [
   "Therizinosaurus|Delicate harvest from suitable plants"
  ],
  "Gather seeds from the appropriate plants, then grow in a crop plot."
 ],
 "Plant Species Y": [
  "Plant_Species_Y_Seed",
  "Hands",
  [
   "Therizinosaurus|Delicate harvest from suitable plants"
  ],
  "Gather seeds from the appropriate desert plants."
 ],
 "Plant Species R": [
  "Plant_Species_R_Seed",
  "Source-specific collection",
  [],
  "Scout the documented source; verify the local acquisition method before farming."
 ],
 "Beaver Dam": [
  "Giant_Beaver_Dam",
  "Inventory interaction",
  [],
  "Loot the dam inventory and leave it empty so it can despawn. Nearby wild beavers may attack."
 ],
 "Bee Hive": [
  "Giant_Bee_Honey",
  "Protective gear",
  [],
  "Collect honey from a hive or maintain a domesticated hive; prepare for defensive bees."
 ],
 "Cactus Sap": [
  "Cactus_Sap",
  "Hatchet / hands",
  [
   "Morellatops|Small cactus plants",
   "Therizinosaurus|Delicate harvest of suitable bush cactus"
  ],
  "Larger cactus nodes may require a tool instead of a bush-harvesting mount."
 ],
 "Salt": [
  "Raw_Salt",
  "Metal Pick",
  [
   "Ankylosaurus|Suitable mineral deposits"
  ],
  "Mine salt-bearing rocks or fossils; do not confuse raw salt with crafted preserving salt."
 ],
 "Sulfur": [
  "Sulfur",
  "Metal Pick",
  [
   "Ankylosaurus|Sulfur rock harvesting"
  ],
  "Look for yellow mineral deposits; avoid nearby volcanic hazards."
 ],
 "Silk": [
  "Silk",
  "Sickle",
  [
   "Therizinosaurus|Delicate harvest of suitable flowers"
  ],
  "Harvest silk-bearing plants or suitable creature drops."
 ],
 "Gas Vein": [
  "Gas_Collector",
  "Gas Collector",
  [],
  "Install a Gas Collector on a compatible vein to produce Congealed Gas Balls."
 ],
 "Gas": [
  "Congealed_Gas_Ball",
  "Gas Collector",
  [],
  "Collect from gas-producing sources or use a collector on a compatible vein."
 ],
 "Water Vein": [
  "Water_Well",
  "Water Well",
  [],
  "Build a Water Well on a compatible vein where permitted. This is a water source, not an ore node."
 ],
 "Blue Gems": [
  "Blue_Gem",
  "Metal Pick",
  [
   "Ankylosaurus|Suitable gem crystals"
  ],
  "Match the crystal type and use appropriate protection for the biome."
 ],
 "Green Gems": [
  "Green_Gem",
  "Metal Pick",
  [
   "Ankylosaurus|Suitable gem crystals"
  ],
  "Look for green gem-bearing crystal formations."
 ],
 "Red Gems": [
  "Red_Gem",
  "Metal Pick",
  [
   "Ankylosaurus|Suitable gem crystals"
  ],
  "Plan radiation protection where required; use a mount appropriate for the zone."
 ],
 "Element Ore": [
  "Element_Ore",
  "Metal Pick",
  [
   "Ankylosaurus|Suitable ore deposits"
  ],
  "Ore is a crafting input, not finished Element. Bring radiation protection where needed."
 ],
 "Element Shards": [
  "Element_Shard",
  "Metal Pick",
  [],
  "Mine compatible shard-bearing crystals; some lunar nodes require on-foot harvesting."
 ],
 "Element Dust": [
  "Element_Dust",
  "Metal Hatchet",
  [
   "Doedicurus|Extinction city fixtures",
   "Gacha|Passive production only if its resource list includes dust"
  ],
  "Farm supported city fixtures or use a dust-producing Gacha."
 ],
 "Element Vein": [
  "Element_Node",
  "Metal Pick / suitable tools",
  [],
  "Defend the vein event before harvesting remaining nodes. Reference markers are possible event locations, not active events."
 ],
 "OSD (Orbital Supply Drop)": [
  "Orbital_Supply_Drop",
  "Combat equipment",
  [],
  "Defend the supply drop through its waves and claim the rewards; this is an event, not a harvest node."
 ],
 "Charge Node": [
  "Charge_Node",
  "Required crafting ingredients",
  [],
  "Use a charge node for supported crafting recipes; it is not a gatherable mineral deposit."
 ],
 "Resource Outpost": [
  "Lost_Colony",
  "Scouting / combat gear",
  [],
  "Scout the published outpost and verify its activity and rewards in-game."
 ],
 "Ambergris": [
  "Ambergris",
  "Metal Pick",
  [],
  "Look for green-lined lunar rocks or other documented map-specific sources."
 ],
 "Clay": [
  "Clay",
  "Mortar and Pestle",
  [],
  "Craft from sand and cactus sap, or collect from a documented map-specific deposit where present."
 ],
 "Keratin": [
  "Keratin",
  "Metal Hatchet",
  [
   "Therizinosaurus|Suitable corpse harvesting",
   "Sabertooth|Suitable corpse harvesting"
  ],
  "Harvest appropriate creature remains; mapped deposits are map-specific."
 ],
 "Organic Polymer": [
  "Organic_Polymer",
  "Club / Chainsaw",
  [
   "Moschops|Specialized polymer harvest",
   "Pelagornis|Suitable carcasses",
   "Therizinosaurus|Suitable carcasses or plants"
  ],
  "Collect only what you need; organic polymer spoils."
 ],
 "Rockarrot": [
  "Rockarrot",
  "Hands",
  [],
  "Collect from suitable wild crop plants where present, or grow seeds in crop plots."
 ],
 "Savoroot": [
  "Savoroot",
  "Hands",
  [],
  "Collect from suitable wild crop plants where present, or grow seeds in crop plots."
 ],
 "Wood": [
  "Wood",
  "Metal Hatchet / Chainsaw",
  [
   "Castoroides|Wood harvesting",
   "Roll Rat|Wood harvesting",
   "Therizinosaurus|Wood harvesting",
   "Thorny Dragon|Wood harvesting"
  ],
  "Use a weight-focused mount for long runs."
 ],
 "Stone": [
  "Stone",
  "Metal Hatchet",
  [
   "Doedicurus|Primary stone harvester",
   "Dunkleosteus|Underwater stone nodes"
  ],
  "Target ordinary rocks; use a stone-specialized mount."
 ],
 "Flint": [
  "Flint",
  "Metal Pick",
  [
   "Ankylosaurus|Rock harvesting",
   "Mantis|Equip a pick"
  ],
  "Use a pick rather than a hatchet for flint."
 ],
 "Fiber": [
  "Fiber",
  "Sickle",
  [
   "Therizinosaurus|Delicate gathering attack",
   "Moschops|Bush harvesting",
   "Direbear|Bush harvesting"
  ],
  "Gather bushes; use a sickle before acquiring a dedicated mount."
 ],
 "Thatch": [
  "Thatch",
  "Metal Pick",
  [
   "Megaloceros|Male antler harvest",
   "Brontosaurus|Broad harvesting",
   "Triceratops|Tree harvesting"
  ],
  "Use appropriate tree-harvesting attacks."
 ],
 "Berries": [
  "Berries",
  "Hands",
  [
   "Brontosaurus|Wide-area berry harvest",
   "Triceratops|Early berry mount",
   "Stegosaurus|Berry harvesting"
  ],
  "Gather bushes or cultivate berry crops."
 ],
 "Hide": [
  "Hide",
  "Metal Hatchet",
  [
   "Therizinosaurus|Corpse harvesting",
   "Sabertooth|Corpse harvesting",
   "Direwolf|Corpse harvesting"
  ],
  "Harvest suitable carcasses with a hatchet or specialized mount."
 ],
 "Chitin": [
  "Chitin",
  "Metal Hatchet",
  [
   "Megatherium|Insect harvesting",
   "Sabertooth|Corpse harvesting"
  ],
  "Target insects and other chitin-bearing creatures."
 ],
 "Raw Meat": [
  "Raw_Meat",
  "Metal Pick",
  [
   "Rex|Combat and meat harvesting",
   "Carnotaurus|Meat harvesting",
   "Giganotosaurus|Large-scale meat harvesting"
  ],
  "Harvest carcasses with a carnivore or pick."
 ],
 "Fungal Wood": [
  "Fungal_Wood",
  "Metal Hatchet",
  [
   "Roll Rat|Suitable fungal trees"
  ],
  "Harvest compatible fungal trees in relevant biomes."
 ],
 "Element": [
  "Element",
  "Map-specific event / crafting",
  [],
  "Acquire through supported boss rewards, vein events or map-specific crafting; do not treat every Element source as a mine."
 ]
};
export const farmingResourceNames=Object.keys(raw).sort();
export function canonicalFarmingResource(name){return String(name||'').replace(/ \(Cave\)$/,'').replace(/^Rich Metal$/,'Metal');}
export function farmingGuide(name){const r=raw[canonicalFarmingResource(name)];if(!r)return null;return {resource:name,source:'https://ark.wiki.gg/wiki/'+r[0],tools:r[1],creatures:r[2].map(x=>{const [name,role]=x.split('|');return {name,role};}),tip:r[3]};}
export function farmingMapOptions(resource,coverage){return Object.entries(coverage).flatMap(([map,types])=>{const matched=types.filter(t=>canonicalFarmingResource(t)===canonicalFarmingResource(resource));return matched.length?[{map,layers:matched}]:[];});}

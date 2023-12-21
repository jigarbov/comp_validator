import { Entity, EntityHealthComponent, EntityIsTamedComponent, Player, system } from "@minecraft/server";
import { CraftComputer } from "./CraftComputers";
import { openDualButtonDialogue, openInputDialogue } from "./ScriptDialogue/index";
import { viewSelectRadar } from "./Dialogues/ViewSelectRadar";
import { RadarEntry, viewRadar } from "./Dialogues/ViewRadar";

const MAX_NUMBER_OF_ENTITIES = 10;

export const initRadars = () => {
  system.afterEvents.scriptEventReceive.subscribe((event) => {
    const player = event.initiator;
    const sourceEntity = event.sourceEntity;
    if (player && player instanceof Player && sourceEntity && CraftComputer.isComputer(sourceEntity)) {
      if (event.id === 'jig_ccomp:show_radar') {
        system.runTimeout(async () => {
          while (true) {
            const response = await openInputDialogue(viewSelectRadar(), player);
            if (response.type === "input_dialogue") {
              const { radar } = response.responses;
              const selectedRadar = radar.value as string;
              let radarEntries: Array<RadarEntry>;
              switch (selectedRadar) {
                case "monster":
                  radarEntries = getMonsters(player);
                  break;
                case "tamed":
                  radarEntries = getTamed(player);
                  break;
				case "villager":
					radarEntries = getVillager(player);
					break;
				case "rideable":
						radarEntries = getRidable(player);
						break;
                default:
                  radarEntries = [];
              }

              const innerResponse = await openDualButtonDialogue(viewRadar(selectedRadar, radarEntries), player);
              if (innerResponse.type === "dual_button_dialogue") {
                if (innerResponse.selected === "other-radar") {
                  continue;
                }
              }
            }

            break;
          }
        }, 10);
      }
    }
  }, {
    namespaces: ['jig_ccomp']
  })
}

const toRadarEntry = (entity: Entity): RadarEntry => ({
  location: entity.location,
  nametag: entity.nameTag,
  id: entity.typeId,
  health: (entity.getComponent(EntityHealthComponent.componentId) as EntityHealthComponent).currentValue
})

const getMonsters = (player: Player): Array<RadarEntry> => {
  return player.dimension.getEntities({
    location: player.location,
    families: ['monster'],
    closest: MAX_NUMBER_OF_ENTITIES
  }).map(toRadarEntry);
};
const getVillager = (player: Player): Array<RadarEntry> => {
  return player.dimension.getEntities({
    location: player.location,
    families: ['villager'],
    closest: MAX_NUMBER_OF_ENTITIES
  }).map(toRadarEntry);
};
const getTamed = (player: Player): Array<RadarEntry> => {
  const entities = player.dimension.getEntities({
    location: player.location
  });
  const tamedEntities: Array<RadarEntry> = [];
  for (const entity of entities) {
    if (entity.hasComponent(EntityIsTamedComponent.componentId)) {
      tamedEntities.push(toRadarEntry(entity));
      if (tamedEntities.length >= MAX_NUMBER_OF_ENTITIES) {
        return tamedEntities;
      }
    }
  }

  return tamedEntities;
}
const getRidable = (player: Player): Array<RadarEntry> => {
	const entities = player.dimension.getEntities({
	  location: player.location,
	  excludeTypes: ['player'],
	  excludeFamilies: ['monster'],
	});
	const ridableEntities: Array<RadarEntry> = [];
	const componentId = "minecraft:rideable"
	for (const entity of entities) {
	  if (entity.hasComponent(componentId)) {
		ridableEntities.push(toRadarEntry(entity));
		if (ridableEntities.length >= MAX_NUMBER_OF_ENTITIES) {
		  return ridableEntities;
		}
	  }
	}
  
	return ridableEntities;
  }


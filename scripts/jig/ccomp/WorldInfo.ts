import { Player, system, world } from "@minecraft/server";
import { CraftComputer } from "./CraftComputers";
import { openDualButtonDialogue, openInputDialogue } from "./ScriptDialogue/index";
import { viewBoardsList } from "./Dialogues/ViewBoardsList";
import { viewStats } from "./Dialogues/ViewStats";

export const WORLD_INFO_OBJECTIVE = 'jig_ccomp:world_info';
export const COMPUTER_INFO_OBJECTIVE = 'jig_ccomp:jig_computer.addon_stats';
export const CUSTOM_OBJECTIVES = 'jig_computer.addon_stats';

export class WorldInfo {

  constructor() {
  }

  getObjectives(): Array<string> {
    return [
      WORLD_INFO_OBJECTIVE,
      COMPUTER_INFO_OBJECTIVE,
      ...world
        .scoreboard
        .getObjectives()
        .filter(o => o.id !== COMPUTER_INFO_OBJECTIVE)
        .filter(o => o.id.endsWith(CUSTOM_OBJECTIVES))
        .map(o => o.id)
    ]
  }

  getStats(objective: string): Array<string> {
    return world.scoreboard.getObjective(objective)?.getParticipants().map(p => p.displayName) ?? [];
  }
}

const worldInfo = new WorldInfo();

export const initWorldInfo = () => {
  // Init trackers
  world.afterEvents.entityDie.subscribe(async () => {
    world.scoreboard.getObjective('jig_ccomp:world_info')?.addScore('jig_ccomp:deadentities', 1);
  });
  world.afterEvents.playerPlaceBlock.subscribe(async () => {
    world.scoreboard.getObjective('jig_ccomp:world_info')?.addScore('jig_ccomp:playerplaceblock', 1);
  });
  world.afterEvents.playerBreakBlock.subscribe(async () => {
    world.scoreboard.getObjective('jig_ccomp:world_info')?.addScore('jig_ccomp:playerbreakblock', 1);
  });
  world.afterEvents.buttonPush.subscribe(async () => {
    world.scoreboard.getObjective('jig_ccomp:world_info')?.addScore('jig_ccomp:buttonpush', 1);
  });
  world.afterEvents.leverAction.subscribe(async () => {
    world.scoreboard.getObjective('jig_ccomp:world_info')?.addScore('jig_ccomp:leveraction', 1);
  });
  world.afterEvents.pressurePlatePush.subscribe(async () => {
    world.scoreboard.getObjective('jig_ccomp:world_info')?.addScore('jig_ccomp:pressureplatepush', 1);
  });
  world.afterEvents.tripWireTrip.subscribe(async () => {
    world.scoreboard.getObjective('jig_ccomp:world_info')?.addScore('jig_ccomp:tripwiretrip', 1);
  });

  // Init custom world info
  system.afterEvents.scriptEventReceive.subscribe((event) => {
    const player = event.initiator;
    const sourceEntity = event.sourceEntity;
    if (player && player instanceof Player && sourceEntity && CraftComputer.isComputer(sourceEntity)) {
      const computer = new CraftComputer(sourceEntity);
      if (event.id === 'jig_ccomp:show_stats') {
        system.runTimeout(async () => {
          while (true) {
            const response = await openInputDialogue(viewBoardsList(worldInfo.getObjectives()), player);
            if (response.type === "input_dialogue") {
              const { board } = response.responses;
              if (board && board.value) {
                const innerResponse = await openDualButtonDialogue(viewStats(board.value as string, worldInfo.getStats(board.value as string)), player);
                if (innerResponse.type === "dual_button_dialogue") {
                  if (innerResponse.selected === "other-stats") {
                    continue;
                  }
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
  });
}

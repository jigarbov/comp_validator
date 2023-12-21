import { Player, system, world,ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import { CraftComputer } from "./CraftComputers";
import { openDualButtonDialogue, openInputDialogue } from "./ScriptDialogue/index";
import { viewBoardsList } from "./Dialogues/ViewBoardsList";
import { viewStats } from "./Dialogues/ViewStats";

export const COMPUTER_INFO_OBJECTIVE = "If it doesn't show here it's broken";
export const CUSTOM_OBJECTIVES = 'jig_computer.addon_stats';

export class WorldInfo {

  constructor() {
  }

  getObjectives(): Array<string> {
    return [
      ...world
        .scoreboard
        .getObjectives()
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
    // Init custom world info
  system.afterEvents.scriptEventReceive.subscribe((event: ScriptEventCommandMessageAfterEvent) => {
    const player = event.sourceEntity;
    const sourceEntity = event.sourceEntity;
    if (player && player instanceof Player && sourceEntity) {
      const computer = new CraftComputer(sourceEntity);
      if (event.id === 'jig_ccomp:show_stats_validator') {
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

import {
	Player,
	system,
	world,
} from "@minecraft/server";
import { CraftComputer, CraftComputers } from "./CraftComputers";
import { initWorldInfo, WorldInfo } from "./WorldInfo";

const test_script_event = "jig_ccomp:test_computers_information";

world.afterEvents.playerSpawn.subscribe(async (event) => {
        if (event.player.hasTag('has_jig_ccomp_book')) {
        }
		else {
            event.player.runCommand("function jig/ccomp/book_giver");
        }
    });
initWorldInfo();

const craftComputers = new CraftComputers();

type NpcDialogueFollowUp = (player: Player, computer: CraftComputer) => Promise<void>;

system.runTimeout(() => {
	craftComputers.init(world.getDimension("overworld"));
}, 50);
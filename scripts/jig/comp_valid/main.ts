import {
	Entity, EntityInventoryComponent, Vector3, Player,
	ScriptEventCommandMessageAfterEvent,
	system,
	world,
} from "@minecraft/server";
import { CraftComputer, CraftComputers } from "./CraftComputers";
import { debug } from "./Utils";
import { openButtonDialogue, openInputDialogue } from "./ScriptDialogue/index";
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

// 50 is a "random" number, we might need a better way to know when we can
// init computer world stuff - maybe on the first player spawn - other day's
// problem
system.runTimeout(() => {
	craftComputers.init(world.getDimension("overworld"));
}, 50);


//doesnt work??
//world.afterEvents.blockExplode.subscribe(async () => {
//	world.scoreboard.getObjective('jig_ccomp:world_info')?.addScore('jig_ccomp.blockexplode', 1);		
//});

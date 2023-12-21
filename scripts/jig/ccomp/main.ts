import {
	Entity, EntityInventoryComponent, Vector3, Player,
	ScriptEventCommandMessageAfterEvent,
	system,
	world,
} from "@minecraft/server";
import { CraftComputer, CraftComputers } from "./CraftComputers";
import { debug } from "./Utils";
import { setPcIdDialogue } from "./Dialogues/SetPcId";
import { openButtonDialogue, openInputDialogue } from "./ScriptDialogue/index";
import { EmailAttachment, EmailRecipient, sendEmailDialogue } from "./Dialogues/SendEmail";
import { readEmailDialogue } from "./Dialogues/ReadEmail";
import { initWorldInfo, WorldInfo } from "./WorldInfo";
import { initRadars } from "./Radar";
import { initWeather } from "./Weather";
import { printContent } from "./Print";

const light_level_update = "jig_ccomp:update_light_level";
const portable_options = "jig_ccomp:portable_options";
const bug_smash_print = "jig_ccomp:bug_smash_print";

world.afterEvents.playerSpawn.subscribe(async (event) => {
        if (event.player.hasTag('has_jig_ccomp_book')) {
        }
		else {
            event.player.runCommand("function jig/ccomp/book_giver");
        }
    });
	world.beforeEvents.itemUse.subscribe((event) => {
		const { source, itemStack } = event;	
		if (itemStack.typeId === "jig_ccomp:mob_paper") {
			source.sendMessage("You used the mob map... but it doesn't have any data. Print one using the radar to find mobs!");
		}
	});
system.afterEvents.scriptEventReceive.subscribe(function (event: ScriptEventCommandMessageAfterEvent) {
	if (event.id === bug_smash_print) {
		const player = event.initiator;
		const sourceEntity = event.sourceEntity;
		if (player && player instanceof Player && sourceEntity && CraftComputer.isComputer(sourceEntity)) {
			
		let this_game = world.scoreboard.getObjective('jig_ccomp:bug_smash')?.getScore(player)|| 0
		let paper = "jig_ccomp:printed_paper"
		let s = ""
		if (this_game !== 1){
			s = "s"
		}
		if (this_game < 10){
			paper = "jig_ccomp:old_bug_paper"
		}
		if (this_game >= 10 && this_game <= 99){
			paper = "jig_ccomp:ok_bug_paper"
		}
		if (this_game >= 100){
			paper = "jig_ccomp:good_bug_paper"
		}
			const computer = new CraftComputer(sourceEntity);
				printContent(
					player.name+`'s §bBug Smash§f Scorecard`,
					`You §csmashed§5 §l`+this_game+`§r§o§5 bug`+s+`!`,
					computer,
					player,
					paper
				);
		}
	}
		if (event.id === light_level_update) {
			if (event.sourceEntity instanceof Entity) {
				const round = (value: number) => {
					return Math.round(value * 100) / 100;
				  }
				let showcoordinates = event.sourceEntity.getProperty("jig_ccomp:show_coordinates")
				let showlightlevel = event.sourceEntity.getProperty("jig_ccomp:show_lightlevel")
				let showbiome = event.sourceEntity.getProperty("jig_ccomp:show_biome")
				let coordinates = event.sourceEntity.location
				let light_level = event.sourceEntity.getProperty("jig_ccomp:light_level")
				let biome = event.sourceEntity.getProperty("jig_ccomp:biome")
				switch (biome) {
					//all of these should be rawtext strings too
					case 0:biome = 'Unknown';break;
					case 1:biome = 'Basalt Delta';break;
					case 2:biome = 'Beach';break;
					case 3:biome = 'Birch';break;
					case 4:biome = 'Caves';break;
					case 5:biome = 'Cherry Grove';break;
					case 6:biome = 'Crimson Forest';break;
					case 7:biome = 'Dark Oak Forest';break;
					case 8:biome = 'Deep';break;
					case 9:biome = 'Deep Dark';break;
					case 10:biome = 'Desert';break;
					case 11:biome = 'Dripstone Caves';break;
					case 12:biome = 'Edge';break;
					case 13:biome = 'Extreme Hills';break;
					case 14:biome = 'Flower Forest';break;
					case 15:biome = 'Forest';break;
					case 16:biome = 'Frozen';break;
					case 17:biome = 'Frozen Peaks';break;
					case 18:biome = 'Grove';break;
					case 19:biome = 'Hills';break;
					case 20:biome = 'Ice';break;
					case 21:biome = 'Ice Plains';break;
					case 22:biome = 'Jagged Peaks';break;
					case 23:biome = 'Jungle';break;
					case 24:biome = 'Lakes';break;
					case 25:biome = 'Lush Cave';break;
					case 26:biome = 'Mangrove Swamp';break;
					case 27:biome = 'Mega';break;
					case 28:biome = 'Mesa';break;
					case 29:biome = 'Mooshroom Island';break;
					case 30:biome = 'Mountain';break;
					case 31:biome = 'Mutated Biome';break;
					case 32:biome = 'Nether';break;
					case 33:biome = 'Nether Wastes';break;
					case 34:biome = 'Netherwart Forest';break;
					case 35:biome = 'Ocean';break;
					case 36:biome = 'Plains';break;
					case 37:biome = 'Plateau';break;
					case 38:biome = 'River';break;
					case 39:biome = 'Roofed Forest';break;
					case 40:biome = 'Savanna';break;
					case 41:biome = 'Shore';break;
					case 42:biome = 'Snowy Slopes';break;
					case 43:biome = 'Soulsand Valley';break;
					case 44:biome = 'Stone Beach';break;
					case 45:biome = 'Swamp';break;
					case 46:biome = 'Taiga';break;
					case 47:biome = 'The End';break;
					case 48:biome = 'Warped Forest';break;
				  }
				  let key = ""
				  if (showcoordinates) {
					key = key +`x: ${round(coordinates.x)}, y: ${round(coordinates.y)}, z: ${round(coordinates.z)}`
				}
				if (showbiome) {
				  key = key +"\nBiome: "+ biome
			  }
			  if (showlightlevel) {
				key = key +"\nLight Level: "+light_level
			}
				event.sourceEntity.nameTag = key
			}
		}
});

initWorldInfo();
initRadars();
initWeather();

const craftComputers = new CraftComputers();

world.afterEvents.entitySpawn.subscribe((event) => {
	craftComputers.addComputer(event.entity);
});

world.afterEvents.entityLoad.subscribe((event) => {
	craftComputers.addComputer(event.entity);
})

world.beforeEvents.entityRemove.subscribe((event) => {
	craftComputers.removeComputer(event.removedEntity);
});

type NpcDialogueFollowUp = (player: Player, computer: CraftComputer) => Promise<void>;

const viewComputerId: NpcDialogueFollowUp = async (player, computer) => {
	computer.say(`My PC ID is ${computer.getName()}`, player);
};

const setComputerId: NpcDialogueFollowUp = async (player, computer) => {
	const response = await openInputDialogue(
		setPcIdDialogue(computer.getName()),
		player
	);

	if (response.type === "input_dialogue") {
		const name = response.responses['name'].value as string;
		if (name.length > 0) {
			debug(`Setting PC name to ${name} for computer ${computer.getId()}`);
			computer.setName(name);
			computer.computer.triggerEvent('jig_ccomp:typing')
		}
	}
}

const sendEmail: NpcDialogueFollowUp = async (player, computer) => {
	// Todo: Add input handling, show a message and redraw with whatever the user had
	//  if additional input is needed

	const playerInventory = player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
	const emailAttachments: Array<EmailAttachment> = [];
	if (playerInventory?.container) {
		const container = playerInventory.container;
		// Get action bar items
		for (let i = 0; i < 9; ++i) {
			const item = container.getItem(i);
			if (item) {
				emailAttachments.push({
					item,
					index: i,
					container
				});
			}
		}
		computer.computer.triggerEvent('jig_ccomp:typing')
	}

	const emailRecipients: Array<EmailRecipient> = craftComputers.getComputers().filter(c => c.getId() !== computer.getId()).map(c => ({
		name: `${c.getName()} (${c.getId().substring(0, 4)})`,
		id: c.getId()
	}));

	const response = await openInputDialogue(
		sendEmailDialogue(emailRecipients, emailAttachments),
		player
	);

	if (response.type === "input_dialogue") {
		const { to, subject, message, attachment } = response.responses;
		let itemToAttach: EmailAttachment | undefined;
		if (attachment.value !== 'none') {
			itemToAttach = emailAttachments[parseInt(attachment.value as string)];
			world.scoreboard.getObjective('jig_ccomp:jig_computer.addon_stats')?.addScore('jig_ccomp:attachments_sent', 1);
		}


		const targetComputer = craftComputers.getComputer(to.value as string)!;
		const emailSent = targetComputer.addEmail({
			from_computer_id: computer.getId(),
			from_computer_name: computer.getName(),
			from_player: player.name,
			subject: subject.value as string,
			message: message.value as string,
		}, itemToAttach);

		if (emailSent) {
			world.scoreboard.getObjective('jig_ccomp:jig_computer.addon_stats')?.addScore('jig_ccomp:emails_sent', 1);
			computer.computer.triggerEvent('jig_ccomp:typing')
			targetComputer.computer.triggerEvent('jig_ccomp:screen_emai')
			debug(`Player ${player.name} sent an email from computer ${computer.getName()} to computer ${targetComputer.getName()} with the subject: ${subject.value}`);
		}
	}
}

const readEmails: NpcDialogueFollowUp = async (player, computer) => {
	const emails = computer.getEmails();
	const paper = "jig_ccomp:printed_paper";
	if (emails.length > 0) {
		const response = await openButtonDialogue(
			readEmailDialogue(emails),
			player
		);
		computer.computer.triggerEvent('jig_ccomp:typing')

		// Todo: Add helper method to make it easier to get nested data
		if (
			response.type === "button_dialogue" && // Select your email
			response.dialogueResponse?.type === "dual_button_dialogue" &&  //  Read your email
			response.dialogueResponse.selected === "more" && // Read your email: more
			response.dialogueResponse.dialogueResponse?.type === "button_dialogue") { // Select action
			const selectedEmail = parseInt(response.selected);
			const selectionAction = response.dialogueResponse.dialogueResponse.selected;

			if (selectionAction === "download") {
				if (computer.downloadAttachment(selectedEmail, player)) {
					debug(`File downloaded from computer: ${computer.getName()} to player: ${player.name}`);
				}
				computer.computer.triggerEvent('jig_ccomp:typing')
			} else if(selectionAction === "delete") {
				computer.deleteEmail(selectedEmail);
				debug(`Email deleted from computer: ${computer.getName()}`);
				computer.computer.triggerEvent('jig_ccomp:typing')
			} else if (selectionAction === "print") {
				const email = computer.getEmails()[selectedEmail];
				printContent(
					`Email from: ${email.from_player}`,
					`${email.subject}\n\n${email.message}`,
					computer,
					player,
					paper
				);
			}
			computer.computer.triggerEvent('jig_ccomp:typing')

		}
		computer.computer.triggerEvent('jig_ccomp:typing')
	} else {
		computer.computer.runCommand("/dialogue open @s "+player.name+" jig_ccomp:old_pc_noem");
	}
}

// Process dialogue scriptevents
system.afterEvents.scriptEventReceive.subscribe(async (event) => {
	const player = event.initiator;
	const sourceEntity = event.sourceEntity;
	if (player && player instanceof Player && sourceEntity && CraftComputer.isComputer(sourceEntity)) {
		const computer = new CraftComputer(sourceEntity);
		let npcDialogueFollowUp: NpcDialogueFollowUp | undefined;

		if (event.id === 'jig_ccomp:view_pc_id') {
			npcDialogueFollowUp = viewComputerId;
		} else if (event.id === 'jig_ccomp:set_pc_id') {
			npcDialogueFollowUp = setComputerId;
		} else if (event.id === 'jig_ccomp:send_email') {
			npcDialogueFollowUp = sendEmail;
		} else if (event.id === 'jig_ccomp:read_emails') {
			npcDialogueFollowUp= readEmails;
		}
		if (npcDialogueFollowUp) {
			system.runTimeout(async () => {
				void npcDialogueFollowUp!(player, computer);
			}, 10);
		}
	}
});


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

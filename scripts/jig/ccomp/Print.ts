import { CraftComputer } from "./CraftComputers";
import { EntityInventoryComponent, ItemStack, Player } from "@minecraft/server";
import { debug } from "./Utils";
import { getEmptySlot, getSlotByCondition } from "./Container";

const CHARS_PER_LINE = 40;

export const printContent = (title: string, content: string, computer: CraftComputer, player: Player, paper: string) => {
  const printers = computer.computer.dimension.getEntities({
    families: ["printer"],
    closest: 1,
    maxDistance: 10,
    location: computer.computer.location
  });

  if (printers.length === 0) {
    debug("Could not find a printer");
    return;
  }

  const printer = printers[0];
  const container = (printer.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent).container!;

  const hasEmptySpace = container.emptySlotsCount > 0;
  const paperSlot = getSlotByCondition(container, (item: ItemStack) => {
    if (item.typeId === "minecraft:paper" && item.getLore().length === 0) {
      return hasEmptySpace || item.amount === 1;
    }

    return false;
  });

  if (paperSlot === undefined) {
    if (hasEmptySpace) {
      debug("Found no space to put the new paper");
    } else {
      debug("The printer is out of paper");
    }

    return;
  }

  const item = container.getItem(paperSlot)!;
  const printedPaper = new ItemStack(paper, 1);

  if (item.amount === 1) {
    container.setItem(paperSlot);
  } else {
    item.amount = item.amount - 1;
    container.setItem(paperSlot, item);
  }

  printedPaper.nameTag = title;
  writeContent(printedPaper, content);
  printer.triggerEvent('jig_ccomp:printing')
  const emptySlot = getEmptySlot(container)!;
  container.setItem(emptySlot, printedPaper);
}

const writeContent = (paper: ItemStack, content: string) => {
  const loreList: Array<string> = [];
  content.split("\n").forEach(line => {
    do {
      const result = getNextLine(line);
      line = result[1];
      loreList.push(result[0]);
    } while(line.length > 0);
  });
  paper.setLore(loreList);
}

const getNextLine = (content: string): [string, string] => {
  let nextLine = '';
  const words = content.split(' ');
  while (words.length > 0) {
    if (nextLine.length + words[0].length <= CHARS_PER_LINE) {
      nextLine= `${nextLine} ${words.shift()}`.trim();
    } else if (words[0].length > CHARS_PER_LINE) {
      nextLine= `${nextLine} ${words[0].substring(0, CHARS_PER_LINE)}`.trim();
      words[0] = words[0].substring(CHARS_PER_LINE);
    } else {
      break;
    }
  }

  return [nextLine, words.join(' ')];
};

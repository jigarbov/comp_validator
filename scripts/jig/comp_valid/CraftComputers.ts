import { Dimension, Entity, EntityInventoryComponent, ItemStack, Player, world } from "@minecraft/server";
import { makeRandomId } from "./Random";

const enum COMPUTER_PROPERTIES {
  COMPUTER_ID = 'jig_ccomp:COMPUTER_ID',
  COMPUTER_NAME = 'jig_ccomp:COMPUTER_NAME',
  EMAILS = 'jig_ccomp:EMAILS'
}

const VALID_COMPUTERS_TYPES: Array<string> = [
  'minecraft:player',
];

export interface CraftComputerEmail {
  from_player: string;
  from_computer_id: string;
  from_computer_name: string;
  subject: string;
  message: string;
  attachment?: number;
}

export class CraftComputer {
  readonly computer: Entity;

  static isComputer(maybeComputer: Entity): boolean {
    return VALID_COMPUTERS_TYPES.includes(maybeComputer.typeId);
  }

  static shortId(id: string) {
    return id.substring(0, 4);
  }

  constructor(entity: Entity) {
    if (!CraftComputer.isComputer(entity)) {
      throw new Error('Not a computer');
    }

    this.computer = entity;

    let computerId = this.getProp(COMPUTER_PROPERTIES.COMPUTER_ID);
    if (!computerId || typeof computerId !== 'string') {
      computerId = makeRandomId();
      this.setProp(COMPUTER_PROPERTIES.COMPUTER_ID, computerId);
    }

    let computerName = this.getProp(COMPUTER_PROPERTIES.COMPUTER_NAME);
    if (!computerName || typeof computerName !== 'string') {
      computerName = computerId;
      this.setProp(COMPUTER_PROPERTIES.COMPUTER_NAME, computerName);
    }
  }

  getId(): string {
    return this.getProp(COMPUTER_PROPERTIES.COMPUTER_ID) as string;
  }

  getShortId(): string {
    return CraftComputer.shortId(this.getId());
  }

  getName(): string {
    return this.getProp(COMPUTER_PROPERTIES.COMPUTER_NAME) as string;
  }

  setName(name: string) {
    return this.setProp(COMPUTER_PROPERTIES.COMPUTER_NAME, name);
  }

  say(message: string, player: Player) {
    void this.computer.runCommandAsync(`w ${player.name} ${message}`);
  }

  private getProp(property: COMPUTER_PROPERTIES, defaultValue?: string | number | boolean) {
    return this.computer.getDynamicProperty(property) ?? defaultValue;
  }

  private setProp(property: COMPUTER_PROPERTIES, value: string) {
    this.computer.setDynamicProperty(property, value);
  }
}

export class CraftComputers {

  private readonly computers: Record<string, CraftComputer> = {};
  private readonly dimensions: Array<Dimension> = [];

  init(dimension: Dimension) {
    if (this.dimensions.includes(dimension)) {
      return;
    }

    this.dimensions.push(dimension);

    for (const computerType of VALID_COMPUTERS_TYPES) {
      dimension.getEntities({
        type: computerType
      }).forEach((computer) => {
        this.addComputer(computer);
      });
    }
  }

  addComputer(entity: Entity) {
    if (!CraftComputer.isComputer(entity)) {
      return;
    }

    const computer = new CraftComputer(entity);
    this.computers[computer.getId()] = computer;
  }


  getComputers() {
    return Object.values(this.computers).filter(c => c.computer.isValid());
  }

  getComputer(id: string) {
    if (id in this.computers && this.computers[id].computer.isValid()) {
      return this.computers[id];
    }

    return undefined;
  }
}

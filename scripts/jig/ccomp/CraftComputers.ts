import { Dimension, Entity, EntityInventoryComponent, ItemStack, Player, world } from "@minecraft/server";
import { makeRandomId } from "./Random";
import { debug } from "./Utils";
import { EmailAttachment } from "./Dialogues/SendEmail";
import { getEmptySlot } from "./Container";

const enum COMPUTER_PROPERTIES {
  COMPUTER_ID = 'jig_ccomp:COMPUTER_ID',
  COMPUTER_NAME = 'jig_ccomp:COMPUTER_NAME',
  EMAILS = 'jig_ccomp:EMAILS'
}

const VALID_COMPUTERS_TYPES: Array<string> = [
  'jig_ccomp:computer_old',
  'jig_ccomp:computer_ok',
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
      debug(`Generating id ${computerId} for new computer`);
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

  getEmails(): Array<CraftComputerEmail> {
    return JSON.parse(
      this.getProp(COMPUTER_PROPERTIES.EMAILS, '[]') as string
    ) as Array<CraftComputerEmail>;
  }

  setEmails(emails: Array<CraftComputerEmail>) {
    this.setProp(COMPUTER_PROPERTIES.EMAILS, JSON.stringify(emails));
  }

  addEmail(email: CraftComputerEmail, attachment?: EmailAttachment): boolean {
    if (attachment) {
      const inventory = this.computer.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
      if (inventory.container) {
        const container = inventory.container;
        const emptySlot = getEmptySlot(container);
        if (emptySlot !== undefined) {
          attachment.container.setItem(attachment.index);
          container.setItem(emptySlot, attachment.item);
          email.attachment = emptySlot;
        } else {
          return false;
        }
      }
    }

    this.setEmails([...this.getEmails(), email]);
    return true;
  }

  downloadAttachment(emailIndex: number, player: Player): boolean {
    // Todo: this is simpler in later versions
    const playerContainer = (player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent)?.container;
    const computerContainer = (this.computer.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent)?.container;
    const emails = this.getEmails();
    const email = emails[emailIndex];

    if (email.attachment !== undefined && email.attachment >= 0 && playerContainer && computerContainer) {
      const emptySlot = getEmptySlot(playerContainer);
      if (emptySlot !== undefined) {
        const item = computerContainer.getItem(email.attachment)!;
        computerContainer.setItem(email.attachment);
        playerContainer.setItem(emptySlot, item);
        email.attachment = -1;
        this.setEmails(emails);
      }
    }

    return false;
  }

  deleteEmail(emailIndex: number) {
    const emails = this.getEmails();
    emails.splice(emailIndex, 1);
    this.setEmails(emails);
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

  removeComputer(entity: Entity) {
    if (!CraftComputer.isComputer(entity) && entity.isValid()) {
      return;
    }

    const computer = new CraftComputer(entity);
    const computerId = computer.getId();

    delete this.computers[computerId];
    debug(`Removing computer ${computerId}`);
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

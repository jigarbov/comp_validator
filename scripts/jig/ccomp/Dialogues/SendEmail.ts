import { InputDialogue } from "../ScriptDialogue/types";
import { ITEM, RAW_TEXT, TEXT, TRANSLATE } from "../Utils";
import { Container, ItemStack } from "@minecraft/server";

export interface EmailRecipient {
  id: string;
  name: string;
}

export interface EmailAttachment {
  container: Container;
  index: number
  item: ItemStack;
}

export const sendEmailDialogue = (targets: Array<EmailRecipient>, attachments: Array<EmailAttachment>): InputDialogue => {
  return {
    type: "input_dialogue",
    title: TRANSLATE("jig_ccomp:pc-email-send.title"),
    inputs: [
      {
        type: "dropdown",
        name: "to",
        label: TRANSLATE("jig_ccomp:pc-email-send.inputs.to.label"),
        options: targets.map(t => ({
          name: t.id,
          option: t.name
        }))
      },
      {
        type: "dropdown",
        name: "attachment",
        label: TRANSLATE("jig_ccomp:pc-email-send.inputs.attachment.label"),
        options: [
          {
            name: "none",
            option: TRANSLATE("jig_ccomp:pc-email-send.inputs.attachment.none")
          },
          ...attachments.map((a, index) => ({
            name: index.toString(),
            option: RAW_TEXT(
              ITEM(a.item),
              TEXT(` ${a.item.isStackable ? `x${a.item.amount}` : '' }`.trimEnd())
            ),
          }))
        ],
        defaultValue: 'none'
      },
      {
        type: "text",
        name: "subject",
        label: TRANSLATE("jig_ccomp:pc-email-send.inputs.subject.label"),
        placeholder: TRANSLATE("jig_ccomp:pc-email-send.inputs.subject.placeholder"),
      },
      {
        type: "text",
        name: "message",
        label: TRANSLATE("jig_ccomp:pc-email-send.inputs.message.label"),
        placeholder: TRANSLATE("jig_ccomp:pc-email-send.inputs.message.placeholder"),
      }
    ]
  };
};

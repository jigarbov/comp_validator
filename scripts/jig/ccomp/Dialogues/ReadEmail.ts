import { ButtonDialogue } from "../ScriptDialogue/types";
import { RAW_TEXT, TEXT, TRANSLATE } from "../Utils";
import { CraftComputer, CraftComputerEmail } from "../CraftComputers";
import { RawMessage } from "@minecraft/server";

export const readEmailDialogue = (emails: Array<CraftComputerEmail>): ButtonDialogue => {
  return {
    type: "button_dialogue",
    title: TRANSLATE("jig_ccomp:pc-email-read.title"),
    buttons: emails.map((e, index) => ({
      name: index.toString(),
      text: `${e.from_player}: ${e.subject}`,
      dialogue: {
        type: "dual_button_dialogue",
        title: `Subject: ${e.subject}`,
        body: RAW_TEXT(
          TRANSLATE("jig_ccomp:email.from"),
          TEXT(": "), TEXT(e.from_player),
          TEXT("\n"),
          TRANSLATE("jig_ccomp:email.mailed-by"),
          TEXT(": "), TEXT(`${e.from_computer_name} (${CraftComputer.shortId(e.from_computer_id)})`),
          TEXT("\n"),
          ...getAttachmentContent(e),
          TEXT("\n"),
          TEXT(e.message)
        ),
        topButton: {
          name: "more",
          text: TRANSLATE("jig_ccomp:pc-email-read.button.more"),
          dialogue: {
            type: "button_dialogue",
            title: `Subject: ${e.subject}`,
            body: TRANSLATE("jig_ccomp:pc-email-read-more.body"),
            buttons: [
              {
                name: "print",
                text: TRANSLATE("jig_ccomp:pc-email-read-more.button.print")
              },
              ...((e.attachment !== undefined && e.attachment !== -1) ? [
                {
                  name: "download",
                  text: TRANSLATE("jig_ccomp:pc-email-read-more.button.download")
                }
              ]: []),
              {
                name: "delete",
                text: TRANSLATE("jig_ccomp:pc-email-read-more.button.delete")
              },
              {
                name: "close",
                text: TRANSLATE("jig_ccomp:pc-email-read.button.close")
              }
            ]
          }
        },
        bottomButton: {
          name: "close",
          text: TRANSLATE("jig_ccomp:pc-email-read.button.close")
        },
      }
    }))
  };
};

const getAttachmentContent = (email: CraftComputerEmail): Array<RawMessage> => {
  switch (email.attachment) {
    case undefined:
      return [];
    case -1:
      return [TRANSLATE('jig_ccomp:email.attachment-downloaded')];
    default:
      return [TRANSLATE('jig_ccomp:email.attachment')];
  }
}

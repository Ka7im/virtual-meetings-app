import { createNewConversation } from "../../api/createNewConversation";
import { findConversation } from "../../api/findConversation";

export const createOrFindConversation = async (
  firstMemberId: string,
  secondMemberId: string,
) => {
  let conversation =
    (await findConversation(firstMemberId, secondMemberId)) ||
    (await findConversation(secondMemberId, firstMemberId));

  if (!conversation) {
    conversation = await createNewConversation(firstMemberId, secondMemberId);
  }

  return conversation;
};
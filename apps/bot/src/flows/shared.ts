import { container } from '../composition';
import type { BotContext, BotConversation } from '../context';

/** Telegram faylini yuklab olib, Supabase storage'ga yozadi va ommaviy URL qaytaradi. */
export async function uploadTelegramFile(
  conversation: BotConversation,
  ctx: BotContext,
  fileId: string,
  folder: string,
  contentType: string,
  ext: string,
): Promise<string | undefined> {
  return conversation.external(async () => {
    const file = await ctx.api.getFile(fileId);
    if (!file.file_path) return undefined;
    const resp = await fetch(
      `https://api.telegram.org/file/bot${container.env.botToken}/${file.file_path}`,
    );
    const bytes = new Uint8Array(await resp.arrayBuffer());
    const path = `${folder}/${container.ids.generate()}.${ext}`;
    const stored = await container.storage.upload({
      bucket: 'invitations',
      path,
      bytes,
      contentType,
    });
    return stored.url;
  });
}

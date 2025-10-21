/**
 * Format AI responses for display
 * - Hide <think> tags from user (but keep in DOM for debugging)
 * - Convert markdown to HTML
 */

export function removeThinkTags(content: string): string {
  // Remove <think>...</think> tags and their content for display
  return content.replace(/<think>[\s\S]*?<\/think>/gi, '');
}

export function formatMarkdown(content: string): string {
  let formatted = content;

  // Bold: **text** -> <strong>text</strong>
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic: *text* -> <em>text</em>
  formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
  formatted = formatted.replace(/_(.+?)_/g, '<em>$1</em>');

  // Line breaks
  formatted = formatted.replace(/\n/g, '<br/>');

  return formatted;
}

export function formatAIResponse(content: string, useMarkdown: boolean = true): string {
  // First remove think tags
  let formatted = removeThinkTags(content);

  // Then apply markdown if requested
  if (useMarkdown) {
    formatted = formatMarkdown(formatted);
  }

  return formatted;
}

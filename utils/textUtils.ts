export function highlightKeywords(text: string, keywords: string[]): string {
  // Prepare keywords: split multi-word keywords and flatten the array
  const allKeywords = keywords.flatMap(keyword => keyword.split(/\s+/));
  const keywordRegex = new RegExp(allKeywords.map(k => `\\b${k}\\b`).join('|'), 'gi');

  // Find all matches
  const matches = Array.from(text.matchAll(keywordRegex));
  if (matches.length === 0) return text.length > 200 ? text.slice(0, 200) + '...' : text;

  // Find the best match (prioritize multi-word keywords)
  let bestMatch = matches[0];
  for (const match of matches) {
    const fullKeyword = keywords.find(k => k.toLowerCase().includes(match[0].toLowerCase()));
    if (fullKeyword && text.toLowerCase().includes(fullKeyword.toLowerCase())) {
      bestMatch = match;
      break;
    }
  }

  // Extract relevant portion of text
  let startIndex = Math.max(0, bestMatch.index - 50);
  let endIndex = Math.min(text.length, bestMatch.index + bestMatch[0].length + 100);
  let highlightedText = text.slice(startIndex, endIndex);

  // Add ellipsis if necessary
  if (startIndex > 0) highlightedText = '...' + highlightedText;
  if (endIndex < text.length) highlightedText += '...';

  // Highlight all keywords in the extracted text
  allKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });

  return highlightedText;
}

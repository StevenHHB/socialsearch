/**
 * Utility functions for XML handling and escaping
 */

/**
 * Escapes special characters in XML content
 * @param unsafe - The string containing potentially unsafe XML characters
 * @returns The escaped XML-safe string
 */
export function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Formats a date for XML sitemap use
 * @param date - Date string or Date object
 * @returns ISO formatted date string
 */
export function formatXmlDate(date: string | Date): string {
  if (!date) return new Date().toISOString();
  return new Date(date).toISOString();
}

/**
 * Validates XML element names
 * @param name - The proposed XML element name
 * @returns boolean indicating if the name is valid
 */
export function isValidXmlName(name: string): boolean {
  if (!name) return false;
  // XML element names must start with a letter or underscore
  const validStart = /^[a-zA-Z_]/;
  // Can contain letters, digits, hyphens, underscores, and periods
  const validChars = /^[a-zA-Z0-9\-._]+$/;
  
  return validStart.test(name) && validChars.test(name);
}

/**
 * Creates a CDATA section for XML
 * @param content - The content to wrap in CDATA
 * @returns CDATA wrapped content
 */
export function wrapCdata(content: string): string {
  if (!content) return '';
  return `<![CDATA[${content}]]>`;
}

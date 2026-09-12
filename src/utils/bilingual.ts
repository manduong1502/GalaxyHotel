// =========================================================================
// GALAXY BOUTIQUE HOTEL - BILINGUAL HELPER UTILITIES
// Safe extraction & fallback for localized string and array fields
// =========================================================================

export type LocalizedText = string | { vi?: string; en?: string } | undefined | null;
export type LocalizedList = string[] | { vi?: string[]; en?: string[] } | undefined | null;

/**
 * Safely extracts a localized string for the current language ('vi' | 'en')
 * Supports both bilingual objects { vi: '...', en: '...' } and legacy plain strings.
 */
export function getBilingualText(field: LocalizedText, lang: 'vi' | 'en' = 'vi', fallback: string = ''): string {
  if (field === undefined || field === null) return fallback;
  if (typeof field === 'string') return field;
  if (typeof field === 'object') {
    const direct = field[lang];
    if (direct && typeof direct === 'string' && direct.trim() !== '') {
      return direct;
    }
    // Fallback to Vietnamese, then English, then default fallback
    const alt = field['vi'] || field['en'];
    if (alt && typeof alt === 'string' && alt.trim() !== '') {
      return alt;
    }
  }
  return fallback;
}

/**
 * Safely extracts a localized array of strings for the current language
 * Supports both { vi: [...], en: [...] } and legacy string[].
 */
export function getBilingualList(field: LocalizedList, lang: 'vi' | 'en' = 'vi', fallback: string[] = []): string[] {
  if (!field) return fallback;
  if (Array.isArray(field)) return field;
  if (typeof field === 'object') {
    const direct = field[lang];
    if (Array.isArray(direct) && direct.length > 0) {
      return direct;
    }
    const alt = field['vi'] || field['en'];
    if (Array.isArray(alt) && alt.length > 0) {
      return alt;
    }
  }
  return fallback;
}

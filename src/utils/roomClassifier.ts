import { Room } from '../types';

/**
 * Checks if a room belongs to "Phòng đơn & đôi ( 1-2 khách )"
 */
export function isSingleOrDoubleRoom(room: Room): boolean {
  const nameVi = (room.name?.vi || '').toLowerCase();
  const nameEn = (room.name?.en || '').toLowerCase();
  const subtitleVi = (room.subtitle?.vi || '').toLowerCase();
  const combinedText = `${nameVi} ${nameEn} ${subtitleVi}`;

  // Explicit family / group / triple patterns that should NEVER be in single/double
  const isTripleOrFamily = 
    combinedText.includes('3 người') ||
    combinedText.includes('3 khách') ||
    combinedText.includes('4 người') ||
    combinedText.includes('4 khách') ||
    combinedText.includes('5 người') ||
    combinedText.includes('5 khách') ||
    combinedText.includes('6 người') ||
    combinedText.includes('6 khách') ||
    combinedText.includes('gia đình') ||
    combinedText.includes('nhóm') ||
    combinedText.includes('triple') ||
    combinedText.includes('family') ||
    combinedText.includes('quadruple') ||
    (room.maxAdults !== undefined && room.maxAdults >= 3);

  if (isTripleOrFamily) {
    return false;
  }

  // Explicit 1-2 guests patterns
  const is1or2 = 
    combinedText.includes('đơn') ||
    combinedText.includes('1 khách') ||
    combinedText.includes('1 người') ||
    combinedText.includes('phòng đôi') ||
    combinedText.includes('2 khách') ||
    combinedText.includes('2 người') ||
    combinedText.includes('máy chiếu') ||
    combinedText.includes('giường tầng') ||
    combinedText.includes('single') ||
    combinedText.includes('double') ||
    (room.maxAdults !== undefined && room.maxAdults <= 2);

  return is1or2;
}

/**
 * Checks if a room belongs to "Phòng nhóm & gia đình ( 3-6 khách )"
 */
export function isGroupOrFamilyRoom(room: Room): boolean {
  return !isSingleOrDoubleRoom(room);
}

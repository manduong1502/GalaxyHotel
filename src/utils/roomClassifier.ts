import { Room } from '../types';

/**
 * Checks if a room belongs to "Phòng đơn & đôi ( 1-2 khách )"
 * Strict rule: ONLY 1-2 guests (maxAdults === 1 or 2, single/double/projector/bunk bed rooms).
 * NEVER includes triple (3 guests), family (4 guests), or group (6 guests).
 */
export function isSingleOrDoubleRoom(room: Room): boolean {
  if (!room) return false;

  // 1. Primary rule: maxAdults capacity check
  const maxAdults = typeof room.maxAdults === 'number' ? room.maxAdults : parseInt(String(room.maxAdults || 0), 10);
  if (maxAdults > 0) {
    if (maxAdults <= 2) {
      return true;
    }
    if (maxAdults >= 3) {
      return false;
    }
  }

  // 2. Secondary rule: check room id / slug / name (NOT subtitle)
  const id = (room.id || '').toLowerCase();
  const slug = (room.slug || '').toLowerCase();
  const nameVi = (room.name?.vi || '').toLowerCase();
  const nameEn = (room.name?.en || '').toLowerCase();
  const idAndName = `${id} ${slug} ${nameVi} ${nameEn}`;

  // If name or ID indicates 3+ guests -> NEVER single/double
  if (
    idAndName.includes('3 người') ||
    idAndName.includes('3-nguoi') ||
    idAndName.includes('3 khách') ||
    idAndName.includes('gia đình') ||
    idAndName.includes('gia-dinh') ||
    idAndName.includes('nhóm') ||
    idAndName.includes('nhom') ||
    idAndName.includes('4 người') ||
    idAndName.includes('4-nguoi') ||
    idAndName.includes('5 người') ||
    idAndName.includes('5-nguoi') ||
    idAndName.includes('6 người') ||
    idAndName.includes('6-nguoi') ||
    idAndName.includes('triple') ||
    idAndName.includes('family') ||
    idAndName.includes('quadruple') ||
    idAndName.includes('ban công') ||
    idAndName.includes('ban-cong')
  ) {
    return false;
  }

  // If name or ID indicates 1-2 guests
  if (
    idAndName.includes('đơn') ||
    idAndName.includes('don') ||
    idAndName.includes('đôi') ||
    idAndName.includes('doi') ||
    idAndName.includes('máy chiếu') ||
    idAndName.includes('may-chieu') ||
    idAndName.includes('giường tầng') ||
    idAndName.includes('giuong-tang') ||
    idAndName.includes('single') ||
    idAndName.includes('double') ||
    idAndName.includes('phong-a')
  ) {
    return true;
  }

  return false;
}

/**
 * Checks if a room belongs to "Phòng nhóm & gia đình ( 3-6 khách )"
 * Strict rule: ONLY 3-6 guests (maxAdults >= 3, triple/family/group rooms).
 * NEVER includes single (1 guest) or double (2 guests).
 */
export function isGroupOrFamilyRoom(room: Room): boolean {
  if (!room) return false;

  // 1. Primary rule: maxAdults capacity check
  const maxAdults = typeof room.maxAdults === 'number' ? room.maxAdults : parseInt(String(room.maxAdults || 0), 10);
  if (maxAdults > 0) {
    if (maxAdults >= 3) {
      return true;
    }
    if (maxAdults <= 2) {
      return false;
    }
  }

  // 2. Secondary rule: check room id / slug / name (NOT subtitle)
  const id = (room.id || '').toLowerCase();
  const slug = (room.slug || '').toLowerCase();
  const nameVi = (room.name?.vi || '').toLowerCase();
  const nameEn = (room.name?.en || '').toLowerCase();
  const idAndName = `${id} ${slug} ${nameVi} ${nameEn}`;

  // If name or ID indicates 1-2 guests -> NEVER family/group
  if (
    idAndName.includes('đơn') ||
    idAndName.includes('don') ||
    idAndName.includes('đôi') ||
    idAndName.includes('doi') ||
    idAndName.includes('máy chiếu') ||
    idAndName.includes('may-chieu') ||
    idAndName.includes('giường tầng') ||
    idAndName.includes('giuong-tang') ||
    idAndName.includes('single') ||
    idAndName.includes('double') ||
    idAndName.includes('phong-a')
  ) {
    return false;
  }

  // If name or ID indicates 3+ guests
  if (
    idAndName.includes('3 người') ||
    idAndName.includes('3-nguoi') ||
    idAndName.includes('3 khách') ||
    idAndName.includes('gia đình') ||
    idAndName.includes('gia-dinh') ||
    idAndName.includes('nhóm') ||
    idAndName.includes('nhom') ||
    idAndName.includes('4 người') ||
    idAndName.includes('4-nguoi') ||
    idAndName.includes('5 người') ||
    idAndName.includes('5-nguoi') ||
    idAndName.includes('6 người') ||
    idAndName.includes('6-nguoi') ||
    idAndName.includes('triple') ||
    idAndName.includes('family') ||
    idAndName.includes('quadruple') ||
    idAndName.includes('ban công') ||
    idAndName.includes('ban-cong') ||
    idAndName.includes('phong-c') ||
    idAndName.includes('phong-d') ||
    idAndName.includes('phong-ad') ||
    idAndName.includes('phong-b')
  ) {
    return true;
  }

  return false;
}

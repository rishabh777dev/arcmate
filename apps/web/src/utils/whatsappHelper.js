/**
 * WhatsApp click-to-chat helper with robust phone normalization
 * Handles 10-digit Indian numbers, leading zeros, and international country codes.
 */

export function normalizeWhatsAppNumber(raw) {
  if (!raw) return '';
  let cleaned = String(raw).replace(/[^0-9]/g, '');
  
  // If starts with 0 (e.g. 09845011290), drop leading zero
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  // If 10-digit number (standard Indian mobile e.g. 9845011290), prefix India country code 91
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  
  return cleaned;
}

export function buildWhatsAppUrl(phone, message) {
  const cleanPhone = normalizeWhatsAppNumber(phone);
  const encodedText = encodeURIComponent(message || '');
  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  return `https://wa.me/?text=${encodedText}`;
}

export function openWhatsAppChat(phone, message) {
  const url = buildWhatsAppUrl(phone, message);
  let opened = false;
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win && !win.closed && typeof win.closed !== 'undefined') {
      opened = true;
    }
  } catch (e) {
    opened = false;
  }
  return { url, opened, phone: normalizeWhatsAppNumber(phone) };
}

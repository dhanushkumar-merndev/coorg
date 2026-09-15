export const contactPhone = "+91 97426 06830";
export const contactPhoneDigits = "919742606830";
export const contactTelephone = "+919742606830";

export function whatsappUrl(message = "Hello Land in Coorg, I would like to enquire about your properties.") {
  return `https://wa.me/${contactPhoneDigits}?text=${encodeURIComponent(message)}`;
}

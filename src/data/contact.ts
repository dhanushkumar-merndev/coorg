export const contactPhone = "+91 97430 30555";
export const contactPhoneDigits = "919743030555";
export const contactTelephone = "+919743030555";

export function whatsappUrl(message = "Hello Land in Coorg, I would like to enquire about your properties.") {
  return `https://wa.me/${contactPhoneDigits}?text=${encodeURIComponent(message)}`;
}

// Single source of truth for how customers and property owners reach us.
// The same number is used for calls and WhatsApp.

export const PHONE_DISPLAY = "+234 902 557 4292";

// tel: and wa.me links want the number in international format, digits only
export const PHONE_TEL = "+2349025574292";
const WHATSAPP_NUMBER = "2349025574292";

const WHATSAPP_MESSAGE = "Hello Luxury Exxentials, I'd like to make an enquiry.";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

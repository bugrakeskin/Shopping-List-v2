export function getIconType(productIconType: string): string {
  if (productIconType === "Gıda") {
    return "la:utensils";
  } else if (productIconType === "Temizlik") {
    return "ri:hand-sanitizer-line";
  } else if (productIconType === "Kişisel Bakım") {
    return "ph:shower-thin";
  } else if (productIconType === "İçecek") {
    return "la:glass-whiskey";
  } else if (productIconType === "Meyve & Sebze") {
    return "la:apple-alt";
  } else if (productIconType === "Kahvaltılık") {
    return "la:bread-slice";
  } else if (productIconType === "Et & Tavuk") {
    return "la:drumstick-bite";
  } else if (productIconType === "Süt & Süt Ürünleri") {
    return "la:wine-bottle";
  } else if (productIconType === "Atıştırmalık") {
    return "la:cookie";
  } else if (productIconType === "Ev Bakım") {
    return "la:broom";
  } else {
    return "la:shopping-cart";
  }
}

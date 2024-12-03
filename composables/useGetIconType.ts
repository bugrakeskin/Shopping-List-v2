export function getIconType(productIconType: string): string {
  if (productIconType === "Gıda") {
    return "fluent:food-48-regular";
  } else if (productIconType === "Temizlik") {
    return "carbon:clean";
  } else if (productIconType === "Kişisel Bakım") {
    return "covid:personal-hygiene-hand-sanitizer-liquid-1";
  } else if (productIconType === "İçecek") {
    return "carbon:drink-01";
  } else {
    return "i-heroicons-arrow-down-tray";
  }
}

export function getIconType(productIconType: string): string {
  if (productIconType === "Gıda") {
    return "fluent:food-48-regular";
  } else if (productIconType === "Temizlik") {
    return "carbon:clean";
  } else if (productIconType === "Kişisel Bakım") {
    return "covid:personal-hygiene-hand-soap-1";
  } else {
    return "i-heroicons-arrow-down-tray";
  }
}

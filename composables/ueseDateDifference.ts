// composable/useDateDifference.ts

export const useDateDifference = () => {
  // Tarih farkını hesaplayan yardımcı fonksiyon
  const formatDateDifference = (createdAt: string): string => {
    const createdDate = new Date(createdAt); // Veritabanından gelen tarih
    const today = new Date(); // Bugünün tarihi

    const differenceInTime = today.getTime() - createdDate.getTime(); // Zaman farkı (milisaniye)
    const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24)); // Gün cinsine çevir

    if (differenceInDays === 0) {
      return "Today";
    } else if (differenceInDays === 1) {
      return "Yesterday";
    } else {
      return `${differenceInDays} days ago`;
    }
  };

  return {
    formatDateDifference,
  };
};

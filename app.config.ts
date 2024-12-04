export default defineAppConfig({
  ui: {
    primary: "amber",
    gray: "cool",
    notifications: {
      position: "bottom-0 end-0",
      timeout: 500,
      // Varsayılan notification ayarları
      default: {
        timeout: 500,
      }
    },
  },
});

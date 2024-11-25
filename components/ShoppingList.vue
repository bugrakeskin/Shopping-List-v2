<template>
  <div></div>
</template>

<script lang="ts" setup>
const { data: shoppingList, error } = await useAsyncData(() =>
  supabase
    .from("shopping_list_items")
    .select("id, created_at, predefined_items (name, category)")
    .order("created_at", { ascending: true })
);
</script>

<style></style>

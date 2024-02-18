<script lang="ts" setup>
    import { useDialogStore } from '@/stores/dialog'

    const dialogStore = useDialogStore();
</script>

<template>
    <v-dialog v-model="dialogStore.dialogFlag" scrollable width="auto" height="auto">
        <v-alert type="error" closable @click:close="dialogStore.dialogFlag = false">{{ dialogStore.dialogMessage }}</v-alert>
    </v-dialog>
</template>
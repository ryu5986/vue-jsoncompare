<script lang="ts" setup>
   
    const props = defineProps({
        openFlag: Boolean,
        openMessage: String,
        closeDialog: Function
    })

</script>

<template>
    <v-dialog v-model="props.openFlag" scrollable width="auto" height="auto">
        <v-alert type="error" closable @click:close="props.closeDialog">{{ props.openMessage }}</v-alert>
    </v-dialog>
</template>
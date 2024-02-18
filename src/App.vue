<script lang="ts" setup>

  import Dialog from '@/components/Dialog.vue';
  import Logo from '@/components/Logo.vue'

</script>

<template>
  <v-app>
    <v-main>
      <Dialog></Dialog>
      <Logo></Logo>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',

  data () {
    return {
      //
    }
  },
})
</script>

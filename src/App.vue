<script lang="ts" setup>

  import Dialog from '@/components/Dialog.vue';
  import Logo from '@/components/Logo.vue'
  import { provide } from 'vue';

  const openFlag = ref<boolean>(false);
  const openMessage = ref<string>('');

  const openDialog = (message: string) => {
    openFlag.value = true;
    openMessage.value = message;
  }

  const closeDialog = () => {
    openFlag.value = false;
    openMessage.value = '';
  }

  provide('openDialog', openDialog);

</script>

<template>
  <v-app>
    <v-main>
      <Dialog :openFlag="openFlag" :openMessage="openMessage" :closeDialog="closeDialog"></Dialog>
      <Logo></Logo>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'App',

  data () {
    return {
      //
    }
  },
})
</script>

<script lang="ts" setup>
    import logo from '@/assets/logo.svg'
</script>

<template>
    <v-container>      
      <v-row class="text-center">
        <v-col cols="12">
          <v-img
            :src="logo"
            class="my-3"
            contain
            height="200"
          />
        </v-col>
      </v-row>
      <v-row class="text-center">
        <v-col>JSON COMPARE</v-col>
      </v-row>
    </v-container>
</template>
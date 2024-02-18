<script lang="ts" setup>
    import jpaLogo from '@/assets/image/logo/jpalogo.png'
    import mariaLogo from '@/assets/image/logo/mariadblogo.png'
    import piniaLogo from '@/assets/image/logo/pinialogo.svg.png'
    import springLogo from '@/assets/image/logo/springbootlogo.png'
    import tsLogo from '@/assets/image/logo/typescriptlogo.png'
    import viteLogo from '@/assets/image/logo/vitelogo.jpg'
    import vueLogo from '@/assets/image/logo/vuelogo.png'
    import vuetifyLogo from '@/assets/image/logo/vuetifylogo.png'
</script>

<template>
    <v-container>      
      <v-row>
        <v-col>
          <h1>JSON COMPARE</h1>
          <h2>use with</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="7">
          <v-row>
            <v-col col="4">
              <v-img
                :src="vueLogo"
                contain
                height="100"
                width="100"
              />
            </v-col>
            <v-col col="4">
              <v-img
                :src="vuetifyLogo"
                contain
                height="100"
                width="100"
              />
            </v-col>
            <v-col col="4">
              <v-img
                :src="viteLogo"
                contain
                height="100"
                width="100"
              />
            </v-col>
            <v-col col="4">
              <v-img
                :src="piniaLogo"
                contain
                height="100"
                width="100"
              />
            </v-col>
            <v-col col="4">
              <v-img
                :src="tsLogo"
                contain
                height="100"
                width="100"
              />
            </v-col>
            <v-col col="4">
              <v-img
                :src="springLogo"
                contain
                height="100"
                width="100"
              />
            </v-col>
            <v-col col="4">
              <v-img
                :src="jpaLogo"
                contain
                height="100"
                width="100"
              />
            </v-col>
            <v-col col="4">
              <v-img
                :src="mariaLogo"
                contain
                height="100"
                width="100"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
</template>
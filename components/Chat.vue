<template>
  <v-container class="content grey lighten-5nt">
    <v-row justify="center" align="center">
      <v-col class="content__record">
        <v-card
          outlined
          tile
          class="mx-auto"
        >
          <v-app-bar
            dark
            color="pink"
          >
            <v-app-bar-nav-icon></v-app-bar-nav-icon>

            <v-toolbar-title>My Music</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-app-bar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'Chat',
  props: {
    room: { type: Object, default: () => {} }
  }
}
</script>

<style lang="scss" scoped>
  .content{
    &__record{
      border: white 1px solid;
    }
  }
</style>

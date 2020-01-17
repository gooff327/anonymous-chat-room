<template>
  <section class="home-wrapper">
    <v-app id="inspire">
      <v-navigation-drawer
        app
        clipped
        v-model="drawer"
      >
        <v-list dense>
          <v-list-item-group v-model="activeMenu">
            <v-list-item
              :key="item.text"
              link
              v-for="item in menus"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          <v-subheader class="mt-4 grey--text text--darken-1">ROOMS</v-subheader>
          <Rooms :data="rooms"></Rooms>
          <v-list-item
            class="mt-4"
            link
          >
            <v-list-item-action>
              <v-icon color="grey darken-1">mdi-plus-circle-outline</v-icon>
            </v-list-item-action>
            <v-list-item-title class="grey--text text--darken-1">Create Room</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-action>
              <v-icon color="grey darken-1">mdi-settings</v-icon>
            </v-list-item-action>
            <v-list-item-title class="grey--text text--darken-1">Manage Subscriptions</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar
        app
        clipped-left
        color="teal"
        dense
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
        <v-icon class="mx-4">mdi-incognito</v-icon>
        <v-toolbar-title class="mr-12 align-center">
          <span class="title">Keyboard-Hero</span>
        </v-toolbar-title>
        <v-spacer/>
        <v-row
          align="center"
          style="max-width: 300px"
        >
          <v-text-field
            :append-icon-cb="() => {}"
            append-icon="mdi-shield-search"
            color="white"
            hide-details
            placeholder="Search room / user..."
            single-line
          />
        </v-row>
      </v-app-bar>

      <v-content>
        <v-container class="fill-height">
          <v-row
            align="center"
            justify="center"
          >
            <v-col class="shrink">
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-btn
                    :href="source"
                    icon
                    large
                    target="_blank"
                    v-on="on"
                  >
                    <v-icon large>mdi-code-tags</v-icon>
                  </v-btn>
                </template>
                <span>Source</span>
              </v-tooltip>
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-btn
                    href="https://codepen.io/johnjleider/pen/aezMOO"
                    icon
                    large
                    target="_blank"
                    v-on="on"
                  >
                    <v-icon large>mdi-codepen</v-icon>
                  </v-btn>
                </template>
                <span>Codepen</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
    </v-app>
  </section>
</template>

<script>
import Rooms from '../components/Rooms'
import socket from '../plugins/socket.io'
export default {
  components: {
    Rooms
  },
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    activeMenu: 0,
    menus: [
      { icon: 'mdi-message', text: 'Messages' },
      { icon: 'mdi-trending-up', text: 'Trending' },
      { icon: 'mdi-history', text: 'History' },
      { icon: 'mdi-playlist-music', text: 'Playlists' }
    ],
    rooms: [
      { picture: 28, text: 'Joseph' },
      { picture: 38, text: 'Apple' },
      { picture: 48, text: 'Xbox Ahoy' },
      { picture: 58, text: 'Nokia' },
      { picture: 78, text: 'MKBHD' }
    ]
  }),
  created () {
    this.$vuetify.theme.dark = true
  },
  mounted () {
    this.getRooms()
    socket.emit('chat', 'hi server')
  },
  methods: {
    getRooms () {
      console.log(this.$axios.$get('/rooms'))
    }
  }
}
</script>
<style lang="stylus">
</style>

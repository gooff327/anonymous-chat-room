<template>
  <section class="home-wrapper">
    <v-app id="inspire">
      <v-navigation-drawer
        v-model="drawer"
        app
        clipped
      >
        <v-list dense>
          <v-list-item-group v-model="activeMenu">
            <v-list-item
              :key="item.text"
              v-for="item in menus"
              link
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
          <v-subheader v-if="rooms.length > 0" class="mt-4 grey--text text--darken-1">
            ROOMS
          </v-subheader>
          <Rooms :active="activeRooms" @roomSelected="handleActiveRoomChange" :rooms="rooms" />
          <v-menu
            :close-on-content-click="false"
            :nudge-width="200"
            v-model="roomCreatorVisible"
            offset-x
          >
            <template v-slot:activator="{ on }">
              <v-list-item
                v-on="on"
                class="mt-4"
                link
              >
                <v-list-item-action>
                  <v-icon color="grey darken-1">
                    mdi-plus-circle-outline
                  </v-icon>
                </v-list-item-action>
                <v-list-item-title class="grey--text text--darken-1">
                  Create Room
                </v-list-item-title>
              </v-list-item>
            </template>
            <v-card @keydown.enter="createRoom">
              <v-list-item three-line>
                <v-list-item-content>
                  <div class="overline mb-4">
                    NEW ROOM
                  </div>
                  <v-text-field
                    :error-messages="errorMessages"
                    :success-messages="successMessages"
                    :loading="loading"
                    v-model="roomName"
                    required
                    placeholder="Please input your room name"
                  />
                </v-list-item-content>
              </v-list-item>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="roomCreatorVisible = false" text>
                  Cancel
                </v-btn>
                <v-btn @click="createRoom" :disabled="successMessages.length === 0" color="primary" text>
                  Create
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
          <v-list-item link>
            <v-list-item-action>
              <v-icon color="grey darken-1">
                mdi-settings
              </v-icon>
            </v-list-item-action>
            <v-list-item-title class="grey--text text--darken-1">
              Manage Subscriptions
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar
        app
        clipped-left
        color="teal"
        dense
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-icon class="mx-4">
          mdi-incognito
        </v-icon>
        <v-toolbar-title class="mr-12 align-center">
          <span class="title">Keyboard-Hero</span>
        </v-toolbar-title>
        <v-spacer />
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
        <Chat v-if="activeRooms.length >= 1" :room="openedRoom" :messages="currentMessages" />
      </v-content>
    </v-app>
    <v-snackbar
      v-bind="snackbarProps"
    >
      {{ snackbarProps.content }}
      <v-btn
        @click="$set(snackbarProps, 'value', false)"
        dark
        text
      >
        Close
      </v-btn>
    </v-snackbar>
  </section>
</template>

<script>
import { debounce } from 'lodash'

import Rooms from '../components/Rooms'
import Chat from '../components/Chat'
import socket from '../plugins/socket.io'

export default {
  components: {
    Rooms,
    Chat
  },
  data () {
    return {
      username: '',
      roomName: '',
      roomCreatorVisible: false,
      drawer: null,
      activeMenu: 0,
      activeRooms: [],
      errorMessages: [],
      successMessages: [],
      loading: false,
      snackbarProps: {
        value: true,
        top: 'top',
        color: '#41bb83',
        timeout: 2000,
        content: 'DEFAULT CONTENT'
      },
      messages: {},
      menus: [
        { icon: 'mdi-message', text: 'Messages' },
        { icon: 'mdi-trending-up', text: 'Trending' },
        { icon: 'mdi-history', text: 'History' },
        { icon: 'mdi-playlist-music', text: 'Playlists' }
      ],
      rooms: []
    }
  },
  computed: {
    openedRoom () {
      const INDEX = this.rooms.findIndex(item => item.name === this.activeRooms[0])
      return this.rooms[INDEX]
    },
    currentMessages () {
      return this.messages[this.activeRooms[0]]
    }
  },
  watch: {
    roomName (value) {
      if (value === '') {
        this.successMessages = []
        this.errorMessages = []
        return
      }

      this.successMessages.splice(0, this.successMessages.length)
      this.errorMessages.splice(0, this.errorMessages.length)

      if (value.length > 10) {
        this.errorMessages.push('Room name must be less than 16 characters')
        this.successMessages.splice(0, this.successMessages.length)
      } else {
        this.loading = true
        this.checkName(value)
      }
    }
  },
  created () {
    this.$vuetify.theme.dark = true
  },
  beforeDestroy () {
    socket.off('rooms')
    socket.off('rooms::update')
    socket.off('message')
  },
  mounted () {
    socket.emit('getRooms')
    this.username = sessionStorage.getItem('username')
    socket.on('rooms', (data) => {
      this.rooms.splice(0, this.rooms.length, ...data)
    })
    socket.on('message', ({ room, username, content, action }) => {
      const MSG_ENTRY = { username, content, action }
      if (this.messages[room] === undefined) {
        this.$set(this.messages, room, [MSG_ENTRY])
      } else {
        this.messages[room].push(MSG_ENTRY)
      }
    })
    socket.on('rooms::update', (room) => {
      const INDEX = this.rooms.findIndex(item => item.name === room.name)
      if (INDEX === -1) {
        socket.emit('getRooms')
      } else {
        this.$set(this.rooms, INDEX, room)
      }
    })
  },
  methods: {
    handleActiveRoomChange (val) {
      const index = val === undefined ? 0 : this.activeRooms.indexOf(this.rooms[val].name)
      if (index === 0) {
        return
      }
      if (index !== -1) {
        this.activeRooms.splice(index, 1)
        this.activeRooms === [] ? this.activeRooms.push(this.rooms[val].name) : this.activeRooms.unshift(this.rooms[val].name)
      } else {
        socket.emit('join', this.rooms[val].name, this.username)
        socket.send({ username: this.username, content: 'helloashdyiuasdashduhauisdhauhelloashdyiuasdashduhauisdhauhelloashdyiuasdashduhauisdhauhelloashdyiuasdashduhauisdhauhelloashdyiuasdashduhauisdhauhelloashdyiuasdashduhauisdhauhelloashdyiuasdashduhauisdhau', room: this.rooms[val].name })
        this.activeRooms === [] ? this.activeRooms.push(this.rooms[val].name) : this.activeRooms.unshift(this.rooms[val].name)
      }
    },
    checkName: debounce(function (value) {
      return this.$axios.get('/check_room', { params: { name: value } }).then(
        ({ data }) => {
          if (data.creatable) {
            this.successMessages.push('room name is invalid')
          } else {
            this.errorMessages.push('room name is invalid')
          }
          this.loading = false
        }
      )
    }, 500, {
      'leading': false,
      'trailing': true
    }),
    createRoom () {
      socket.emit('join', this.roomName)
      this.activeRooms.push(this.roomName)
      this.roomName = ''
      this.roomCreatorVisible = false
    }

  }
}
</script>

<template>
  <v-container @keydown.enter="handleSendMsg" class="content lighten-5nt py-0">
    <v-row align="center" justify="center">
      <v-col>
        <v-card
          class="mx-auto content__record"
        >
          <v-toolbar dark>
            <v-chip
              color="dark font-weight-black"
              pill
            >
              <v-icon class="mx-1">
                mdi-home
              </v-icon>
              {{ room && room.name }}
            </v-chip>
            <v-spacer />
            <v-spacer />
            <v-btn icon>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-heart-outline</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-toolbar>
          <section id="card__content" ref="content" v-if="messages.length > 0" class="card__content">
            <Message
              v-for="(item, index) of messages"
              :username="username"
              :message="item"
              :key="index"
            />
          </section>
          <v-bottom-navigation
            absolute
            class="bottom-wrapper d-flex justify-around"
            color="white"
            hide-on-scroll
            horizontal
            scroll-threshold="500"
          >
            <div class="func-area">
              <input ref="image" type="file" accept="image/png, image/jpeg" style="display: none" />
              <v-btn>
                <v-icon>mdi-sticker-emoji</v-icon>
              </v-btn>
              <v-btn ref="image-btn" @click="selectImage">
                <v-icon>mdi-tooltip-image</v-icon>
              </v-btn>
              <v-btn>
                <v-icon>mdi-file-upload</v-icon>
              </v-btn>
              <v-btn>
                <v-icon>mdi-microphone</v-icon>
              </v-btn>
            </div>
            <div class="input-area">
              <v-text-field ref="input" v-model="content" placeholder="CLICK TO START TYPING" />
            </div>
            <div class="btn-area">
              <v-btn @click="handleSendMsg">
                SEND
                <v-icon color="green">
                  mdi-send-outline
                </v-icon>
              </v-btn>
              <v-btn @click="handleLeaveRoom">
                LEAVE
                <v-icon color="error">
                  mdi-close-outline
                </v-icon>
              </v-btn>
            </div>
          </v-bottom-navigation>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { debounce } from 'lodash'

import socket from '../plugins/socket.io'

import Message from './Message'
export default {
  name: 'Chat',
  components: { Message },
  props: {
    room: {
      type: Object,
      default: () => {
      }
    },
    messages: {
      type: Array,
      default: () => []
    },
    username: { type: String, default: '' }
  },
  data: () => ({
    content: '',
    file: null
  }),
  watch: {
    messages: {
      handler (val, oldVal) {
        if (val) {
          const debounced = debounce(this.scroll, 250, { 'maxWait': 1000 })
          debounced()
        }
      },
      deep: true
    }
  },
  methods: {
    handleLeaveRoom () {
      socket.emit('leave', this.room.name, this.username)
      this.$emit('leaveRoom', this.room.name)
    },
    handleSendMsg (file) {
      const FILE = file instanceof File
      if (this.content === '' && !FILE) {
        this.$emit('notify', { content: 'Cannot send empty message ！', color: '#ff5252' })
        this.$refs.input.focus()
      } else {
        socket.send({ username: this.username, content: FILE ? file : this.content, room: this.room.name })
        this.content = FILE ? this.content : ''
      }
    },
    selectImage () {
      const input = this.$refs.image
      input.onchange = (e) => {
        this.handleSendMsg(e.target.files[0])
        e.target.value = ''
      }
      input.click()
      return false
    },
    scroll () {
      const CONTENT = this.$refs.content
      if (CONTENT && CONTENT.scrollHeight > CONTENT.offsetHeight) {
        CONTENT.scroll({ top: CONTENT.scrollHeight, behavior: 'smooth' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .content {
    &__record {
      height: calc(100vh - 74px);
    }

    .bottom-wrapper {
      align-items: center;

      div {
        flex: 1;
        display: flex;
        justify-content: center;
      }
    }
    .card__content {
      height: 88%;
      padding-bottom: 20px;
      overflow: scroll;
      overflow: -moz-scrollbars-none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
      }
    }
  }
</style>

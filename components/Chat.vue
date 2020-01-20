<template>
  <v-container class="content lighten-5nt py-0">
    <v-row align="center" justify="center">
      <v-col>
        <v-card
          class="mx-auto content__record"
        >
          <v-toolbar dark>
            <v-spacer />
            <v-toolbar-title>
              <v-chip
                color="dark font-weight-bold"
                pill
              >
                <v-icon class="mx-1">
                  mdi-home
                </v-icon>
                {{ room && room.name }}
              </v-chip>
            </v-toolbar-title>
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
          <section v-if="messages.length > 0" class="card__content">
            <Message
              v-for="(item, index) of messages"
              :message="item"
              :key="index"/>
          </section>
          <v-bottom-navigation
            absolute
            class="bottom-wrapper d-flex justify-around"
            color="white"
            hide-on-scroll
            horizontal
            scroll-target=".card__content"
            scroll-threshold="500"
          >
            <div class="func-area">
              <v-btn>
                <v-icon>mdi-sticker-emoji</v-icon>
              </v-btn>
              <v-btn>
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
              <v-text-field v-model="content" placeholder="CLICK TO START TYPING" />
            </div>
            <div class="btn-area">
              <v-btn>
                SEND
                <v-icon color="green">
                  mdi-send-outline
                </v-icon>
              </v-btn>
              <v-btn>
                CLOSE
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
    }
  },
  data: () => ({
    content: ''
  }),
  created () {
    console.log(this.room)
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
  }
</style>

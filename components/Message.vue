<template>
  <v-lazy
    v-model="isActive"
    :options="{
      threshold: .5
    }"
    transition="fade-transition"
  >
    <v-container>
      <v-row v-if="message.action === 'DEFAULT'" :class="isSelf ? 'flex-row-reverse':''">
        <v-col :class="isSelf ? 'justify-start' : 'justify-end'" class="d-flex align-end" cols="1">
          <v-avatar :color="isSelf ? 'grey': 'pink'">
            <span>{{ message && message.username || 'XXX' }}</span>
          </v-avatar>
        </v-col>
        <v-col :cols="col">
          <v-card :class="isSelf ? 'right word__card px-2 py-2 text-center' : 'left word__card px-2 py-2 text-center'" :elevation="24" :color="isSelf ? 'green darken-1' : 'blue-grey lighten-2'">
            <span>{{ message.content }}</span>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else-if="message.action === 'JOIN' || message.action === 'LEAVE'" v-show="message.username !== username">
        <v-col class="d-flex justify-center">
          <v-chip small>
            <span class="font-weight-black mx-2" style="cursor: pointer">{{ message.username }}</span>
            {{ message.action === 'JOIN' ? '加入房间' : '离开房间' }}
          </v-chip>
        </v-col>
      </v-row>
    </v-container>
  </v-lazy>
</template>
<script>
import socket from '../plugins/socket.io'

export default {
  name: 'Message',
  props: {
    message: { type: Object, default: () => [] },
    username: { type: String, default: '' }
  },
  data: () => ({
    isActive: false
  }),
  computed: {
    isSelf () {
      const TMP = sessionStorage.getItem('username')
      const SELF = TMP === null ? socket.id : TMP
      return this.message.username === SELF
    },
    col () {
      const LENGTH = this.message.content.length
      if (LENGTH > 0 && LENGTH < 300) {
        return Math.ceil(LENGTH / 50)
      } else if (LENGTH > 300) {
        return 6
      } else {
        return 2
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .word__card:before {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border: 12px solid transparent;
    position: absolute;
    bottom: 10px;
  }
  .left:before, .left:after {
    border-right: 16px solid #90A4AE;
    left: -20px;
  }
  .right:before {
    border-left: 16px solid #43A047;
    right: -20px;
  }
</style>

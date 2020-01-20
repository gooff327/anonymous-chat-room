<template>
  <v-lazy
    v-model="isActive"
    v-if="message.action === 'DEFAULT'"
    :options="{
      threshold: .5
    }"
    transition="fade-transition"
  >
    <v-container>
      <v-row no-gutters>
        <v-col :order="isSelf? 'last' : 'first'" class="d-flex justify-center align-center" cols="1">
          <v-avatar :color="isSelf ? 'grey': 'pink'">
            <span>{{ message && message.username || 'XXX' }}</span>
          </v-avatar>
        </v-col>
        <v-col :order="isSelf? 'last' : 'first'" cols="6">
          <v-card>
            <span>{{message.content + message.content + message.content}}</span>
          </v-card>
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
    message: { type: Object, default: () => [] }
  },
  data: () => ({
    isActive: false
  }),
  computed: {
    isSelf () {
      const self = sessionStorage.getItem('username') === undefined ? socket.id : sessionStorage.getItem('username')
      return this.message.username === self
    }
  }
}
</script>

<style scoped lang="scss">
  /*.avatar-wrapper {*/
  /*  display: flex;*/
  /*  justify-content: center;*/
  /*  align-items: center;*/
  /*}*/
</style>

<template>
  <v-list>
    <v-list-item-group @change="$emit('roomSelected', activeRoom)" v-model="activeRoom">
      <v-list-item
        :key="index"
        v-for="(item, index) of rooms"
        link
      >
        <v-list-item-avatar>
          <img
            :src="`https://randomuser.me/api/portraits/men/1.jpg`"
            alt=""
          >
        </v-list-item-avatar>
        <v-badge
          :color="item.split('***')[0] === 'public' ? 'pink' : 'error'"
          :icon="item.split('***')[0] === 'public' ? 'mdi-lock-open-variant' : 'mdi-lock'"
          bordered
          inline
        >
          <v-list-item-title v-text="item" />
        </v-badge>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  name: 'Rooms',
  props: {
    rooms: { type: Array, default: () => [] }
  },
  data: () => ({
    activeRoom: null
  })
}
</script>

<style scoped>

</style>

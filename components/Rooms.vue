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
        <v-list-item-title v-text="item.name" />
        <v-badge
          :color="active.includes(item.name) ? 'green' : 'pink'"
          dot
          bordered
        >
          <v-chip
            color="grey"
            outlined
            label
          >
            <v-icon left>
              mdi-account-group-outline
            </v-icon>
            {{ item.length }}
          </v-chip>
        </v-badge>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  name: 'Rooms',
  props: {
    rooms: { type: Array, default: () => [] },
    active: { type: Array, default: () => [] }
  },
  data: () => ({
    activeRoom: null
  })
}
</script>

<style scoped>

</style>

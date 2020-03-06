<template>
  <v-list class="list-wrapper">
    <v-list-item-group @change="$emit('roomSelected', activeRoom)" v-model="activeRoom">
      <v-slide-y-transition group>
        <v-list-item
          v-if="item.length > 0"
          :key="index"
          v-for="(item, index) of rooms"
          link
        >
          <v-list-item-avatar color="green">
            <span>{{ item.name[0] }}</span>
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
      </v-slide-y-transition>
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
<style scoped lang="scss">
</style>

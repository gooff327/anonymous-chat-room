<template>
  <v-list>
    <v-list-item
      :key="item.text"
      v-for="item in data"
      link
    >
      <v-list-item-avatar>
        <img
          :src="`https://randomuser.me/api/portraits/men/${item.picture}.jpg`"
          alt=""
        >
      </v-list-item-avatar>
      <v-list-item-title v-text="item.text" />
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: 'Rooms',
  props: {
    data: { type: Array, default: () => [] }
  }
}
</script>

<style scoped>

</style>

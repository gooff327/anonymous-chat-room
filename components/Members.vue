<template>
  <v-list class="list-wrapper">
    <v-list-item-group>
      <v-slide-y-transition group>
        <v-list-item
          :key="index"
          v-for="(item, index) of users"
          link
        >
          <v-chip
            outlined
            class="px-3"
          >
            <v-avatar color="pink" left>
              <span class="white--text headline">
                {{ item.slice(0,1) }}
              </span>
            </v-avatar>
            {{ item }}
          </v-chip>
          <v-badge
            color="green"
            dot
            left
            inline
            bordered
          />
        </v-list-item>
      </v-slide-y-transition>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  name: 'Members',
  props: {
    users: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>

</style>

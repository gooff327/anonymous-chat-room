<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        unnamed-room
      </h1>
      <h2 class="subtitle">
        Chat anonymously on the internet
      </h2>
      <div class="links flex justify-around">
        <v-text-field id="username" type="text" placeholder="Username">
          <template slot="append">
            <v-btn @click="$router.push('/home')">
              Chat
            </v-btn>
          </template>
        </v-text-field>
        <p class="flex-1">

        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

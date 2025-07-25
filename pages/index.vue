<template>
  <Login />
</template>

<script>
import Login from "~/components/Login/LoginForm.vue";

export default {
  layout: "loginLayout",
  components: {
    Login,
  },
  head() {
    return {
      meta: [
        {
          hid: "description",
          name: "description",
          content: "System",
        },
      ],
    };
  },
  data() {
    return {
      notif: "",
    };
  },
  async created() {},
  methods: {},
};
</script>

<style scoped>
html {
  background-color: #eee;
}
</style>

<template>
  <SetNewPassword />
</template>

<script>
import SetNewPassword from "~/components/Login/SetNewPassword.vue";

export default {
  layout: "loginLayout",
  components: {
    SetNewPassword,
  },
  // meta: {
  //   access: { right: "view transactions" }
  // },
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

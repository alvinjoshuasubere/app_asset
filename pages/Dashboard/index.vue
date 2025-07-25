<template>
    <Dashboard />
  </template>
  
  <script>
  import Dashboard from "~/components/Dashboard/Dashboard.vue";
  
  export default {
    layout: "sidebar",
    components: {
      Dashboard
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
            content: "System"
          }
        ]
      };
    },
    data(){
      return {
      }
    },
    async created(){
    },
    methods: {
    }
  };
  </script>
  
  <style scoped>
  html {
    background-color: #eee;
  }
  
  .color1 {
    color: #008ed8;
  }
  .icon {
    margin-left: 5px;
    margin-right: 10px;
  }
  .button1 {
    background-color: #008ed8;
    color: white;
  }
  .button2 {
    background-color: #ff6600;
    color: white;
  }
  </style>
  
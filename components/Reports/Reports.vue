<template>
    <!-- DIVISION -->
    <div class="my-3" id="requests-view">
       <nav class="breadcrumb-container ml-4">
          <a href="#" class="breadcrumb-link">Home</a>
          <span class="breadcrumb-separator">▶</span>
          <span class="breadcrumb-current">Reports</span>
        </nav>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import moment from "moment";
  
  export default {
    components: {
    },
    async created() {
    },
    // meta: {
    //   access: { right: "view actions" }
    // },
    head() {
      // return {
      //   title: this.notif == 0 || this.notif == null ? "Admin | Actions - TSIS": '('+this.notif+')'+' Admin | Actions - TSIS',
      //   meta: [
      //     {
      //       hid: "description",
      //       name: "description",
      //       content: "Truck Scale Integrated System"
      //     }
      //   ]
      // };
    },
    data() {
      return {
      }
    },
    computed: {
    },
    mounted() {
    },
    methods: {

    },
  
    layout: "sidebar"
  };
  </script>
  
  <style>
  </style>
  
<template>
    <!-- DIVISION -->
    <div class="my-3" id="requests-view">
      <h4 class="color1 ml-4">
        Reports
      </h4>
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
  .page-item.active .page-link {
    background-color: #00a651 !important;
    border-color: #00a651 !important;
    transition: background-color 0.3s;
  }
  .page-item .page-link {
    color: black;
  }
  #filterInput {
    height: 31px;
  }
  </style>
  
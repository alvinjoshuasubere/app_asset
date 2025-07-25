<template>
  
    <div class="my-3" id="requests-view">  
      <h4 class="color1 ml-4">
        Transactions
      </h4>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  // import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
  
  export default {
    layout: "sidebar",
    components: {
    },
    async created() {
  
    },
    data() {
      return {}
  
    },
    computed: {
      
    },
    watch: {
      selectedSupplier() {
        if (!this.selectedSupplier) this.supplierAddress = null; // if null; null address too
      },
      selectedItem() {
        if (!this.selectedItem) this.selectedItemCode = null; // if null; null address too
      }
    },
    mounted() {},
    methods: {}
     
  
    
  };
  </script>
  
  <style>
  .reportrange-text[data-v-8cc9549e] {
    background: #fff;
    cursor: pointer;
    padding: 5px 10px;
    border: 1px solid #ccc;
    width: 100%;
    height: 2rem;
    font-size: 12px;
    text-align: center;
  }
  .daterangepicker.show-ranges .drp-calendar.left {
    position: relative;
    right: 8px;
  }
  
  .daterangepicker.show-ranges .drp-calendar.left {
    border-left: 0px solid #ddd;
  }
  
  .daterangepicker .ranges li.active {
    background-color: #28a745;
    color: #fff;
  }
  .daterangepicker td.active,
  .daterangepicker td.active:hover {
    background-color: #28a745;
    border-color: transparent;
    color: #fff;
  }
  
  </style>
  
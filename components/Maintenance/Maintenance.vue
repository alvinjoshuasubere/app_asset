<template>
  <div class="my-3" id="requests-view">
    <div class="mt-3">
      <b-row>
        <b-col>
          <nav class="breadcrumb-container ml-4">
            <a href="#" class="breadcrumb-link">Home</a>
            <span class="breadcrumb-separator">▶</span>
            <span class="breadcrumb-current">Maintenance</span>
          </nav>

          <b-modal
            id="bv-modal-create"
            no-close-on-backdrop
            header-class="assetColor"
            size="xl"
            hide-footer
            @show="onModalShow"
            @hidden="resetModal"
          >
            <template #modal-title>
              <div class="modal-title-header">
                <div class="modal-title-icon">
                  <font-awesome-icon icon="users" />
                </div>
                <div class="modal-title-text">
                  <span class="modal-title-main"> Record New Asset for Maintenance</span>
                  <span class="modal-title-desc">Select asset details to log maintenance request</span>
                </div>
              </div>
            </template>

            <div class="p-2">
              <!-- Filters Row -->
              <b-row class="mb-3">
                <b-col cols="5">
                  <b-input-group size="sm">
                    <b-input-group-prepend is-text>
                      <font-awesome-icon icon="magnifying-glass" />
                    </b-input-group-prepend>
                    <b-form-input
                      v-model="modalFilter"
                      type="search"
                      placeholder="Search"
                      debounce="500"
                      @update="fetchAssets"
                      style="font-size: 13px;"
                    ></b-form-input>
                  </b-input-group>
                </b-col>

                <b-col cols="4">
                  <b-form-select
                    v-model="selectedOffice"
                    :options="officeOptions"
                    size="sm"
                    style="font-size: 13px;"
                    @change="fetchAssets"
                  >
                    <template #first>
                      <b-form-select-option :value="null">- Filter By Office -</b-form-select-option>
                    </template>
                  </b-form-select>
                </b-col>

                <!-- <b-col cols="3">
                  <b-form-select
                    v-model="selectedAccount"
                    :options="accountOptions"
                    size="sm"
                    style="font-size: 13px;"
                    @change="fetchAssets"
                  >
                    <template #first>
                      <b-form-select-option :value="null">Nothing selected</b-form-select-option>
                    </template>
                  </b-form-select>
                </b-col> -->
              </b-row>

              <!-- Asset Table -->
              <b-table
                id="assetSelectTable"
                class="tableAsset"
                style="font-size: 12px;"
                head-variant="light"
                show-empty
                small
                no-border-collapse
                :items="paginatedAssetList"
                :fields="assetFields"
                :busy="isAssetBusy"
              >
                <template #table-busy>
                  <div class="text-center text-secondary my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>&nbsp;Loading...</strong>
                  </div>
                </template>

                <!-- Select button column -->
                <template v-slot:cell(select)="row">
                  <b-button
                    size="sm"
                    style="
                      background-color: #1a3a5c;
                      border: none;
                      font-size: 11px;
                      font-weight: 600;
                      padding: 3px 10px;
                      color: #fff;
                    "
                    @click="selectAsset(row.item)"
                  >
                    SELECT
                  </b-button>
                </template>

                <!-- Account Title column -->
                <template v-slot:cell(AccountTitle)="row">
                  <div style="font-size: 11px; color: #555;">{{ row.item.AccountCode }}</div>
                  <div style="font-weight: 500;">{{ row.item.AccountTitle }}</div>
                </template>

                <!-- Item Description column -->
                <template v-slot:cell(ItemDescription)="row">
                  <div >
                    {{ row.item.Subcategory }}<br />
                    <span style="color: #666;">({{ row.item.PropertyNo }})</span>
                  </div>
                  <div style="font-weight: 500;">{{ row.item.Description || '' }}</div>
                </template>

                <!-- Office column -->
                <template v-slot:cell(OfficeName)="row">
                  <div>{{ row.item.FuncPerOfficeId }} - {{ row.item.OfficeName }}</div>
                </template>

                <!-- Status column -->
                <template v-slot:cell(StatusDescription)="row">
                  <span :style="{ color: row.item.StatusDescription === 'Serviceable' ? '#28a745' : '#dc3545', fontWeight: '500' }">
                    {{ row.item.StatusDescription }}
                  </span>
                </template>

                <!-- Assigned checkbox column -->
                <template v-slot:cell(assigned)="row">
                  <b-form-checkbox
                    v-model="row.item._assigned"
                    disabled
                    class="text-center"
                  ></b-form-checkbox>
                </template>

                <!-- Pagination caption -->
                <template v-slot:table-caption>
                  <b-row align-h="end">
                    <b-col cols="6" style="font-size: 12px; color: #666;">
                      {{ assetBottomLabel }}
                    </b-col>
                    <b-col cols="6">
                      <b-pagination
                        v-model="assetCurrentPage"
                        :total-rows="assetTotalRows"
                        :per-page="assetPerPage"
                        pills
                        align="right"
                        size="sm"
                        @change="onAssetPageChange"
                      ></b-pagination>
                    </b-col>
                  </b-row>
                </template>
              </b-table>
            </div>
          </b-modal>
          <b-card class="cardProfile mainContent">
            <b-row>
              <b-col cols="6">
                <b-form-group
                  label-size="md"
                  label-for="filterEmpInput"
                  class="mb-0"
                >
                  <b-input-group size="md">
                    <b-form-input
                      v-model="filter"
                      type="search"
                      id="filterEmpInput"
                      class="searchbar"
                      placeholder="Type to Search"
                      debounce="500"
                    ></b-form-input>
                    <!-- <b-input-group-append>
                      <b-button
                        v-if="filter"
                        variant="outline-secondary"
                        @click="filter = ''"
                        title="Clear"
                      >
                        ✕
                      </b-button>
                    </b-input-group-append> -->
                  </b-input-group>
                </b-form-group>
              </b-col>

              <b-col cols="3" class="d-flex align-items-end">
                <div class="d-flex">
                    <b-form-checkbox
                      v-model="isResolved"
                      @change="filterByStatus"
                      switch
                      size="sm"
                      class="mr-3 mt-2"
                      style="font-size: 13px; font-weight: 500;"
                    >
                      {{ isResolved ? 'Resolved' : 'Unresolved' }}
                  </b-form-checkbox>

                  <!-- <b-button
                    size="sm"
                    variant="outline-dark"
                    @click="clearFilter()"
                    title="Reload Filter"
                    v-b-tooltip.hover
                    style="font-size: 13px"
                  >
                    <font-awesome-icon icon="rotate-right" class="mr-2" />
                    Reload
                  </b-button> -->
                </div>
              </b-col>

              <!-- Right: Create New MTOP -->
              <b-col
                cols="3"
                class="d-flex align-items-end justify-content-end"
              >
                <b-button
                  class="defaultBtn"
                  style="font-size: 13px"
                  v-b-tooltip.hover
                  title="Create MTOP"
                  @click="$bvModal.show('bv-modal-create')"
                >
                  <font-awesome-icon icon="circle-plus" class="icon" />
                  Record new maintenance
                </b-button>
              </b-col>
            </b-row>

            <!-- table maintenance -->
            <b-table
              id="maintenanceTable"
              class="tableAsset mt-4"
              style="font-size: 12px"
              head-variant="light"
              show-empty
              stacked="md"
              small
              select-mode="single"
              sticky-header
              no-border-collapse
              :items="paginatedItems"
              :fields="fields"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :sort-direction="sortDirection"
              :busy.sync="isBusy"
              @filtered="onFiltered"
            >
              <template #table-busy>
                <div class="text-center text-secondary my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong>&nbsp;Loading...</strong>
                </div>
              </template>
              <template v-slot:cell(RequestNo)="row">
                <b>{{ row.item.RequestNo }}</b
                ><br> <small><em style="color:#00a651">Date Started: {{ formatDate(row.item.DateStarted) }}</em></small><br />
                <small>{{ row.item.ProblemDescription }}</small>
              </template>

               <template v-slot:cell(AccountTitle)="row">
                <b>{{ row.item.AccountTitle }}</b
                ><br>
                <small>({{ row.item.Subcategory || 'None' }})</small>
              </template>
              
              <template v-slot:cell(StatusDescription)="row">
                <b-form-checkbox
                  :checked="row.item.StatusDescription === 'RESOLVED' || row.item.IsResolved === 1"
                  disabled
                  class="text-center"
                ></b-form-checkbox>
              </template>
                <template v-slot:cell(actions)="row">
                  <b-dropdown class="dropdownBtn" right variant="link" no-caret>
                    <template #button-content>
                      <font-awesome-icon icon="bars" />
                    </template>
                    <b-dropdown-header class="dropdown-header">
                      Actions
                    </b-dropdown-header>
                    <b-dropdown-item-button @click="openEditModal(row)">
                      <font-awesome-icon
                        icon="pen-to-square"
                        class="viewIcon mr-2"
                        small
                      />Edit</b-dropdown-item-button
                    >               
                  </b-dropdown>
                </template> 
              <template v-slot:table-caption>
                  <b-row align-h="end">
                    <b-col cols="6">{{ bottomLabel }}</b-col>
                    <b-col cols="6">
                      <b-pagination
                        v-model="currentPage"
                        class="mr-2"
                        :total-rows="totalRows"
                        :per-page="perPage"
                        pills
                        align="right"
                        size="sm"
                      ></b-pagination>
                    </b-col>
                  </b-row>
                </template>
            </b-table>
          </b-card>
        </b-col>
      </b-row>
    </div>
    <b-alert
      :show="alert.showAlert"
      dismissible
      :variant="alert.variant"
      @dismissed="alert.showAlert = null"
    >
      <font-awesome-icon
        :icon="
          alert.variant == 'success' ? 'circle-check' : 'circle-exclamation'
        "
        class="mr-1 alert-font"
      />
      {{ alert.message }}
    </b-alert>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
// import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
  layout: "sidebar",
  components: {},
  async created() {},
  data() {
    return {
      showLoading: false,
      currentPage: 1,
      perPage: 10,
      isBusy: false,
      sortDesc: false,
      sortDirection: "asc",
      sortBy: "accountTitle",
      filter: "",
      maintenanceList: [],
      isResolved: false, // false = unresolved, true = resolved

      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },
      fields: [
        {
          key: "RequestNo",
          label: "Details",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
          thStyle: { width: "20%" },
        },
        {
          key: "EmployeePerformedBy",
          label: "Technician",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "AccountTitle",
          label: "Account",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
          thStyle: { width: "20%" },
        },
        {
          key: "Description",
          label: "Description",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
          thStyle: { width: "30%" },
        },
        {
          key: "StatusDescription",
          label: "Resolved",
          sortable: true,
          sortDirection: "desc",
          class: "text-center",
        },

        {
          key: "actions",
          label: "Actions",
          sortable: true,
          class: "text-center",
        },
      ],
      // ADD to data()
      modalFilter: "",
      selectedOffice: null,
      isAssetBusy: false,
      assetList: [],
      assetCurrentPage: 1,
      assetPerPage: 10,
      assetTotalRows: 0,
      officeOptions: [],  
      assetFields: [
        {
          key: "select",
          label: "",
          class: "text-center",
          thStyle: { width: "80px" },
        },
        {
          key: "AccountTitle",
          label: "Account Title",
          sortable: false,
          class: "text-left",
          thStyle: { width: "22%" },
        },
        {
          key: "ItemDescription",
          label: "Item Description",
          sortable: false,
          class: "text-left",
          thStyle: { width: "28%" },
        },
        {
          key: "OfficeName",
          label: "Office",
          sortable: false,
          class: "text-left",
        },
        {
          key: "Status",

          label: "Status",
          sortable: false,
          class: "text-center",
          thStyle: { width: "10%" },
        },
        {
          key: "assigned",
          label: "Assigned",
          sortable: false,
          class: "text-center",
          thStyle: { width: "8%" },
        },
      ],
    };
  },
  computed: {
    filteredItems() {
      let items = this.maintenanceList;
      
      if (this.filter) {
        const searchLower = this.filter.toLowerCase();
        items = items.filter((item) => {
          return (
            (item.details && item.details.toLowerCase().includes(searchLower)) ||
            (item.technician && item.technician.toLowerCase().includes(searchLower)) ||
            (item.accountTitle && item.accountTitle.toLowerCase().includes(searchLower)) ||
            (item.description && item.description.toLowerCase().includes(searchLower)) ||
            (item.assetTag && item.assetTag.toString().toLowerCase().includes(searchLower))
          );
        });
      }
      
      return items;
    },
    bottomLabel() {
      let end = this.perPage * this.currentPage;
      let start = end - this.perPage + 1;
      if (end > this.filteredItems.length) end = this.filteredItems.length;
      if (this.filteredItems.length === 0) start = 0;
      return `Showing ${start} to ${end} of ${this.filteredItems.length} entries`;
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredItems.slice(start, start + this.perPage);
    },
    assetBottomLabel() {
      const start = (this.assetCurrentPage - 1) * this.assetPerPage + 1;
      let end = this.assetCurrentPage * this.assetPerPage;
      if (end > this.assetTotalRows) end = this.assetTotalRows;
      if (this.assetTotalRows === 0) return "No entries";
      return `Showing ${start} to ${end} of ${this.assetTotalRows} entries`;
    },

    paginatedAssetList() {
      const start = (this.assetCurrentPage - 1) * this.assetPerPage;
      return this.assetList.slice(start, start + this.assetPerPage);
    },
    
    totalRows() {
      return this.filteredItems.length;
    }
  },
  watch: {},
  mounted() {
    this.getAllMaintenance();
  },
  methods: {
    formatDate(date){
      return moment(date).format('MMMM DD,YYYY');
    },
    async getAllMaintenance() {
      try {
        this.isBusy = true;
        
        const params = {
          text: this.filter || ""
        };
        
        // Add IsResolved parameter based on checkbox state
        params.IsResolved = this.isResolved ? '1' : '0';
        
        const response = await axios.get(
          `${this.$axios.defaults.baseURL}/items/get-maintenance`,
          { params }
        );
        this.maintenanceList = response.data.data || response.data || [];
        console.log('Maintenance data:', this.maintenanceList);
      } catch (error) {
        console.error('Error fetching maintenance data:', error);
        this.showAlert('Failed to load maintenance data', 'danger');
      } finally {
        this.isBusy = false;
      }
    },
    
    showAlert(message, variant) {
      this.alert.message = message;
      this.alert.variant = variant;
      this.alert.showAlert = 1;
      setTimeout(() => {
        this.alert.showAlert = 0;
      }, 3000);
    },
    
    onFiltered(filteredItems) {
      this.currentPage = 1;
    },
    
    filterByStatus() {
      this.currentPage = 1;
      this.getAllMaintenance();
    },
    // ADD to methods:

    async onModalShow() {
      this.modalFilter = "";
      this.selectedOffice = null;
      this.assetCurrentPage = 1;
      await this.fetchAssets();
      await this.getDepartments();
    },

    resetModal() {
      this.assetList = [];
      this.assetTotalRows = 0;
      this.assetCurrentPage = 1;
    },

    async fetchAssets() {
      try {
        this.isAssetBusy = true;
        this.assetCurrentPage = 1;

        const params = {
          text: this.modalFilter || "",
          StatusId: 7,
        };

        if (this.selectedOffice) params.FuncPerOfficeId = this.selectedOffice;     

        const response = await axios.get(
          `${this.$axios.defaults.baseURL}/items/get-params`,
          { params }
        );

        const data = response.data.data || response.data || [];

        // Mark assigned items
        this.assetList = data.map((item) => ({
          ...item,
          _assigned: !!item.IsAssigned || !!item.PersonName,
        }));

        this.assetTotalRows = this.assetList.length;
      } catch (error) {
        console.error("Error fetching assets:", error);
        this.showAlert("Failed to load assets", "danger");
      } finally {
        this.isAssetBusy = false;
      }
    },

    onAssetPageChange(page) {
      this.assetCurrentPage = page;
    },

    selectAsset(item) {
      // Store selected asset and redirect to create maintenance
      this.$bvModal.hide("bv-modal-create");

      // Option 1: redirect with query param
      this.$router.push({
        path: `/maintenance/${item.ItemHdrId}`,
      });

      // Option 2 (alternative): emit selected item upward
      // this.$emit("asset-selected", item);
    },

    async getDepartments() {
      try {
        const res = await this.$axios.get(
          `${this.$axios.defaults.baseURL}/admin/BOS/get-func-offices` 
        );
        this.officeOptions = res.data
          .map((o) => ({
            value: o.FuncPerOfficeId || o.Func_per_Office_ID,
            text: o.FuncOffice,
          }))
          .sort((a, b) => a.text.localeCompare(b.text));
      } catch (error) {
        console.error("Failed to load department filter options", error);
      }
    },
  },
}
</script>

<style>
</style>

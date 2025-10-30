<template>
  <div class="my-3" id="requests-view">
    <Loading v-if="showLoading" style="z-index: 9999" />
    <!-- Add Asset Modal -->
    <b-modal
      no-close-on-backdrop
      header-class="assetModalHeader"
      id="bv-modal-asset-details"
      title="Add Asset Item Details"
      size="xl"
      @close="cancelAssetDetails"
    >
      <b-container fluid>
        <!-- Modal Title -->
        <b-row class="mb-4">
          <b-col cols="12" class="text-center">
            <h4 class="modal-title-custom">
              <i class="fas fa-link"></i> Asset Information Form
            </h4>
          </b-col>
        </b-row>

        <!-- Status -->
        <b-row>
          <b-col cols="12">
            <b-form-group label="Status">
              <b-form-input
                v-model="assetInfo.status"
                value="Serviceable"
                readonly
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Asset Account & Category -->
        <b-row>
          <b-col md="6">
            <b-form-group label="Asset Account">
              <b-form-select
                v-model="assetInfo.assetAccount"
                :options="assetAccountOptions"
              >
                <template #first>
                  <b-form-select-option :value="null"
                    >Nothing selected</b-form-select-option
                  >
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Asset Category">
              <b-form-select
                v-model="assetInfo.assetCategory"
                :options="assetCategoryOptions"
              >
                <template #first>
                  <b-form-select-option :value="null"
                    >Nothing selected</b-form-select-option
                  >
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Asset Subcategory & Unit -->
        <b-row>
          <b-col md="6">
            <b-form-group label="Asset Subcategory">
              <b-form-select
                v-model="assetInfo.assetSubcategory"
                :options="assetSubcategoryOptions"
              >
                <template #first>
                  <b-form-select-option :value="null"
                    >Nothing selected</b-form-select-option
                  >
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Unit">
              <b-form-select v-model="assetInfo.unit" :options="unitOptions">
                <template #first>
                  <b-form-select-option :value="null"
                    >Nothing selected</b-form-select-option
                  >
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Asset Department & Date Acquired -->
        <b-row>
          <b-col md="6">
            <b-form-group label="Asset Department">
              <b-form-select
                v-model="assetInfo.assetDepartment"
                :options="departmentOptions"
              >
                <template #first>
                  <b-form-select-option :value="null"
                    >Nothing selected</b-form-select-option
                  >
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Date Acquired">
              <b-form-input
                type="date"
                v-model="assetInfo.dateAcquired"
                placeholder="10/29/2025"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Item Description & Cost -->
        <b-row>
          <b-col md="6">
            <b-form-group label="Item Description">
              <b-form-textarea
                v-model="assetInfo.itemDescription"
                placeholder="Enter Asset Description Here"
                rows="3"
              ></b-form-textarea>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Cost">
              <b-input-group prepend="Php">
                <b-form-input
                  type="number"
                  v-model="assetInfo.cost"
                  placeholder="Enter Asset Cost Here"
                  step="0.01"
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Warranty Options -->
        <b-row class="mb-3">
          <b-col cols="12">
            <b-form-group>
              <b-form-checkbox
                v-model="assetInfo.noWarranty"
                name="no-warranty"
                value="true"
                unchecked-value="false"
              >
                No Asset Warranty Available
              </b-form-checkbox>
              <b-form-checkbox
                v-model="assetInfo.hasWarranty"
                name="has-warranty"
                value="true"
                unchecked-value="false"
                class="ml-3"
              >
                Has Warranty
              </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Remove Asset Assignment Toggle -->
        <b-row class="mb-4">
          <b-col cols="12">
            <div class="d-flex align-items-center">
              <b-form-checkbox
                v-model="assetInfo.removeAssignment"
                switch
                size="lg"
                class="mr-3"
              >
              </b-form-checkbox>
              <span class="font-weight-bold">Remove Asset Assignment</span>
            </div>
          </b-col>
        </b-row>

        <!-- Assignment Details Section -->
        <b-row class="mb-4">
          <b-col cols="12" class="text-center">
            <h5 class="section-title-custom">
              <i class="fas fa-user"></i> Assignment Details
            </h5>
          </b-col>
        </b-row>

        <!-- Accountable Employee/Officer & Actual User -->
        <b-row>
          <b-col md="6">
            <b-form-group>
              <template #label>
                <div class="d-flex align-items-center">
                  <span>Accountable Employee/Officer</span>
                  <b-form-checkbox
                    v-model="assetInfo.sameAsActualUser"
                    class="ml-3 mb-0"
                    size="sm"
                  >
                    Same as Actual User
                  </b-form-checkbox>
                </div>
              </template>
              <b-input-group>
                <b-form-input
                  v-model="assetInfo.accountableEmployee"
                  placeholder="Insert Accountable Employee/Officer Here . . ."
                ></b-form-input>
                <b-input-group-append>
                  <b-button variant="outline-primary">
                    <i class="fas fa-user-plus"></i>
                  </b-button>
                  <b-button variant="primary">
                    <i class="fas fa-arrow-right"></i>
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Actual User">
              <b-input-group>
                <b-form-input
                  v-model="assetInfo.actualUser"
                  placeholder="Insert Actual User Here . . ."
                ></b-form-input>
                <b-input-group-append>
                  <b-button variant="outline-primary">
                    <i class="fas fa-user-plus"></i>
                  </b-button>
                  <b-button variant="primary">
                    <i class="fas fa-arrow-right"></i>
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Department Assigned & Location -->
        <b-row>
          <b-col md="6">
            <b-form-group label="Department Assigned">
              <b-form-select
                v-model="assetInfo.departmentAssigned"
                :options="departmentOptions"
              >
                <template #first>
                  <b-form-select-option :value="null"
                    >Nothing selected</b-form-select-option
                  >
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Location">
              <b-form-select
                v-model="assetInfo.location"
                :options="locationOptions"
              >
                <template #first>
                  <b-form-select-option :value="null"
                    >Nothing selected</b-form-select-option
                  >
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Condition & Remarks -->
        <b-row>
          <b-col md="6">
            <b-form-group label="Condition">
              <b-form-textarea
                v-model="assetInfo.condition"
                placeholder="Enter Condition Here (If Any)"
                rows="4"
              ></b-form-textarea>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Remarks">
              <b-form-textarea
                v-model="assetInfo.remarks"
                placeholder="Enter Remarks Here (If Any)"
                rows="4"
              ></b-form-textarea>
            </b-form-group>
          </b-col>
        </b-row>
      </b-container>

      <template v-slot:modal-footer>
        <div>
          <b-button size="sm" class="greyBtn mr-2" @click="cancelAssetDetails">
            Cancel
          </b-button>
          <b-button size="sm" class="primaryBtn" @click="saveAssetChanges">
            Save Changes
          </b-button>
        </div>
      </template>
    </b-modal>
    <!-- End Modal -->
    <div class="mt-3">
      <b-row>
        <b-col>
          <nav class="breadcrumb-container ml-4">
            <a href="#" class="breadcrumb-link">Home</a>
            <span class="breadcrumb-separator">▶</span>
            <span class="breadcrumb-current">Assets</span>
          </nav>
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
                    <b-input-group-append>
                      <b-button
                        v-if="filter"
                        variant="outline-secondary"
                        @click="filter = ''"
                        title="Clear"
                      >
                        ✕
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>

              <b-col cols="3" class="d-flex align-items-end">
                <div class="d-flex">
                  <!-- <b-dropdown
                    id="statusDropdown"
                    text="Filter by Status"
                    variant="outline-secondary"
                    menu-class="dropdown-menu-sm"
                    toggle-class="btn-sm"
                    class="dropdown-sm mr-2"
                    style="font-size: 13px"
                  >
                    <b-form-checkbox-group
                      id="status_group"
                      name="status-filter"
                      class="pl-2"
                      style="font-size: 13px"
                      stacked
                      v-model="reportStatusFilter"
                      :options="statusOptions"
                      @change="filterByStatus"
                    >
                    </b-form-checkbox-group>
                  </b-dropdown> -->

                  <b-button
                    size="sm"
                    variant="outline-dark"
                    @click="clearFilter()"
                    title="Reload Filter"
                    v-b-tooltip.hover
                    style="font-size: 13px"
                  >
                    <font-awesome-icon icon="rotate-right" class="mr-2" />
                    Reload
                  </b-button>
                </div>
              </b-col>

              <!-- Right: add new asset -->
              <b-col
                cols="3"
                class="d-flex align-items-end justify-content-end"
              >
                <b-button
                  class="defaultBtn"
                  style="background: #0b345f; border: none; font-size: 13px"
                  v-b-tooltip.hover
                  title="Add new Asset"
                  @click="$bvModal.show('bv-modal-asset-details')"
                >
                  <font-awesome-icon icon="circle-plus" class="icon" />
                  Add New Asset
                </b-button>
              </b-col>
            </b-row>

            <!-- table assets -->
            <b-table
              id="empTable"
              class="mt-2"
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
            >
              <template #table-busy>
                <div class="text-center text-secondary my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong>&nbsp;Loading...</strong>
                </div>
              </template>
              <!-- <template v-slot:cell(FullName)="row">
                  <span
                    ><b>{{ row.item.FullName }}</b></span
                  >
                  <br />
                  <small>{{ row.item.Address }}</small>
                </template> -->
              <!-- <template v-slot:cell(AppStatus)="row">
                  <b-badge
                    :class="[
                      'statusDesign',
                      'd-block',
                      row.item.AppStatus.toLowerCase() + 'Stat',
                    ]"
                    >&nbsp;{{ row.item.AppStatus }}
                  </b-badge>
                </template>
                <template v-slot:cell(actions)="row">
                  <b-dropdown class="dropdownBtn" right variant="link" no-caret>
                    <template #button-content>
                      <font-awesome-icon icon="ellipsis-vertical" />
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
                    <b-dropdown-item-button @click="getOwnerID(row.item)">
                      <font-awesome-icon
                        icon="eye"
                        class="viewIcon mr-2"
                        small
                      />View MTOP</b-dropdown-item-button
                    >
                  </b-dropdown>
                </template> -->
              <!-- <template v-slot:table-caption>
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
                </template> -->
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
import Loading from "@/components/LoadingOverlay/Loading";

export default {
  layout: "sidebar",
  components: {
    Loading,
  },
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

      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },
      fields: [
        {
          key: "accountTitle",
          label: "Account Title",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "subcategory",
          label: "Subcategory",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "description",
          label: "Description",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "propertyNo",
          label: "Property No.",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "status",
          label: "Status",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "assigned",
          label: "Assigned",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "actions",
          label: "",
          sortable: true,
          class: "text-center",
        },
      ],
      assetInfo: {
        status: "Serviceable",
        assetAccount: null,
        assetCategory: null,
        assetSubcategory: null,
        unit: null,
        assetDepartment: null,
        dateAcquired: "",
        itemDescription: "",
        cost: null,
        noWarranty: "false",
        hasWarranty: "false",
        removeAssignment: false,
        accountableEmployee: "",
        actualUser: "",
        sameAsActualUser: false,
        departmentAssigned: null,
        location: null,
        condition: "",
        remarks: "",
      },
      assetAccountOptions: [
        { value: "equipment", text: "Equipment" },
        { value: "furniture", text: "Furniture & Fixtures" },
        { value: "vehicle", text: "Transportation Equipment" },
      ],
      assetCategoryOptions: [
        {
          value: "ict",
          text: "Information Communication Technology Equipment",
        },
        { value: "office", text: "Office Equipment" },
        { value: "technical", text: "Technical & Scientific Equipment" },
      ],
      assetSubcategoryOptions: [
        { value: "computer", text: "Computer" },
        { value: "printer", text: "Printer" },
        { value: "scanner", text: "Scanner" },
      ],
      unitOptions: [
        { value: "unit", text: "Unit" },
        { value: "set", text: "Set" },
        { value: "piece", text: "Piece" },
      ],
      departmentOptions: [
        { value: "hr", text: "Human Resources" },
        { value: "it", text: "Information Technology" },
        { value: "finance", text: "Finance" },
        { value: "admin", text: "Administration" },
      ],
      locationOptions: [
        { value: "floor1", text: "1st Floor - City Hall Main Building" },
        { value: "floor2", text: "2nd Floor - City Hall Main Building" },
        { value: "floor3", text: "3rd Floor - City Hall Main Building" },
      ],
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    async getAllAssets() {
      this.isBusy = true;
      this.showLoading = true;
      try {
        const res = await this.$axios.get(
          `${this.$axios.defaults.baseURL}/api-aims/items/get-items-filter?text='vehicle'`
        );
        this.assetList = res.data || [];
      } catch (error) {
        console.error("Failed to load Assets", error);
      } finally {
        this.isBusy = false;
        this.showLoading = false;
      }
    },
    saveAssetChanges() {
      console.log("Saving asset changes:", this.assetForm);
      this.$bvModal.hide("bv-modal-asset-details");
    },
    cancelAssetDetails() {
      this.$bvModal.hide("bv-modal-asset-details");
    },
  },
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

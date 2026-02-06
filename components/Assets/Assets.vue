<template>
  <div class="my-3" id="requests-view">
    <Loading v-if="showLoading" style="z-index: 9999" />
    <!-- View Details -->
    <b-modal
      no-close-on-backdrop
      header-class="assetColor"
      id="bv-modal-asset-details"
      title="Asset Item Details"
      size="lg"
      @close="closeModalView"
    >
      <b-container fluid>
        <div class="asset-details-section">
          <div class="section-header">
            <i class="fas fa-chart-line"></i>
            <span class="section-title">Asset Details</span>
          </div>

          <div class="asset-info-card">
            <p class="property-no">{{ assetDetails.PropertyNo }}</p>
            <h5 class="asset-title">{{ assetDetails.Description }}</h5>
            <p class="office-name">{{ assetDetails.Office }}</p>
            <b-badge variant="primary" class="date-badge">
              <template v-if="assetDetails.date_validity">
                Until {{ formatDate(assetDetails.date_validity) }}
              </template>
              <template v-else> No warranty date </template>
            </b-badge>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">
                <i class="fas fa-credit-card"></i>
                <span>General Account</span>
              </div>
              <p class="info-value">{{ assetDetails.AccountTitle }}</p>
            </div>

            <div class="info-item">
              <div class="info-label">
                <i class="fas fa-layer-group"></i>
                <span>Category</span>
              </div>
              <p class="info-value">{{ assetDetails.Category || "N/A" }}</p>
            </div>

            <div class="info-item">
              <div class="info-label">
                <i class="fas fa-tags"></i>
                <span>Subcategory</span>
              </div>
              <p class="info-value">{{ assetDetails.Subcategory }}</p>
            </div>

            <div class="info-item">
              <div class="info-label">
                <i class="far fa-calendar-alt"></i>
                <span>Date Acquired</span>
              </div>
              <p class="info-value">{{ formatDate(assetDetails.DateAcquired) }}</p>
            </div>

            <div class="info-item">
              <div class="info-label">
                <i class="fas fa-money-bill-wave"></i>
                <span>Unit Cost</span>
              </div>
              <p class="info-value">{{ formatCurrency(assetDetails.UnitCost) }}</p>
            </div>
          </div>
        </div>
        <div class="text-center">
          <b-button
            size="sm"
            :disabled="!assetDetails.IsAssigned"
            class="primaryBtn"
            @click="unassignAsset"
          >
            <font-awesome-icon icon="user-minus" class="mr-2" />Unassign
          </b-button>
          <b-button
            size="sm"
            :disabled="!assetDetails.IsAssigned"
            class="primaryBtn"
            @click="toggleTransferSection"
          >
            <font-awesome-icon icon="right-left" class="mr-2" />Transfer
          </b-button>
          <b-button
            size="sm"
            :disabled="assetDetails.IsAssigned"
            class="primaryBtn"
            @click="toggleAssignmentSection"
          >
            <font-awesome-icon icon="user-plus" class="mr-2" />Assign
          </b-button>
        </div>
        <hr />

        <div class="assignment-section">
          <div class="section-header">
            <i class="fas fa-clipboard-list"></i>
            <span class="section-title">Assignment Details</span>
          </div>
          
          <div class="assignment-info">
            <h4 class="assigned-employee">{{ assetDetails.EmployeeAssigned || "N/A" }}</h4>
            <p class="office-location">{{ assetDetails.OfficeName || "N/A" }}</p>
            <p class="location-detail">{{ assetDetails.location || "N/A" }}</p>
            <b-badge :variant="assetDetails.LocationIsOutside ? 'warning' : 'success'" class="location-badge">
              {{ assetDetails.LocationIsOutside ? "OUTSIDE" : "ON PREMISES" }}
            </b-badge>
          </div>
          <b-collapse
            id="assignment-section"
            v-model="showAssignmentSection"
            class="assignment-form"
          >
            <b-row>
              <b-col cols="12">
                <b-form-group>
                  <template #label>
                    <div class="field-label">
                      <span>Employee Assigned to</span>
                      <b-form-checkbox
                        v-model="assignmentDetails.sameAsActualUser"
                        class="same-user-checkbox"
                        size="sm"
                      >
                        Same as Actual User
                      </b-form-checkbox>
                    </div>
                  </template>
                  <b-input-group>
                    <b-form-input
                      size="sm"
                      v-model="assignmentDetails.employeeAssigned"
                      placeholder="Insert Assigned Employee Here . . ."
                      class="assignment-input"
                    ></b-form-input>
                    <b-input-group-append>
                      <b-button size="sm" variant="primary" class="icon-btn">
                        <i class="fas fa-file"></i>
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>

            <!-- User Employee -->
            <b-row>
              <b-col cols="12">
                <b-form-group label="User Employee">
                  <b-input-group>
                    <b-form-input
                      size="sm"
                      v-model="assignmentDetails.userEmployee"
                      placeholder="Insert Asset User Here . . ."
                      class="assignment-input"
                    ></b-form-input>
                    <b-input-group-append>
                      <b-button size="sm" variant="primary" class="icon-btn">
                        <i class="fas fa-file"></i>
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>

            <!-- Department Assigned -->
            <b-row>
              <b-col cols="12">
                <b-form-group label="Department Assigned">
                  <b-form-select
                    size="sm"
                    v-model="assignmentDetails.departmentAssigned"
                    :options="departmentOptions"
                    class="assignment-select"
                  >
                    <template #first>
                      <b-form-select-option :value="null"
                        >- Select Office -</b-form-select-option
                      >
                    </template>
                  </b-form-select>
                </b-form-group>
              </b-col>
            </b-row>

            <!-- Location -->
            <b-row>
              <b-col cols="12">
                <b-form-group label="Location">
                  <b-form-select
                    size="sm"
                    v-model="assignmentDetails.location"
                    :options="locationOptions"
                    class="assignment-select"
                  >
                    <template #first>
                      <b-form-select-option :value="null"
                        >- Select Location -</b-form-select-option
                      >
                    </template>
                  </b-form-select>
                </b-form-group>
              </b-col>
            </b-row>

            <!-- Asset's Condition -->
            <b-row>
              <b-col cols="12">
                <b-form-group label="Asset's Condition">
                  <b-form-textarea
                    size="sm"
                    v-model="assignmentDetails.condition"
                    placeholder="Enter Condition Here (If Any)"
                    rows="3"
                    class="assignment-textarea"
                  ></b-form-textarea>
                </b-form-group>
              </b-col>
            </b-row>

            <!-- Remarks -->
            <b-row>
              <b-col cols="12">
                <b-form-group label="Remarks">
                  <b-form-textarea
                    size="sm"
                    v-model="assignmentDetails.remarks"
                    placeholder="Enter Remarks Here (If Any)"
                    rows="3"
                    class="assignment-textarea"
                  ></b-form-textarea>
                </b-form-group>
              </b-col>
            </b-row>
          </b-collapse>
        </div>
      </b-container>
      <template v-slot:modal-footer>
        <div>
          <b-button size="sm" class="greyBtn mr-2" @click="closeModalView">
            Cancel
          </b-button>
          <b-button
            size="sm"
            v-if="showAssignmentSection"
            class="primaryBtn"
            @click="transferAsset"
          >
            <font-awesome-icon icon="right-left" class="mr-2" />Save Changes
          </b-button>
        </div>
      </template>
    </b-modal>
    <!-- End Modal -->

    <!-- Add Asset Modal -->
    <b-modal
      no-close-on-backdrop
      header-class="assetColor"
      id="bv-modal-add-asset"
      title="Add Asset"
      size="lg"
      @close="cancelAssetDetails"
    >
      <b-container fluid>
        <b-row class="mb-4">
          <b-col cols="12" class="text-center">
            <h4 class="modal-title-custom">
              <i class="fas fa-link"></i> Asset Information Form
            </h4>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="12">
            <b-form-group label="Status">
              <b-form-input
                size="sm"
                v-model="assetInfo.status"
                value="Serviceable"
                readonly
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label="Asset Account">
              <b-form-select
                size="sm"
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
                size="sm"
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

        <b-row>
          <b-col md="6">
            <b-form-group label="Asset Subcategory">
              <b-form-select
                size="sm"
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
              <b-form-select
                size="sm"
                v-model="assetInfo.unit"
                :options="unitOptions"
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

        <b-row>
          <b-col md="6">
            <b-form-group label="Asset Department">
              <b-form-select
                size="sm"
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
                size="sm"
                type="date"
                v-model="assetInfo.dateAcquired"
                placeholder="10/29/2025"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label="Item Description">
              <b-form-textarea
                size="sm"
                v-model="assetInfo.itemDescription"
                placeholder="Enter Asset Description Here"
                rows="3"
              ></b-form-textarea>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Cost">
              <b-input-group size="sm" prepend="Php">
                <b-form-input
                  type="number"
                  size="sm"
                  v-model="assetInfo.cost"
                  placeholder="Enter Asset Cost Here"
                  step="0.01"
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col cols="12">
            <div class="d-flex align-items-center">
              <span>No Asset Warranty Available</span>
              <b-form-checkbox
                v-model="assetInfo.hasWarranty"
                name="has-warranty"
                value="true"
                unchecked-value="false"
                class="ml-3 mb-0"
              >
                Has Warranty
              </b-form-checkbox>
            </div>
          </b-col>
        </b-row>

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
        <hr />
        <b-row class="mb-4">
          <b-col cols="12" class="text-center">
            <h5 class="section-title-custom">
              <i class="fas fa-user"></i> Assignment Details
            </h5>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label-size="sm" class="mb-0">
              <label class="d-flex align-items-center mb-1">
                <small>Accountable Employee/Officer</small>
                <b-form-checkbox
                  v-model="assetInfo.sameAsActualUser"
                  class="ml-2 mb-0"
                  size="sm"
                >
                  Same as Actual User
                </b-form-checkbox>
              </label>

              <b-input-group>
                <b-form-input
                  v-model="assetInfo.accountableEmployee"
                  placeholder="Insert Accountable Employee/Officer Here . . ."
                ></b-form-input>
                <b-input-group-append>
                  <b-button size="sm" variant="primary">
                    <font-awesome-icon icon="file" />
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group label="Actual User">
              <b-input-group>
                <b-form-input
                  v-model="assetInfo.actualUser"
                  placeholder="Insert Actual User Here . . ."
                ></b-form-input>
                <b-input-group-append>
                  <b-button size="sm" variant="primary">
                    <font-awesome-icon icon="file" />
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>

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
            Save Asset
          </b-button>
        </div>
      </template>
    </b-modal>
    <!-- End Modal -->
    <div class="mt-2">
      <b-row>
        <b-col>
          <nav class="breadcrumb-container ml-4">
            <a href="#" class="breadcrumb-link">Home</a>
            <span class="breadcrumb-separator">▶</span>
            <span class="breadcrumb-current">Assets</span>
          </nav>
          <b-card class="cardProfile mainContent">
            <b-row>
              <b-col cols="3">
                <b-form-group
                  label-size="md"
                  label-for="FilterInput"
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
                  </b-input-group>
                </b-form-group>
              </b-col>

              <b-col class="d-flex align-items-end">
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

              <!-- Right: add new asset -->
              <b-col
                cols="3"
                class="d-flex align-items-end justify-content-end"
              >
                <b-button
                  class="defaultBtn"
                  style="font-size: 13px"
                  v-b-tooltip.hover
                  title="Add new Asset"
                  @click="$bvModal.show('bv-modal-add-asset')"
                >
                  <font-awesome-icon icon="circle-plus" class="icon" />
                  Add New Asset
                </b-button>
              </b-col>
            </b-row>

            <!-- table assets -->
            <b-table
              id="assetTable"
              ref="assetTable"
              class="tableAsset mt-4"
              style="font-size: 12px"
              head-variant="light"
              show-empty
              stacked="md"
              small
              sticky-header
              no-border-collapse
              hover
              selectable
              select-mode="single"
              :items="paginatedItems"
              :fields="fields"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :sort-direction="sortDirection"
              :busy.sync="isBusy"
              @row-selected="onRowSelected"
            >
              <template #table-busy>
                <div class="text-center text-secondary my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong>&nbsp;Loading...</strong>
                </div>
              </template>
               <template v-slot:cell(SubCategory)="row">
                <small
                  ><b>{{ row.item.SubCategory }}</b></small
                >
                <small>{{ row.item.Category }}</small>
                <br />
                <small>{{ row.item.AccountTitle }}</small>
              </template>
              <template v-slot:cell(AccountTitle)="row">
                <small
                  ><b>{{ row.item.AccountCode }}</b></small
                >
                <br />
                <small>{{ row.item.AccountTitle }}</small>
              </template>
              <template v-slot:cell(IsAssigned)="row">
                <b-form-checkbox
                  v-model="row.item.IsAssigned"
                  :checked="row.item.IsAssigned"
                  disabled
                  class="mr-2"
                ></b-form-checkbox>
              </template>
              <!-- <template v-slot:cell(AppStatus)="row">
                <b-badge
                  :class="[
                    'statusDesign',
                    'd-block',
                    row.item.AppStatus.toLowerCase() + 'Stat',
                  ]"
                  >&nbsp;{{ row.item.AppStatus }}
                </b-badge>
              </template> -->
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
                    />View/Edit Asset</b-dropdown-item-button
                  >
                  <b-dropdown-item-button @click="openEditModal(row)">
                    <font-awesome-icon
                      icon="eye"
                      class="viewIcon mr-2"
                      small
                    />View Details</b-dropdown-item-button
                  >
                  <b-dropdown-item-button @click="openEditModal(row)">
                    <font-awesome-icon
                      icon="gear"
                      class="viewIcon mr-2"
                      small
                    />View Maintenance</b-dropdown-item-button
                  >
                  <b-dropdown-item-button @click="openEditModal(row)">
                    <font-awesome-icon
                      icon="paperclip"
                      class="viewIcon mr-2"
                      small
                    />View Attachment</b-dropdown-item-button
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
import Loading from "@/components/LoadingOverlay/Loading";
import moment from "moment";

export default {
  layout: "sidebar",
  components: {
    Loading,
  },

  data() {
    return {
      showLoading: false,
      currentPage: 1,
      perPage: 10,
      isBusy: false,
      sortDesc: false,
      sortDirection: "asc",
      sortBy: "PropertyNo",
      filter: "",

      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },
      fields: [
        {
          key: "AccountTitle",
          label: "Account Title",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
          thStyle: { width: "20%" },
        },
        {
          key: "Subcategory",
          label: "Subcategory",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
          thStyle: { width: "10%" },
        },
        {
          key: "Description",
          label: "Description",
          sortable: true,
          sortDirection: "desc",
          thStyle: { width: "40%" },
          class: "text-left",
        },
        {
          key: "PropertyNo",
          label: "Property No.",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "Status",
          label: "Status",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "IsAssigned",
          label: "Assigned",
          class: "text-center",
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
      assetDetails: [],
      assetList: [],
      assignmentDetails: [],
      showAssignmentSection: false,
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
  async created() {},
  computed: {
    filteredItems() {
      let items = this.assetList;

      return items;
    },

    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredItems.slice(start, end);
    },

    totalRows() {
      return this.filteredItems.length;
    },
    bottomLabel() {
      let end = this.perPage * this.currentPage;
      let start = end - this.perPage + 1;

      if (end > this.filteredItems.length) {
        end = this.filteredItems.length;
      }
      if (this.filteredItems.length === 0) {
        start = 0;
      }
      return `Showing ${start} to ${end} of ${this.filteredItems.length} entries`;
    },
  },
  watch: {
    filter: {
      handler() {
        this.getAllAssets();
      },
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    formatDate(date) {
      return moment(date).format("MMMM D, YYYY");
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("en-PH", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
    async getAllAssets() {
      this.isBusy = true;
      this.showLoading = true;
      try {
        const res = await this.$axios.get(
          `${this.$axios.defaults.baseURL}/items/get-items-filter?text=${this.filter}`
        );
        this.assetList = res.data || [];
      } catch (error) {
        console.error("Failed to load Assets", error);
      } finally {
        this.isBusy = false;
        this.showLoading = false;
      }
    },
    onRowSelected(items) {
      if (items && items.length > 0) {
        this.assetDetails = items[0];
        this.$bvModal.show("bv-modal-asset-details");
      }
      console.log("Selected Row:", this.assetDetails);
    },
    // clearTableSelection() {
    //   if (this.$refs.assetTable) {
    //     this.$refs.assetTable.clearSelected();
    //   }
    //   this.assetDetails = {};
    // },
    toggleAssignmentSection() {
      this.showAssignmentSection = !this.showAssignmentSection;
    },
    toggleTransferSection() {
      this.showAssignmentSection = !this.showAssignmentSection;
    },
    saveAssetChanges() {
      console.log("Saving asset changes:", this.assetForm);
      this.$bvModal.hide("bv-modal-add-asset");
    },
    cancelAssetDetails() {
      this.$bvModal.hide("bv-modal-add-asset");
    },
    async closeModalView() {
      this.$refs.assetTable.clearSelected();
      this.$bvModal.hide("bv-modal-asset-details");
    },
  },
};
</script>

<style scoped>

</style>

<template>
  <div class="my-3" id="requests-view">
    <div class="mt-3">
      <b-row>
        <b-col>
          <nav class="breadcrumb-container ml-4">
            <a href="#" class="breadcrumb-link">Home</a>
            <span class="breadcrumb-separator">▶</span>
            <a href="#" class="breadcrumb-link">File</a>
            <span class="breadcrumb-separator">▶</span>
            <span class="breadcrumb-current">Suppliers</span>
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

              <!-- Right: Create New MTOP -->
              <b-col
                cols="3"
                class="d-flex align-items-end justify-content-end"
              >
                <b-button
                  class="defaultBtn"
                  style="background: #0b345f; font-size: 13px"
                  v-b-tooltip.hover
                  title="Add New Supplier"
                  @click="$bvModal.show('bv-modal-create')"
                >
                  <font-awesome-icon icon="circle-plus" class="icon" />
                  Add New Supplier
                </b-button>
              </b-col>
            </b-row>

            <!-- table employees -->
            <b-table
              id="empTable"
              class="tableAsset my-3 mx-3"
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
              <template v-slot:cell(is_active)="row">
                <b-badge
                  :variant="row.item.is_active ? 'success' : 'secondary'"
                >
                  {{ row.item.is_active ? "Active" : "Inactive" }}
                </b-badge>
              </template>
              <template v-slot:cell(actions)="row">
                <b-dropdown class="dropdownBtn" right variant="link" no-caret>
                  <template #button-content>
                    <font-awesome-icon icon="bars" />
                  </template>
                  <b-dropdown-header class="dropdown-header">
                    Actions
                  </b-dropdown-header>
                  <b-dropdown-item-button @click="openEditModal(row.item)">
                    <font-awesome-icon
                      icon="pen-to-square"
                      class="viewIcon mr-2"
                      small
                    />Edit
                  </b-dropdown-item-button>
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

    <!-- Add/Edit Supplier Modal -->
    <b-modal
      id="bv-modal-create"
      :title="isEditMode ? 'Edit Supplier' : 'Add New Supplier'"
      no-close-on-backdrop
      header-class="assetColor"
      @hidden="resetForm"
    >
      <template #modal-title>
        <div class="modal-title-header">
          <div class="modal-title-icon">
            <font-awesome-icon icon="users" />
          </div>
          <div class="modal-title-text">
            <span class="modal-title-main">Add/Edit new supplier</span>
            <span class="modal-title-desc">Enter supplier details below</span>
          </div>
        </div>
      </template>
      <b-form>
        <b-form-group label="Supplier Name" label-for="supplierName">
          <b-form-input
            id="supplierName"
            v-model="supplierForm.supplierName"
            placeholder="Enter supplier name"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Supplier Address" label-for="supplierAddress">
          <b-form-input
            id="supplierAddress"
            v-model="supplierForm.supplierAddress"
            placeholder="Enter supplier address"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Contact Number" label-for="supplierContactNo">
          <b-form-input
            id="supplierContactNo"
            v-model="supplierForm.supplierContactNo"
            placeholder="Enter contact number"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group v-if="isEditMode" label="Status">
          <b-form-checkbox v-model="supplierForm.isActive">
            Active
          </b-form-checkbox>
        </b-form-group>
      </b-form>
      <template v-slot:modal-footer>
        <div>
          <b-button size="sm" class="greyBtn mr-2" @click="resetForm()"
            >Cancel</b-button
          >
          <b-button
            @click="saveSupplier"
            :disabled="isSaving"
            size="sm"
            class="primaryBtn"
          >
            <b-spinner v-if="isSaving" small></b-spinner>
            {{ isSaving ? "Saving..." : "Save" }}
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
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
      sortBy: "supplierName",
      filter: "",
      suppliersList: [],
      isActive: 1,
      isEditMode: false,
      editingId: null,
      supplierForm: {
        supplierName: "",
        supplierAddress: "",
        supplierContactNo: "",
        isActive: true,
      },

      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },
      fields: [
        {
          key: "supplier_name",
          label: "SUPPLIER NAME",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "supplier_address",
          label: "SUPPLIER ADDRESS",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "ContactPerson",
          label: "CONTACT PERSON",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "supplier_contactno",
          label: "CONTACT NUMBER",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "is_active",
          label: "STATUS",
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
    };
  },
  computed: {
    filteredItems() {
      let items = this.suppliersList;
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
        this.getSuppliers();
      },
      immediate: true,
    },
  },
  async mounted() {
    await this.getSuppliers();
  },
  methods: {
    async getSuppliers() {
      this.isBusy = true;
      this.showLoading = true;
      try {
        const res = await this.$axios.get(
          `${
            this.$axios.defaults.baseURL
          }/file-maintenance/suppliers/get-all/?isActive=${
            this.isActive
          }&supplier=${this.filter || ""}`
        );
        this.suppliersList = res.data || [];
      } catch (error) {
        console.error("Failed to load Suppliers", error);
        this.alert = {
          showAlert: true,
          variant: "danger",
          message: "Failed to load suppliers data",
        };
      } finally {
        this.isBusy = false;
        this.showLoading = false;
      }
    },
    async addSupplier(data) {
      try {
        const res = await this.$axios.post(
          `${this.$axios.defaults.baseURL}/file-maintenance/suppliers/add`,
          {
            SupplierName: data.SupplierName,
            SupplierAddress: data.SupplierAddress,
            SupplierContactNo: data.SupplierContactNo,
            CreatedBy: data.CreatedBy,
          }
        );
        return res.data;
      } catch (error) {
        console.error("Failed to add supplier", error);
        throw error;
      }
    },
    async updateSupplier(id, data) {
      try {
        const res = await this.$axios.put(
          `${this.$axios.defaults.baseURL}/file-maintenance/suppliers/update/${id}`,
          {
            SupplierName: data.SupplierName,
            SupplierAddress: data.SupplierAddress,
            SupplierContactNo: data.SupplierContactNo,
            IsActive: data.IsActive,
            UpdatedBy: data.UpdatedBy,
          }
        );
        return res.data;
      } catch (error) {
        console.error("Failed to update supplier", error);
        throw error;
      }
    },
    clearFilter() {
      this.filter = "";
      this.getSuppliers();
    },
    openEditModal(supplier) {
      this.isEditMode = true;
      this.editingId = supplier.supplier_id || supplier.id;
      this.supplierForm = {
        supplierName: supplier.supplier_name,
        supplierAddress: supplier.supplier_address,
        supplierContactNo: supplier.supplier_contactno,
        isActive: supplier.is_active,
      };
      this.$bvModal.show("bv-modal-create");
    },
    resetForm() {
      this.isEditMode = false;
      this.editingId = null;
      this.supplierForm = {
        supplierName: "",
        supplierAddress: "",
        supplierContactNo: "",
        isActive: true,
      };
      this.$bvModal.hide("bv-modal-create");
    },
    async saveSupplier() {
      try {
        if (
          !this.supplierForm.supplierName ||
          !this.supplierForm.supplierAddress ||
          !this.supplierForm.supplierContactNo
        ) {
          this.showAlert("Please fill all required fields", "warning");
          return;
        }

        if (this.isEditMode) {
          await this.updateSupplier(this.editingId, {
            SupplierName: this.supplierForm.supplierName,
            SupplierAddress: this.supplierForm.supplierAddress,
            SupplierContactNo: this.supplierForm.supplierContactNo,
            IsActive: this.supplierForm.isActive ? 1 : 0,
            UpdatedBy: localStorage.id,
          });
          this.showAlert("Supplier updated successfully!", "success");
        } else {
          await this.addSupplier({
            SupplierName: this.supplierForm.supplierName,
            SupplierAddress: this.supplierForm.supplierAddress,
            SupplierContactNo: this.supplierForm.supplierContactNo,
            CreatedBy: localStorage.id,
          });
          this.showAlert("Supplier added successfully!", "success");
        }

        this.$bvModal.hide("bv-modal-create");
        this.resetForm();
        this.getSuppliers();
      } catch (error) {
        console.error("Failed to save supplier", error);
        this.showAlert("Failed to save supplier", "danger");
      }
    },
    showAlert(message, variant) {
      this.alert = {
        showAlert: true,
        variant,
        message,
      };
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

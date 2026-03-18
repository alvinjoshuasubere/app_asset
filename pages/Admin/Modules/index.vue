<template>
  <!-- DIVISION -->
  <div class="my-3" id="requests-view">
    <!-- Add Modal -->
    <b-modal
      size="md"
      header-class="assetColor"
      id="bv-modal-addMod"
      class="modal"
      no-close-on-backdrop
    >
      <template v-slot:modal-title>
        <h6>Add Menu Description</h6>
      </template>
      <b-card class="card-shadow">
        <b-form-group>
          <label style="font-size: 13px">Menu Description</label>
          <b-form-input v-model="moduleData.module_desc"></b-form-input>
        </b-form-group>
      </b-card>
      <template v-slot:modal-footer>
        <b-button size="sm" @click="addModule()" class="primaryBtn mr-2"
          >Save</b-button
        >
        <b-button size="sm" @click="cancelAdd()" class="greyBtn mr-2"
          >Cancel</b-button
        >
      </template>
    </b-modal>
    <!--End Modal  -->

    <!-- Edit Modal -->
    <b-modal
      size="md"
      header-class="assetColor"
      id="bv-modal-editMod"
      class="modal"
      no-close-on-backdrop
    >
      <template v-slot:modal-title>
        <h6>Edit Menu Description</h6>
      </template>
      <b-card class="card-shadow">
        <b-form-group>
          <label style="font-size: 13px">Menu Description</label>
          <b-form-input v-model="moduleData.module_desc"></b-form-input>
        </b-form-group>
      </b-card>
      <template v-slot:modal-footer>
        <b-button size="sm" @click="editModule()" class="primaryBtn mr-2"
          >Save</b-button
        >
        <b-button size="sm" @click="cancelEdit()" class="greyBtn mr-2"
          >Cancel</b-button
        >
      </template>
    </b-modal>
    <!-- End Edit Modal -->

    <b-row>
      <b-col>
        <nav class="breadcrumb-container ml-4">
          <a href="#" class="breadcrumb-link">Home</a>
          <span class="breadcrumb-separator">▶</span>
          <span class="breadcrumb-current">Modules</span>
        </nav>
        <b-card class="cardProfile mainContent">
          <b-row>
            <b-col cols="8">
              <b-form-group class="searchbar" label-size="sm">
                <b-input-group size="md">
                  <b-form-input
                    type="search"
                    id="inputSearch"
                    class="searchbar no-outline"
                    placeholder="Type to Search"
                    v-model="filterModules"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button
                      class="buttonClearSearch"
                      id="buttonClearSearch"
                      :disabled="!filterModules"
                      @click="clearSearch"
                      >Clear</b-button
                    >
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
            <b-col cols="4" class="text-right">
              <b-button
                style="background: #00488e; border: none; font-size: 13px"
                class="ml-4"
                size="md"
                @click="$bvModal.show('bv-modal-addMod')"
              >
                <font-awesome-icon icon="plus" class="icon" />Add New Module
              </b-button>
            </b-col>
          </b-row>
          <b-table
            head-variant="light"
            style="font-size: 12px"
            class="my-3 tableAsset"
            show-empty
            small
            :current-page="currentPage"
            :per-page="perPage"
            :busy.sync="isBusy"
            :items="filteredModules"
            :fields="fieldsModules"
          >
           <template v-slot:cell(actions)="row">
              <button
                id="editAddress"
                class="editBtn"
                @click="openEditModule(row.item)"
                v-b-tooltip.noninteractive.hover
                title="Edit"
              >
                <font-awesome-icon
                  icon="pen-to-square"
                  class="viewIcon"
                  small
                />
              </button>
            </template>
            
            <template v-slot:table-caption>
              <b-row align-h="end">
                <b-col cols="6">{{ bottomLabel }}</b-col>
                <b-col cols="6">
                  <b-pagination
                    v-model="currentPage"
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
    <div>
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
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  components: {},
  middleware: "pageValidator",
  meta: {
    access: { right: "View Modules" },
  },
  data() {
    return {
      filterModules: "",
      isBusy: false,
      modules: [],
      currentPage: 1,
      perPage: 10,
      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },

      moduleData: {
        module_id: null,
        module_desc: null,
      },

      fieldsModules: [
        {
          key: "module_desc",
          label: "Module Name",
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
  async created() {
    await this.getModules();
  },
  computed: {
    filteredModules() {
      if (this.filterModules == null) {
        return this.modules;
      }
      const filterLowerCase = this.filterModules.trim().toLowerCase();

      return this.modules.filter((item) => {
        return String(item.MenuDescription)
          .toLowerCase()
          .includes(filterLowerCase);
      });
    },
    totalRows() {
      return this.filteredModules.length;
    },
    bottomLabel() {
      let end = this.perPage * this.currentPage;
      let start = end - this.perPage + 1;

      if (end > this.filteredModules.length) {
        end = this.filteredModules.length;
      }
      if (this.filteredModules.length === 0) {
        start = 0;
      }
      return `Showing ${start} to ${end} of ${this.filteredModules.length} entries`;
    },
  },
  mounted() {},
  methods: {
    showAlert(message, variant) {
      this.alert = {
        showAlert: 3,
        variant,
        message,
      };
    },
    async getModules() {
      this.isBusy = true;
      try {
        const res = await axios({
          method: "GET",
          url: `${this.$axios.defaults.baseURL}/admin/modules/get-all`,
        });
        this.modules = res.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isBusy = false;
      }
    },
    async addModule() {
      try {
        await axios({
          method: "POST",
          url: `${this.$axios.defaults.baseURL}/admin/modules/insert`,
          data: {
            module_description: this.moduleData.module_desc,
          },
        });
        await this.getModules();
        await this.resetFields();
        this.$bvModal.hide("bv-modal-addMod");
        this.showAlert("Added successfully", "success");
      } catch (error) {
        this.showAlert(error.response.data.error, "danger");
      }
    },
    openEditModule(data) {
      this.moduleData = data;
      console.log(data)
      this.moduleData.module_desc = data.module_desc;
      this.$bvModal.show("bv-modal-editMod");
    },
    async editModule() {
      try {
        await axios({
          method: "PUT",
          url: `${this.$axios.defaults.baseURL}/admin/modules/update/${this.moduleData.module_id}`,
          data: {
            module_description: this.moduleData.module_desc,
          },
        });
        await this.getModules();
        await this.resetFields();
        this.$bvModal.hide("bv-modal-editMod");
        this.showAlert("Updated successfully", "success");
      } catch (error) {
        this.showAlert(error.response.data.error, "danger");
      }
    },
    cancelAdd() {
      this.$bvModal.hide("bv-modal-addMod");
      this.resetFields();
    },
    cancelEdit() {
      this.$bvModal.hide("bv-modal-editMod");
      this.resetFields();
    },
    resetFields() {
      this.moduleData = [];
    },
    clearSearch() {
      this.filterModules = null;
    },
  },

  layout: "sidebar",
};
</script>

<style></style>

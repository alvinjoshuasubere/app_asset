<template>
  <!-- DIVISION -->
  <div class="my-3" id="requests-view">
    <!-- Add Modal -->
    <b-modal
      size="md"
      header-class="assetColor"
      id="bv-modal-addAct"
      class="modal"
      no-close-on-backdrop
      @close="cancelAdd"
    >
      <template v-slot:modal-title>
        <h6>Add Actions</h6>
      </template>
      <b-card class="card-shadow">
        <b-form-group>
          <label style="font-size: 13px">Menu Description</label>
          <b-form-select size="sm" id="select-module-act" v-model="selectedModule">
            <option disabled value="">Please select a menu</option>
            <option
              v-for="(dModule, i) in modulesList"
              :key="i"
              :value="dModule.module_id"
            >
              {{ dModule.module_desc }}
            </option>
          </b-form-select>

          <label style="font-size: 13px" class="mt-2">Action</label>
          <b-form-input
            id="action-desc"
            v-model="actionsData.action_description"
          ></b-form-input>
        </b-form-group>
      </b-card>

      <template v-slot:modal-footer>
        <b-button size="sm" @click="addAction()" class="primaryBtn mr-2"
          >Save</b-button
        >
        <b-button size="sm" @click="cancelAdd()" class="greyBtn mr-2"
          >Cancel</b-button
        >
      </template>
    </b-modal>
    <!-- End Add Modal -->

    <!-- Edit Modal -->
    <b-modal
      size="md"
      header-class="assetColor"
      id="bv-modal-editAct"
      class="modal"
      no-close-on-backdrop
    >
      <template v-slot:modal-title>
        <h6>Edit Actions</h6>
      </template>
      <b-card class="card-shadow">
        <b-form-group>
          <label style="font-size: 13px">Menu Description</label>
          <b-form-input
            id="input-module-act"
            v-model="actionsData.MenuDescription"
            disabled
          ></b-form-input>

          <label style="font-size: 13px" class="mt-2">Action</label>
          <b-form-input
            id="action-desc"
            v-model="actionsData.action_description"
          ></b-form-input>
          <label style="font-size: 13px" class="mt-2">Status</label>
          <b-form-select
            size="sm"
            id="select-status-act"
            type="text"
            v-model="actionsData.IsActive"
          >
            <option :value="true">Active</option>
            <option :value="false">Inactive</option>
          </b-form-select>
        </b-form-group>
      </b-card>

      <template v-slot:modal-footer>
        <b-button size="sm" @click="editAction()" class="primaryBtn mr-2"
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
          <span class="breadcrumb-current">Actions</span>
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
                    v-model="filterActions"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button
                      class="buttonClearSearch"
                      id="buttonClearSearch"
                      :disabled="!filterActions"
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
                @click="$bvModal.show('bv-modal-addAct')"
              >
                <font-awesome-icon icon="plus" class="icon" />Add New Action
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
            :items="filteredActions"
            :fields="fieldsActions"
          >
            <template v-slot:cell(is_active)="row">
              <div class="d-flex align-items-center justify-content-center">
                <div
                  class="rounded-circle d-flex align-items-center justify-content-center"
                  :class="row.item.is_active ? 'bg-success' : 'bg-danger'"
                  style="width: 20px; height: 20px;"
                > 
                  <font-awesome-icon
                    icon="check"
                    class="text-white"
                    style="font-size: 12px;"
                    v-if="row.item.is_active"
                  />
                  <font-awesome-icon
                    icon="times"
                    class="text-white"
                    style="font-size: 12px;"
                    v-else
                  />
                </div>
              </div>
            </template>
            <template v-slot:cell(actions)="row">
              <button
                id="editAddress"
                class="editBtn"
                @click="openEditAction(row.item)"
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

export default {
  components: {},
  middleware: "pageValidator",
  meta: {
    access: { right: "View Actions" },
  },
  data() {
    return {
      filterActions: "",
      isBusy: false,
      actions: [],
      currentPage: 1,
      perPage: 10,
      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },
      selectedModule: null,
      actionsData: {
        MenuDescription: null,
        action_description: null,
        IsActive: null,
        user_id: null,
        id: null,
      },
      modulesList: [],
      fieldsActions: [
        {
          key: "action_desc",
          label: "Action Description",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "module_desc",
          label: "Module Description",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },

        {
          key: "is_active",
          label: "Status",
          class: "text-center",
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
    await this.getActions();
  },
  computed: {
    filteredActions() {
      if (this.filterActions == null) {
        return this.actions;
      }
      const filterLowerCase = this.filterActions.trim().toLowerCase();

      return this.actions.filter((item) => {
        return (
          String(item.ActionDescription)
            .toLowerCase()
            .includes(filterLowerCase) ||
          String(item.MenuDescription).toLowerCase().includes(filterLowerCase)
        );
      });
    },
    totalRows() {
      return this.filteredActions.length;
    },
    bottomLabel() {
      let end = this.perPage * this.currentPage;
      let start = end - this.perPage + 1;

      if (end > this.filteredActions.length) {
        end = this.filteredActions.length;
      }
      if (this.filteredActions.length === 0) {
        start = 0;
      }
      return `Showing ${start} to ${end} of ${this.filteredActions.length} entries`;
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
        this.isBusy = false;
        this.modulesList = res.data;
      } catch (error) {
        this.isBusy = false;
        this.showAlert(error.response.data.error, "danger");
      }
    },
    async getActions() {
      this.isBusy = true;
      try {
        const res = await axios({
          method: "GET",
          url: `${this.$axios.defaults.baseURL}/admin/actions/get-all`,
          headers: {
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "GET",
          },
        });
        this.isBusy = false;
        this.actions = res.data;
      } catch (error) {
        this.showAlert(error.response.data.error, "danger");
      }
    },
    async addAction() {
      try {
        await axios({
          method: "POST",
          url: `${this.$axios.defaults.baseURL}/admin/actions/insert`,
          data: {
            action_description: this.actionsData.action_description,
            module_id: this.selectedModule,
            is_active: 1,
            user_id: 12
          },
        });
        await this.getActions();
        await this.cancelAdd();
        this.showAlert("Added successfully", "success");
      } catch (error) {
        this.showAlert(error.response.data.error, "danger");
      }
    },
    openEditAction(data) {
      console.log(data);
      this.actionsData.id = data.user_actions_id;
      this.actionsData.action_description = data.action_desc;
      this.actionsData.MenuDescription = data.module_desc;
      this.actionsData.mainmenu_id = data.module_id;
      this.actionsData.IsActive = data.is_active;
      this.$bvModal.show("bv-modal-editAct");
    },
    async editAction() {
      try {
        await axios({
          method: "PUT",
          url: `${this.$axios.defaults.baseURL}/admin/actions/update/${this.actionsData.id}`,
          data: {
            action_description: this.actionsData.action_description,
            module_id: this.actionsData.mainmenu_id,
            is_active: this.actionsData.IsActive,
            user_id: 12
          },
        });
        await this.getActions();
        await this.cancelEdit();
        this.$bvModal.hide("bv-modal-editAct");
        this.showAlert("Updated successfully", "success");
      } catch (error) {
        this.showAlert(error.response.data.error, "danger");
      }
    },
    cancelAdd() {
      this.$bvModal.hide("bv-modal-addAct");
      this.resetFields();
    },
    cancelEdit() {
      this.$bvModal.hide("bv-modal-editAct");
      this.resetFields();
    },
    resetFields() {
      this.actionsData = {
        MenuDescription: null,
        action_description: null,
        IsActive: null,
        user_id: null,
        id: null,
      };
    },
    clearSearch() {
      this.filterActions = null;
    },
  },

  layout: "sidebar",
};
</script>

<style></style>

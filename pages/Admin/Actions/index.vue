<template>
  <!-- DIVISION -->
  <div class="my-3" id="requests-view">
    <!-- Add Modal -->
    <b-modal
      size="md"
      header-class="mtopColor"
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
          <b-form-select id="select-module-act" v-model="selectedModule">
            <option disabled value="">Please select a menu</option>
            <option
              v-for="(dModule, i) in modulesList"
              :key="i"
              :value="dModule.MenuID"
            >
              {{ dModule.MenuDescription }}
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
      header-class="mtopColor"
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
        <h5 class="ml-4" style="font-weight: bolder; font-family: font_B">
          <font-awesome-icon
            icon="circle-info"
            class="viewIcon mr-2"
            small
          />Actions Information
        </h5>
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
            class="my-3"
            show-empty
            small
            :current-page="currentPage"
            :per-page="perPage"
            :busy.sync="isBusy"
            :items="filteredActions"
            :fields="fieldsActions"
          >
            <template v-slot:cell(IsActive)="row">
              <div class="badge-font-size" v-if="row.item.IsActive">
                <b-badge class="mr-2" pill variant="success">&nbsp;</b-badge
                >Active
              </div>
              <div class="badge-font-size" v-else>
                <b-badge class="mr-2" pill variant="danger">&nbsp;</b-badge
                >Inactive
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
              <button
                id="deleteAddress"
                class="deleteBtn"
                @click="deleteItem(row)"
                v-b-tooltip.noninteractive.hover
                title="Delete"
              >
                <font-awesome-icon icon="trash" class="viewIcon" small />
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
  async created() {},
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
          key: "ActionDescription",
          label: "Action Description",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "MenuDescription",
          label: "Menu Description",
          sortable: true,
          sortDirection: "desc",
          class: "text-center",
        },

        {
          key: "IsActive",
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
          url: `${this.$axios.defaults.baseURL}/admin/main-menu/get-all`,
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
          url: `${this.$axios.defaults.baseURL}/admin/actions/add`,
          data: {
            user_id: "77",
            mainmenu_id: this.selectedModule,
            isActive: true,
            action_description: this.actionsData.action_description,
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
      this.actionsData.id = data.ActionID;
      this.actionsData.action_description = data.ActionDescription;
      this.actionsData.MenuDescription = data.MenuDescription;
      this.actionsData.mainmenu_id = data.MainMenuID;
      this.actionsData.IsActive = data.IsActive;
      this.$bvModal.show("bv-modal-editAct");
    },
    async editAction() {
      try {
        await axios({
          method: "PUT",
          url: `${this.$axios.defaults.baseURL}/admin/actions/update/${this.actionsData.id}`,
          data: {
            user_id: "77",
            mainmenu_id: this.actionsData.mainmenu_id,
            isActive: this.actionsData.IsActive,
            action_description: this.actionsData.action_description,
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

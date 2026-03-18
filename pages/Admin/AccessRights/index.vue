<template>
  <div class="my-3" id="requests-view">
    <!-- Modal Edit -->
    <b-modal
      size="xl"
      header-class="assetColor"
      id="bv-modal-editDept"
      class="modal"
      no-close-on-backdrop
    >
      <template v-slot:modal-title>
        <h6>Edit Role and Access</h6>
      </template>

      <b-card class="cardShadow">
        <b-row>
          <div class="ml-3">Role Description:</div>
        </b-row>
        <b-row>
          <b-col>
            <b-form-input
              id="roleDescription"
              type="text"
              style="font-size: 13px"
              v-model="roleName"
            ></b-form-input>
          </b-col>
        </b-row>
      </b-card>

      <b-card class="cardShadow mt-4 mb-1">
        <h5 class="text-center">
          <strong>List of Access Rights</strong>
        </h5>
        <hr />
        <b-row style="font-size: 11px" class="mt-4 mb-1 ml-3">
          <b-col>
            <span>SYSTEM MANAGER</span>
            <b-form-checkbox-group
              name="admin module actions"
              stacked
              switches
              v-model="selectedAction"
              id="action-roles"
            >
              <b-form-checkbox
                :value="action.user_actions_id"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.module_desc === 'System Manager'
                )"
                :key="i"
                >{{ action.action_desc }}</b-form-checkbox
              >
            </b-form-checkbox-group>
          </b-col>
          <b-col>
            <span>Maintenance</span>
            <b-form-checkbox-group
              name="admin module actions"
              stacked
              switches
              v-model="selectedAction"
              id="action-roles"
            >
              <b-form-checkbox
                :value="action.user_actions_id"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.module_desc === 'Maintenance'
                )"
                :key="i"
                >{{ action.action_desc }}</b-form-checkbox
              >
            </b-form-checkbox-group>
          </b-col>
          <b-col>
            <span>Assets</span>
            <b-form-checkbox-group
              name="admin module actions"
              stacked
              switches
              v-model="selectedAction"
              id="dasgfd"
            >
              <b-form-checkbox
                :value="action.user_actions_id"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.module_desc === 'Assets'
                )"
                :key="i"
                >{{ action.action_desc }}</b-form-checkbox
              >
            </b-form-checkbox-group>
          </b-col>

          <b-col>
            <span>REPORTS</span>
            <b-form-checkbox-group
              name="admin module actions"
              stacked
              switches
              v-model="selectedAction"
              id="dasgfd"
            >
              <b-form-checkbox
                :value="action.user_actions_id"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.module_desc === 'Reports'
                )"
                :key="i"
                >{{ action.action_desc }}</b-form-checkbox
              >
            </b-form-checkbox-group>
          </b-col>

          <b-col>
            <span>FILE MAINTENANCE</span>
            <b-form-checkbox-group
              name="admin module actions"
              stacked
              switches
              v-model="selectedAction"
              id="dasgfd"
            >
              <b-form-checkbox
                :value="action.user_actions_id"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.module_desc === 'File Maintenance'
                )"
                :key="i"
                >{{ action.action_desc }}</b-form-checkbox
              >
            </b-form-checkbox-group>
          </b-col>

          <b-col>
            <span>Dashboard</span>
            <b-form-checkbox-group
              name="admin module actions"
              stacked
              switches
              v-model="selectedAction"
              id="dasgfd"
            >
              <b-form-checkbox
                :value="action.user_actions_id"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.module_desc === 'Dashboard'
                )"
                :key="i"
                >{{ action.action_desc }}</b-form-checkbox
              >
            </b-form-checkbox-group>
          </b-col>
        </b-row>
      </b-card>

      <template v-slot:modal-footer>
        <b-button size="sm" @click="saveUpdate()" class="primaryBtn mr-2"
          >Save</b-button
        >
        <b-button size="sm" @click="cancelEdit()" class="greyBtn mr-2"
          >Cancel</b-button
        >
      </template>
    </b-modal>
    <!-- End Modal Edit -->

    <!-- Create modal -->
    <b-modal
      size="xl"
      header-bg-variant="dark"
      header-text-variant="light"
      footer-bg-variant="light"
      id="bv-modal-addDept"
      class="modal"
      hide-header-close
      no-close-on-backdrop
      @hide="resetFields()"
    >
      <template v-slot:modal-title>
        <h6>Add Role and Access</h6>
      </template>

      <b-card class="cardShadow">
        <small class="ml-1">Role Name:</small>
        <b-row>
          <b-col>
            <b-form-input
              id="input-rolename-role"
              type="text"
              style="font-size: 10px"
              v-model="roleName"
            ></b-form-input>
          </b-col>
        </b-row>
      </b-card>
      <b-card class="cardShadow mt-4 mb-1">
        <h5 class="text-center">
          <strong>List of Access Rights</strong>
        </h5>
        <hr />
        <b-row class="mt-4 mb-1 ml-3">
          <b-col>
            <span>SYSTEM MANAGER</span>
            <b-form-checkbox-group
              name="admin module actions"
              stacked
              switches
              v-model="selectedAction"
              id="action-roles"
            >
              <b-form-checkbox
                :value="action.user_actions_id"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.module_desc === 'System Manager'
                )"
                :key="i"
                >{{ action.action_desc }}</b-form-checkbox
              >
            </b-form-checkbox-group>
          </b-col>

          <b-col>
            <span>MTOPS RECORD</span>
            <b-form-checkbox-group
              name="admin module actions"
              stacked
              switches
              v-model="selectedAction"
              id="dasgfd"
            >
              <b-form-checkbox
                :value="action.user_actions_id"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.module_desc === 'Assets'
                )"
                :key="i"
                >{{ action.action_desc }}</b-form-checkbox
              >
            </b-form-checkbox-group>
          </b-col>

          <b-col>
            <span>REPORTS</span>
            <b-form-checkbox-group
              name="admin module actions"
              stacked
              switches
              v-model="selectedAction"
              id="dasgfd"
            >
              <b-form-checkbox
                :value="action.user_actions_id"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.module_desc === 'Reports'
                )"
                :key="i"
                >{{ action.action_desc }}</b-form-checkbox
              >
            </b-form-checkbox-group>
          </b-col>

          <b-col>
            <span>FILE MAINTENANCE</span>
            <b-form-checkbox-group
              name="admin module actions"
              stacked
              switches
              v-model="selectedAction"
              id="dasgfd"
            >
              <b-form-checkbox
                :value="action.user_actions_id"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.module_desc === 'File Maintenance'
                )"
                :key="i"
                >{{ action.action_desc }}</b-form-checkbox
              >
            </b-form-checkbox-group>
          </b-col>
           <b-col>
            <span>Dashboard</span>
            <b-form-checkbox-group
              name="admin module actions"
              stacked
              switches
              v-model="selectedAction"
              id="dasgfd"
            >
              <b-form-checkbox
                :value="action.user_actions_id"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.module_desc === 'Dashboard'
                )"
                :key="i"
                >{{ action.action_desc }}</b-form-checkbox
              >
            </b-form-checkbox-group>
          </b-col>
        </b-row>
      </b-card>

      <template v-slot:modal-footer>
        <b-button size="sm" @click="saveNewRole()" class="primaryBtn mr-2"
          >Save</b-button
        >
        <b-button size="sm" @click="cancelAdd()" class="greyBtn mr-2"
          >Cancel</b-button
        >
      </template>
    </b-modal>
    <!-- End Modal Create -->

    <!-- CONTENT -->
    <b-row>
      <b-col>
        <nav class="breadcrumb-container ml-4">
          <a href="#" class="breadcrumb-link">Home</a>
          <span class="breadcrumb-separator">▶</span>
          <span class="breadcrumb-current">Roles and Access</span>
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
                    v-model="filterAccess"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button
                      class="buttonClearSearch"
                      id="buttonClearSearch"
                      :disabled="!filterAccess"
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
                @click="$bvModal.show('bv-modal-addDept')"
              >
                <font-awesome-icon icon="plus" class="icon" />Add New Role Access
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
            :items="filteredAccess"
            :fields="fieldsAccess"
          >
          <template v-slot:cell(actions)="row">
              <button
                id="editAddress"
                class="editBtn"
                @click="editDept(row.item)"
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
  data() {
    return {
      filterAccess: "",
      options: [],
      isBusy: false,
      access_rights: [],
      currentPage: 1,
      perPage: 10,

      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },

      isAlertVisible: false,
      actions: [],
      selectedAction: [],
      roles: [],
      roleDescription: "",
      roleName: "",
      roleForm: {
        id: null,
        actions: [],
        roleDescription: null,
        role_name: null,
        user_id: null,
      },

      fieldsAccess: [
        {
          key: "RoleDescription",
          label: "Role",
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
    await this.getAccess();
    await this.getActions();
  },
  // middleware: "pageValidator",
  meta: {
    access: { right: "View role Access" },
  },
  computed: {
    filteredAccess() {
      if (this.filterAccess == null) {
        return this.roles;
      }
      const filterLowerCase = this.filterAccess.trim().toLowerCase();

      return this.roles.filter((item) => {
        return String(item.role_desc)
          .toLowerCase()
          .includes(filterLowerCase);
      });
    },
    totalRows() {
      return this.filteredAccess.length;
    },
    bottomLabel() {
      let end = this.perPage * this.currentPage;
      let start = end - this.perPage + 1;

      if (end > this.filteredAccess.length) {
        end = this.filteredAccess.length;
      }
      if (this.filteredAccess.length === 0) {
        start = 0;
      }
      return `Showing ${start} to ${end} of ${this.filteredAccess.length} entries`;
    },
    activeActions() {
      return this.actions;
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
    async getAccess() {
      this.isBusy = true;
      try {
        const res = await axios({
          method: "GET",
          url: `${this.$axios.defaults.baseURL}/admin/roles/get-roles`,
          headers: {
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "GET",
          },
        });
        this.roles = res.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isBusy = false;
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
        console.log(res.data, "actions");
        this.actions = res.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isBusy = false;
      }
    },

    editDept(data) {
      this.roleForm = data;
      console.log(data, "data");
      this.roleName = data.RoleDescription;
      this.selectedAction = this.roleForm.actions
        .filter((action) => action.isActive)
        .map((action) => action.actions);
      this.$bvModal.show("bv-modal-editDept");
    },

    async saveUpdate() {
      const finalActions = [];

      this.actions.forEach((action) => {
        const isChecked = this.selectedAction.find(
          (checkedAction) => checkedAction === action.user_actions_id
        );
        
        const existingAction = this.roleForm.actions.find(
          (accessRight) => accessRight.actions === action.user_actions_id
        );

        if (isChecked || (existingAction && existingAction.isActive)) {
          finalActions.push({
            accessRightsId: existingAction ? existingAction.actionRightsId : null,
            user_actions_id: action.user_actions_id,
            is_active: isChecked ? true : false,
          });
        }
      });

      const roleData = {
        role_desc: this.roleName,
        user_id: 12,
        actions: finalActions
      };

      await axios({
        method: "PUT",
        url: `${this.$axios.defaults.baseURL}/admin/roles/update/${this.roleForm.id}`,
        data: roleData,
        headers: {
          authorization: "Bearer " + localStorage.token,
        },
      });

      await this.getAccess();
      await this.getActions();
      await this.cancelEdit();
      await this.$bvModal.hide("bv-modal-editDept");
      this.showAlert("Updated successfully", "success");
    },

   async saveNewRole() {
      const finalActions = [];
      
      this.actions.forEach((action) => {
        if (
          this.selectedAction.find(
            (checkedAction) => checkedAction === action.user_actions_id
          )
        ) {
          finalActions.push({
            user_actions_id: action.user_actions_id,
            is_active: 1, 
          });
        }
      });

      const roleData = {
        role_desc: this.roleName,
        user_id: 12,
        actions: finalActions
      };

      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/admin/roles/insert`,
        data: roleData,
        headers: {
          authorization: "Bearer " + localStorage.token,
        },
      });
      await this.getAccess();
      await this.getActions();
      await this.cancelAdd();
      await this.$bvModal.hide("bv-modal-addDept");
      this.showAlert("Added successfully", "success");
    },
    clearSearch() {
      this.filterAccess = null;
    },
    cancelEdit() {
      this.$bvModal.hide("bv-modal-editDept");
      this.resetFields();
    },
    cancelAdd() {
      this.$bvModal.hide("bv-modal-addDept");
      this.resetFields();
    },
    resetFields() {
      this.roleForm = [];
      this.roleName = "";
      this.selectedAction = [];
    },
  },

  layout: "sidebar",
};
</script>

<style></style>

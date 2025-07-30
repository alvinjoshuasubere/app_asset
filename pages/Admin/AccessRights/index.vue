<template>
  <div class="my-3" id="requests-view">
    <!-- Modal Edit -->
    <b-modal
      size="xl"
      header-class="mtopColor"
      id="bv-modal-editDept"
      class="modal"
      no-close-on-backdrop
    >
      <template v-slot:modal-title>
        <h6>Edit Department and Access</h6>
      </template>

      <b-card class="cardShadow">
        <b-row>
          <div class="ml-3">Department Name:</div>
        </b-row>
        <b-row>
          <b-col>
            <b-form-input
              id="departmentName"
              type="text"
              style="font-size: 13px"
              v-model="departmentName"
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
                :value="action.ActionID"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.MenuDescription === 'SYSTEM MANAGER'
                )"
                :key="i"
                >{{ action.ActionDescription }}</b-form-checkbox
              >
            </b-form-checkbox-group>
          </b-col>
          <b-col>
            <span>ASSESSMENT</span>
            <b-form-checkbox-group
              name="admin module actions"
              stacked
              switches
              v-model="selectedAction"
              id="action-roles"
            >
              <b-form-checkbox
                :value="action.ActionID"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.MenuDescription === 'ASSESSMENT'
                )"
                :key="i"
                >{{ action.ActionDescription }}</b-form-checkbox
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
                :value="action.ActionID"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.MenuDescription === 'MTOPS RECORD'
                )"
                :key="i"
                >{{ action.ActionDescription }}</b-form-checkbox
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
                :value="action.ActionID"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.MenuDescription === 'REPORTS'
                )"
                :key="i"
                >{{ action.ActionDescription }}</b-form-checkbox
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
                :value="action.ActionID"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.MenuDescription === 'FILE MAINTENANCE'
                )"
                :key="i"
                >{{ action.ActionDescription }}</b-form-checkbox
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
        <h6>Add Department and Access</h6>
      </template>

      <b-card class="cardShadow">
        <small class="ml-1">Department Name:</small>
        <b-row>
          <b-col>
            <b-form-input
              id="input-rolename-role"
              type="text"
              style="font-size: 10px"
              v-model="departmentName"
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
                :value="action.ActionID"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.MenuDescription === 'SYSTEM MANAGER'
                )"
                :key="i"
                >{{ action.ActionDescription }}</b-form-checkbox
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
                :value="action.ActionID"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.MenuDescription === 'MTOPS RECORD'
                )"
                :key="i"
                >{{ action.ActionDescription }}</b-form-checkbox
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
                :value="action.ActionID"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.MenuDescription === 'REPORTS'
                )"
                :key="i"
                >{{ action.ActionDescription }}</b-form-checkbox
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
                :value="action.ActionID"
                v-for="(action, i) in activeActions.filter(
                  (action) => action.MenuDescription === 'FILE MAINTENANCE'
                )"
                :key="i"
                >{{ action.ActionDescription }}</b-form-checkbox
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
        <h5 class="ml-4" style="font-weight: bolder; font-family: font_B">
          <font-awesome-icon
            icon="circle-info"
            class="viewIcon mr-2"
            small
          />Department and Access Information
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
                <font-awesome-icon icon="plus" class="icon" />Add New Access
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
            :items="filteredAccess"
            :fields="fieldsAccess"
          >
            <template v-slot:cell(actions)="row">
              <button
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
      departmentName: "",
      departmentForm: {
        id: null,
        actions: [],
        DepartmentDescription: null,
        department_name: null,
        user_id: null,
      },

      fieldsAccess: [
        {
          key: "DepartmentDescription",
          label: "Department",
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
    access: { right: "View Department Access" },
  },
  computed: {
    filteredAccess() {
      if (this.filterAccess == null) {
        return this.filterAccess;
      }
      const filterLowerCase = this.filterAccess.trim().toLowerCase();

      return this.access_rights.filter((item) => {
        return String(item.DepartmentDescription)
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
          url: `${this.$axios.defaults.baseURL}/admin/departments/get-roles`,
          headers: {
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "GET",
          },
        });
        this.access_rights = res.data;
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
      this.departmentForm = data;
      this.departmentName = data.DepartmentDescription;
      this.selectedAction = this.departmentForm.actions
        .filter((action) => action.isActive)
        .map((action) => action.actions);
      this.$bvModal.show("bv-modal-editDept");
    },

    async saveUpdate() {
      const finalActions = [];

      this.departmentForm.department_name = this.departmentName;
      this.departmentForm.user_id = "77";
      this.actions.forEach((action) => {
        const existingAction = this.departmentForm.actions.find(
          (accessRight) => accessRight.actions === action.ActionID
        );
        if (
          this.selectedAction.find(
            (checkedAction) => checkedAction === action.ActionID
          )
        ) {
          finalActions.push({
            accessRightsId: existingAction
              ? existingAction.actionRightsId
              : null,
            action: action.ActionID,
            isActive: true,
          });
        } else {
          if (
            this.departmentForm.actions.find(
              (accessRight) => accessRight.actions === action.ActionID
            )
          ) {
            console.log("unchecked");
            finalActions.push({
              accessRightsId: existingAction
                ? existingAction.actionRightsId
                : null,
              action: action.ActionID,
              isActive: false,
            });
          }
        }
      });
      this.departmentForm.actions = finalActions;
      console.log(this.departmentForm, "TEST");
      await axios({
        method: "PUT",
        url: `${this.$axios.defaults.baseURL}/admin/departments/update`,
        data: {
          departmentForm: { ...this.departmentForm },
        },
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
      this.departmentForm.department_name = this.departmentName;
      this.departmentForm.user_id = "77";

      await this.selectedAction.forEach((selected) => {
        this.departmentForm.actions.push(
          this.actions.find((action) => action.ActionID === selected)
        );
      });

      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/admin/departments/add`,
        data: {
          departmentForm: { ...this.departmentForm },
        },
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
      this.departmentForm = [];
      this.departmentName = "";
      this.selectedAction = [];
    },
  },

  layout: "sidebar",
};
</script>

<style></style>

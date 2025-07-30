<template>
  <!-- DIVISION -->
  <div class="my-3" id="requests-view">
    <Loading v-if="showLoading" style="z-index: 9999" />
    <!-- Add User -->
    <b-modal
      size="md"
      header-class="mtopColor"
      id="bv-modal-addUsers"
      class="modal"
      no-close-on-backdrop
    >
      <template v-slot:modal-title>
        <h6>Add User</h6>
      </template>
      <b-card class="card-shadow">
        <b-form-group>
          <label style="font-size: 13px" class="mt-2">Firstname</label>
          <b-form-input
            id="action-desc"
            v-model="usersData.FirstName"
          ></b-form-input>
          <label style="font-size: 13px" class="mt-2">Middle Initial</label>
          <b-form-input
            id="action-desc"
            v-model="usersData.MiddleInitial"
          ></b-form-input>
          <label style="font-size: 13px" class="mt-2">Lastname</label>
          <b-form-input
            id="action-desc"
            v-model="usersData.LastName"
          ></b-form-input>
          <label style="font-size: 13px" class="mt-2">Department</label>
          <b-form-select id="select-module-act" v-model="selectedDepartment">
            <option
              v-for="(department, i) in departments"
              :key="i"
              :value="department.id"
            >
              {{ department.DepartmentDescription }}
            </option>
          </b-form-select>
          <label style="font-size: 13px" class="mt-2">Username</label>
          <b-form-input
            id="action-desc"
            v-model="usersData.UserName"
          ></b-form-input>
        </b-form-group>
      </b-card>

      <template v-slot:modal-footer>
        <b-button size="sm" @click="addUser()" class="primaryBtn mr-2"
          >Save</b-button
        >
        <b-button size="sm" @click="cancelAdd()" class="greyBtn mr-2"
          >Cancel</b-button
        >
      </template>
    </b-modal>
    <!-- End Add User  -->
    <!-- Edit User -->
    <b-modal
      size="md"
      header-class="mtopColor"
      id="bv-modal-editUsers"
      class="modal"
      @close="cancelReset"
      no-close-on-backdrop
    >
      <template v-slot:modal-title>
        <h6>Edit User</h6>
      </template>
      <b-card class="card-shadow">
        <b-form-group>
          <label style="font-size: 13px" class="mt-2">Firstname</label>
          <b-form-input
            id="action-desc"
            v-model="usersData.FirstName"
          ></b-form-input>
          <label style="font-size: 13px" class="mt-2">Middle Initial</label>
          <b-form-input
            id="action-desc"
            v-model="usersData.MiddleInitial"
          ></b-form-input>
          <label style="font-size: 13px" class="mt-2">Lastname</label>
          <b-form-input
            id="action-desc"
            v-model="usersData.LastName"
          ></b-form-input>
          <label style="font-size: 13px" class="mt-2">Department</label>
          <b-form-select id="select-module-act" v-model="selectedDepartment">
            <option disabled value="">Please select a menu</option>
            <option
              v-for="(department, i) in departments"
              :key="i"
              :value="department.id"
            >
              {{ department.DepartmentDescription }}
            </option>
          </b-form-select>
          <label style="font-size: 13px" class="mt-2">Username</label>
          <b-form-input
            id="action-desc"
            v-model="usersData.UserName"
          ></b-form-input>
        </b-form-group>
      </b-card>

      <template v-slot:modal-footer>
        <b-button size="sm" @click="editUser()" class="primaryBtn mr-2"
          >Save</b-button
        >
        <b-button size="sm" @click="cancelEdit()" class="greyBtn mr-2"
          >Cancel</b-button
        >
      </template>
    </b-modal>
    <!-- End Edit User  -->

    <!-- Reset modal -->
    <b-modal
      size="md"
      header-class="mtopColor"
      id="bv-modal-reset"
      class="modal"
      no-close-on-backdrop
    >
      <template #modal-title>
        <div style="display: flex; flex-direction: row; align-items: center">
          <i style="color: white" class="fas fa-exclamation-triangle"></i>
          <h4 style="margin-bottom: 3px">&nbsp;&nbsp;WARNING!</h4>
        </div>
      </template>
      <div>
        <h6>
          The employee's password and code will be reset, do you want to
          continue?
        </h6>
      </div>
      <template v-slot:modal-footer>
        <b-button
          id="add_pos"
          size="sm"
          variant="danger"
          style="font-size: 13px"
          class="redBtn"
          @click="resetPassword"
          >Yes</b-button
        >
        <b-button
          id="close_pos"
          class="greyBtn"
          size="sm"
          style="font-size: 13px"
          @click="cancelReset()"
          >No</b-button
        >
      </template>
    </b-modal>
    <!-- end reset modal -->
    <b-row>
      <b-col>
        <h5 class="ml-4" style="font-weight: bolder; font-family: font_B">
          <font-awesome-icon
            icon="circle-info"
            class="viewIcon mr-2"
            small
          />Users Information
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
                    v-model="filterUsers"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button
                      class="buttonClearSearch"
                      id="buttonClearSearch"
                      :disabled="!filterUsers"
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
                @click="$bvModal.show('bv-modal-addUsers')"
              >
                <font-awesome-icon icon="plus" class="icon" />Add New User
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
            :items="filteredUsers"
            :fields="fieldsUsers"
          >
            <template v-slot:cell(actions)="row">
              <button
                id="editAddress"
                class="editBtn"
                @click="editUserModal(row)"
                v-b-tooltip.noninteractive.hover
                title="Edit"
              >
                <font-awesome-icon
                  icon="pen-to-square"
                  class="viewIcon"
                  small
                />
              </button>
              <!-- <button
                id="deleteUser"
                class="deleteBtn"
                @click="deleteItem(row)"
                v-b-tooltip.noninteractive.hover
                title="Delete"
              >
                <font-awesome-icon icon="trash" class="viewIcon" small />
              </button> -->
              <button
                id="resetPass"
                class="resetBtn"
                @click="resetPass(row)"
                v-b-tooltip.noninteractive.hover
                title="Reset Password"
              >
                <font-awesome-icon
                  icon="rotate-right"
                  small
                  class="disapproveIcon"
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
import Loading from "@/components/LoadingOverlay/Loading";

export default {
  components: {
    Loading,
  },
  async created() {},
  middleware: "pageValidator",
  meta: {
    access: { right: "View Users" },
  },
  data() {
    return {
      filterUsers: "",
      isBusy: false,
      users: [],
      showLoading: false,
      currentPage: 1,
      perPage: 10,
      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },
      departments: [],
      selectedDepartment: null,
      usersData: {
        LastName: null,
        FirstName: null,
        Department: null,
        UserName: null,
        MiddleInitial: null,
        UserId: null,
      },
      fieldsUsers: [
        {
          key: "FullName",
          label: "FullName",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "LastName",
          label: "Last Name",
          sortable: true,
          sortDirection: "desc",
          class: "text-center",
        },
        {
          key: "FirstName",
          label: "First Name",
          sortable: true,
          sortDirection: "desc",
          class: "text-center",
        },
        {
          key: "UserCode",
          label: "Username",
          sortable: true,
          sortDirection: "desc",
          class: "text-center",
        },
        {
          key: "DepartmentDescription",
          label: "Department",
          sortable: true,
          sortDirection: "desc",
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
    await this.getUsers();
    await this.getDepartments();
  },
  computed: {
    filteredUsers() {
      if (this.filterUsers == null) {
        return this.fees;
      }
      const filterLowerCase = this.filterUsers.trim().toLowerCase();

      return this.users.filter((item) => {
        return (
          String(item.LastName).toLowerCase().includes(filterLowerCase) ||
          String(item.FirstName).toLowerCase().includes(filterLowerCase) ||
          String(item.DepartmentDescription)
            .toLowerCase()
            .includes(filterLowerCase) ||
          String(item.UserCode).toLowerCase().includes(filterLowerCase)
        );
      });
    },
    totalRows() {
      return this.filteredUsers.length;
    },
    bottomLabel() {
      let end = this.perPage * this.currentPage;
      let start = end - this.perPage + 1;

      if (end > this.filteredUsers.length) {
        end = this.filteredUsers.length;
      }
      if (this.filteredUsers.length === 0) {
        start = 0;
      }
      return `Showing ${start} to ${end} of ${this.filteredUsers.length} entries`;
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
    async getUsers() {
      this.showLoading = true;
      try {
        const res = await axios({
          method: "GET",
          url: `${this.$axios.defaults.baseURL}/admin/users/get-all`,
          headers: {
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "GET",
          },
        });
        this.users = res.data;
        this.showLoading = false;
      } catch (error) {
        this.showLoading = false;
        this.showAlert(error.response.data.error, "danger");
      }
    },
    async getDepartments() {
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
        this.departments = res.data;
      } catch (error) {
        this.isBusy = false;
        console.log(error);
      } finally {
        this.isBusy = false;
      }
    },
    async resetPassword() {
      try {
        this.showLoading = true;
        const res = await axios({
          method: "PUT",
          url: `${this.$axios.defaults.baseURL}/admin/users/to-reset-password/${this.usersData.UserId}`,
        });
        console.log(res);
        this.showLoading = false;
        await this.getUsers();
        this.cancelReset();
        this.showAlert(res.data.msg, "success");
      } catch (error) {
        this.showLoading = false;
        this.showAlert(error.response.data.error, "danger");
      }
    },
    resetPass(data) {
      this.usersData.UserId = data.item.UserId;
      console.log(this.usersData.UserId);
      this.$bvModal.show("bv-modal-reset");
    },
    cancelReset() {
      this.$bvModal.hide("bv-modal-reset");
    },

    async addUser() {
      try {
        this.showLoading = true;
        const res = await axios({
          method: "POST",
          url: `${this.$axios.defaults.baseURL}/admin/users/add`,
          data: {
            user_name: this.usersData.UserName,
            first_name: this.usersData.FirstName,
            last_name: this.usersData.LastName,
            middle_initial: this.usersData.MiddleInitial,
            department_id: this.selectedDepartment,
          },
        });
        this.showLoading = false;
        await this.getUsers();
        this.cancelAdd();
        this.resetFields();
        this.showAlert(res.data.msg, "success");
      } catch (error) {
        this.showLoading = false;
        this.showAlert(error.response.data.error, "danger");
      }
    },
    cancelAdd() {
      this.resetFields();
      this.$bvModal.hide("bv-modal-addUsers");
    },
    editUserModal(data) {
      this.usersData.FirstName = data.item.FirstName;
      this.usersData.MiddleInitial = data.item.MiddleInitial;
      this.usersData.LastName = data.item.LastName;
      this.selectedDepartment = data.item.DepartmentId;
      this.usersData.UserName = data.item.UserCode;
      this.usersData.UserId = data.item.UserId;
      this.$bvModal.show("bv-modal-editUsers");
    },
    cancelEdit() {
      this.resetFields();
      this.$bvModal.hide("bv-modal-editUsers");
    },
    async editUser() {
      try {
        this.showLoading = true;
        const res = await axios({
          method: "PUT",
          url: `${this.$axios.defaults.baseURL}/admin/users/update/${this.usersData.UserId}`,
          data: {
            user_name: this.usersData.UserName,
            first_name: this.usersData.FirstName,
            last_name: this.usersData.LastName,
            middle_initial: this.usersData.MiddleInitial,
            department_id: this.selectedDepartment,
          },
        });
        this.showLoading = false;
        await this.getUsers();
        this.cancelEdit();
        this.resetFields();
        this.showAlert(res.data.msg, "success");
      } catch (error) {
        this.showLoading = false;
        this.showAlert(error.response.data.error, "danger");
      }
    },

    resetFields() {
      (this.usersData = {
        LastName: null,
        FirstName: null,
        Department: null,
        UserName: null,
        MiddleInitial: null,
        UserId: null,
      }),
        (this.selectedDepartment = null);
      this.filterUsers = "";
    },
    clearSearch() {
      this.filterUsers = "";
    },
  },

  layout: "sidebar",
};
</script>

<style></style>

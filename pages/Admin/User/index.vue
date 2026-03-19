<template>
  <!-- DIVISION -->
  <div class="my-3" id="requests-view">
    <Loading v-if="showLoading" style="z-index: 9999" />
    <!-- Add User -->
    <b-modal
      size="md"
      header-class="assetColor"
      id="bv-modal-addUsers"
      class="modal"
      no-close-on-backdrop
    >
      <template v-slot:modal-title>
        <h6>Add User</h6>
      </template>
      <b-card class="card-shadow">
        <b-form-group>
          <label style="font-size: 13px" class="mt-2">Select Employee</label>
          <b-input-group>
            <b-form-input
              id="action-desc"
              v-model="selectedEmployee"
              placeholder="Click search to find employee"
              readonly
            ></b-form-input>
            <b-input-group-append>
              <b-button
                size="sm"
                variant="primary"
                @click="openEmployeeSearchModal"
                v-b-tooltip.hover
                title="Search Employee"
              >
                <font-awesome-icon icon="magnifying-glass" />
              </b-button>
            </b-input-group-append>
            </b-input-group>
             <label style="font-size: 13px" class="mt-2">Account</label>
          <b-form-select size="sm" id="select-account" v-model="selectedAccount">
            <option
              v-for="(account, i) in funcAccounts"
              :key="i"
              :value="account.Func_per_Office_ID"
            >
              {{ account.FuncOffice }}
            </option>
          </b-form-select>
           <label style="font-size: 13px" class="mt-2">Username</label>
          <b-form-input
            id="action-desc"
            v-model="usersData.Username"
          ></b-form-input>
          <label style="font-size: 13px" class="mt-2">Role</label>
          <b-form-select size="sm" id="select-module-act" v-model="selectedRole">
            <option
              v-for="(role, i) in roles"
              :key="i"
              :value="role.role_id"
            >
              {{ role.role_desc }}
            </option>
          </b-form-select>
         
          
        </b-form-group>
      </b-card>

      <template v-slot:modal-footer>
        <b-button size="sm" @click="cancelAdd()" class="greyBtn mr-2"
          >Cancel</b-button
        >
         <b-button size="sm" @click="addUser()" class="primaryBtn mr-2"
          >Save</b-button
        >
      </template>
    </b-modal>
    <!-- End Add User  -->
    <!-- Edit User -->
    <b-modal
      size="md"
      header-class="assetColor"
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
          <label style="font-size: 13px" class="mt-2">Select Employee</label>
          <b-input-group>
            <b-form-input
              id="action-desc"
              v-model="selectedEmployee"
              placeholder="Click search to find employee"
              readonly
            ></b-form-input>
            <b-input-group-append>
              <b-button
                size="sm"
                variant="primary"
                @click="openEmployeeSearchModal"
                v-b-tooltip.hover
                title="Search Employee"
              >
                <font-awesome-icon icon="magnifying-glass" />
              </b-button>
            </b-input-group-append>
            </b-input-group>
             <label style="font-size: 13px" class="mt-2">Account</label>
          <b-form-select size="sm" id="select-account" v-model="selectedAccount">
            <option
              v-for="(account, i) in funcAccounts"
              :key="i"
              :value="account.Func_per_Office_ID"
            >
              {{ account.FuncOffice }}
            </option>
          </b-form-select>
           <label style="font-size: 13px" class="mt-2">Username</label>
          <b-form-input
            id="action-desc"
            v-model="usersData.Username"
          ></b-form-input>
          <label style="font-size: 13px" class="mt-2">Role</label>
          <b-form-select size="sm" id="select-module-act" v-model="selectedRole">
            <option disabled value="">Please select a menu</option>
             <option
              v-for="(role, i) in roles"
              :key="i"
              :value="role.role_id"
            >
              {{ role.role_desc }}
            </option>
          </b-form-select>
          
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
      header-class="assetColor"
      id="bv-modal-reset"
      class="modal"
      no-close-on-backdrop
    >
      <template #modal-title>
        <div style="display: flex; flex-direction: row; align-items: center">
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
          id="close_pos"
          class="greyBtn"
          size="sm"
          style="font-size: 13px"
          @click="cancelReset()"
          >No</b-button
        >
        <b-button
          id="add_pos"
          size="sm"
          variant="danger"
          style="font-size: 13px"
          class="redBtn"
          @click="resetPassword"
          >Yes</b-button
        >
      </template>
    </b-modal>
    <!-- end reset modal -->
    
    <!-- Employee Search Modal -->
    <b-modal
      size="lg"
      header-class="assetColor"
      id="bv-modal-employee-search"
      class="modal"
      no-close-on-backdrop
    >
      <template v-slot:modal-title>
        <h6>Search Employee</h6>
      </template>
      <b-card class="card-shadow">
        <b-form-group class="mb-3" label-size="sm" label="Search Employee">
          <b-input-group>
            <b-form-input
              type="search"
              v-model="employeeSearch"
              placeholder="Type employee name, username, or ID..."
              @input="searchEmployees"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
        
        <b-table
          head-variant="light"
          class="tableAsset mt-2"
          style="font-size: 12px"
          show-empty
          small
          :current-page="currentPageEmployees"
          :per-page="perPageEmployees"
          :busy="isEmployeeBusy"
          :items="filteredEmployees"
          :fields="employeeFields"
          @row-clicked="onEmployeeRowClicked"
        >
          <template #table-busy>
            <div class="text-center text-secondary my-2">
              <b-spinner class="align-middle"></b-spinner>
            </div>
          </template>
          <template v-slot:empty>
            <div class="text-center text-muted my-3">
              <font-awesome-icon icon="search" class="mr-2" />
              No employees found
            </div>
          </template>
        </b-table>
        
        <!-- Pagination for employee results -->
        <b-pagination
          v-if="filteredEmployees.length > perPageEmployees"
          v-model="currentPageEmployees"
          :total-rows="filteredEmployees.length"
          :per-page="perPageEmployees"
          pills
          align="center"
          size="sm"
          class="mt-3"
        ></b-pagination>
      </b-card>
      
      <template v-slot:modal-footer>
        <div>
          <b-button
            size="sm"
            class="greyBtn mr-2"
            @click="closeEmployeeModal"
            >Cancel</b-button
          >
        </div>
      </template>
    </b-modal>
    <!-- end employee search modal -->

    <b-row>
      <b-col>
         <nav class="breadcrumb-container ml-4">
          <a href="#" class="breadcrumb-link">Home</a>
          <span class="breadcrumb-separator">▶</span>
          <span class="breadcrumb-current">Users</span>
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
                    v-model="filterUsers"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button
                      size="sm"
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
                class="defaultBtn"
                size="sm"
                v-b-tooltip.hover
                title="Add new User"
                @click="$bvModal.show('bv-modal-addUsers')"
              >
                <font-awesome-icon icon="circle-plus" class="icon" />
                Add New User
              </b-button>
            </b-col>
          </b-row>
          <b-table
            head-variant="light"
            class="tableAsset mt-4"
            style="font-size: 12px"
            show-empty
            small
            :current-page="currentPage"
            :per-page="perPage"
            :busy.sync="isBusy"
            :items="filteredUsers"
            :fields="fieldsUsers"
          >
            <template v-slot:cell(actions)="row">
              <b-dropdown class="dropdownBtn" right variant="link" no-caret>
                <template #button-content>
                  <font-awesome-icon icon="bars" />
                </template>
                <b-dropdown-header class="dropdown-header">Actions</b-dropdown-header>
                <b-dropdown-item-button @click="editUserModal(row)">
                  <font-awesome-icon icon="pen-to-square" class="viewIcon mr-2" small />Edit User
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="resetPass(row)">
                  <font-awesome-icon icon="rotate-right" class="viewIcon mr-2" small />Reset Password
                </b-dropdown-item-button>
              </b-dropdown>
            </template>
            <template v-slot:cell(IsActive)="row">
              <b-form-checkbox 
                :checked="row.item.IsActive" 
                disabled
                size="sm"
              ></b-form-checkbox>
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
      roles: [],
      selectedRole: null,
      funcAccounts: [],
      selectedAccount: null,
      usersData: {
        Fullname: null,
        Username: null,
        FirstName: null,
        LastName: null,
        MiddleName: null,
        func_per_office_id: null,
        office_id: null,
        deparment_name: null,
        user_id: null,
        employee_id: null,
      },
      // Employee search modal data
      employeeSearch: "",
      employeeResults: [],
      isEmployeeBusy: false,
      selectedEmployee: null,
      currentPageEmployees: 1,
      perPageEmployees: 10,
      employeeFields: [
        {
          key: "AccountName",
          label: "Account Name",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "DeptDesc",
          label: "Department",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
      ],
      fieldsUsers: [
        {
          key: "AccountName",
          label: "FullName",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "Username",
          label: "Username",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "Role",
          label: "Role",
          sortable: true,
          sortDirection: "desc",
          class: "text-center",
        },
        {
          key: "OfficeName",
          label: "Office",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "IsActive",
          label: "Active",
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
    await this.getRoles();
    await this.getAccounts();
  },
  computed: {
    filteredUsers() {
      if (this.filterUsers == null) {
        return this.fees;
      }
      const filterLowerCase = this.filterUsers.trim().toLowerCase();

      return this.users.filter((item) => {
        return (
          String(item.AccountName).toLowerCase().includes(filterLowerCase) ||
          String(item.Username).toLowerCase().includes(filterLowerCase) ||
          String(item.OfficeName)
            .toLowerCase()
            .includes(filterLowerCase) ||
          String(item.Role).toLowerCase().includes(filterLowerCase)
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
    filteredEmployees() {
      if (!this.employeeSearch.trim()) {
        return this.employeeResults;
      }
      const filterLowerCase = this.employeeSearch.trim().toLowerCase();
      return this.employeeResults.filter((employee) => {
        return (
          String(employee.AccountName).toLowerCase().includes(filterLowerCase) ||
          String(employee.DeptDesc).toLowerCase().includes(filterLowerCase) ||
          String(employee.FuncOffice).toLowerCase().includes(filterLowerCase)
        );
      });
    },
    selectedAccount() {
      const selectedAccountObj = this.funcAccounts.find(account => account.Func_per_Office_ID === this.selectedAccount);
      return selectedAccountObj ? selectedAccountObj.Office_ID : this.selectedAccount;
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
          url: `${this.$axios.defaults.baseURL}/admin/user-accounts/get-all?text=${this.filter || ''}&is_active=1`,
          headers: {
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "GET",
          },
        });
        this.users = res.data;
        console.log(res.data)
        this.showLoading = false;
      } catch (error) {
        this.showLoading = false;
        this.showAlert(error.response.data.error, "danger");
      }
    },
    async getRoles() {
      this.isBusy = true;
      try {
        const res = await axios({
          method: "GET",
          url: `${this.$axios.defaults.baseURL}/admin/roles/get-all`,
          headers: {
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "GET",
          },
        });
        this.roles = res.data;
      } catch (error) {
        this.isBusy = false;
        console.log(error);
      } finally {
        this.isBusy = false;
      }
    },
    async getAccounts() {
      this.isBusy = true;
      try {
        const res = await axios({
          method: "GET",
          url: `${this.$axios.defaults.baseURL}/admin/BOS/get-func-offices`,
          headers: {
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "GET",
          },
        });
        console.log(res.data, "ACCOUNTS");
        this.funcAccounts =  res.data;
      } catch (error) {
        this.isBusy = false;
        console.error("Failed to get accounts", error);
        this.showAlert("Failed to load accounts", "danger");
        return [];
      } finally {
        this.isBusy = false;
      }
    },
    resetPass(data) {
      this.usersData.UserId = data.item.UserId;
      console.log(this.usersData.UserId);
      this.$bvModal.show("bv-modal-reset");
    },
    async resetPassword() {
      try {
        this.showLoading = true;
        const res = await axios({
          method: "PUT",
          url: `${this.$axios.defaults.baseURL}/admin/user-accounts/to-reset-password/${this.usersData.UserId}`,
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
      this.resetFields();
      this.$bvModal.hide("bv-modal-reset");
    },

    async addUser() {
      try {
        this.showLoading = true;
        const res = await axios({
          method: "POST",
          url: `${this.$axios.defaults.baseURL}/admin/user-accounts/insert`,
          data: {
            Username: this.usersData.Username,
            role_id: this.selectedRole,
            func_per_office_id: this.selectedAccount,
            office_id: this.selectedAccountOffice,
            EmpId: this.usersData.employee_id || 0,
            user_id: '12'
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
      console.log(data)
      // Populate fields with existing user data
      this.selectedEmployee = data.item.AccountName || data.item.Fullname;
      this.usersData.Username = data.item.Username || data.item.UserCode;
      this.selectedRole = data.item.RoleId ;
      this.selectedAccount = parseInt(data.item.FuncPerOfficeId);
      this.usersData.FirstName = data.item.FirstName || data.item.first_name;
      this.usersData.LastName = data.item.LastName || data.item.last_name;
      this.usersData.MiddleName = data.item.MiddleName || data.item.middle_initial;
      this.usersData.UserId = data.item.UserId;
      this.usersData.employee_id = data.item.empid;
      
      // Set office_id from selected account
      const selectedAccountObj = this.funcAccounts.find(account => account.Func_per_Office_ID === this.selectedAccount);
      this.usersData.office_id = selectedAccountObj ? selectedAccountObj.Office_ID : this.selectedAccount;
      
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
          url: `${this.$axios.defaults.baseURL}/admin/user-accounts/update/${this.usersData.UserId}`,
          data: {
            Username: this.usersData.Username,
            Firstname: this.usersData.FirstName,
            Lastname: this.usersData.LastName,
            Middlename: this.usersData.MiddleName,
            AccountName: this.selectedEmployee,
            role_id: this.selectedRole,
            func_per_office_id: this.selectedAccount,
            office_id: this.usersData.office_id,
            empid: this.usersData.employee_id || 0,
            user_id: this.usersData.UserId
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
        Fullname: null,
        Username: null,
        FirstName: null,
        LastName: null,
        MiddleName: null,
        func_per_office_id: null,
        office_id: null,
        deparment_name: null,
        user_id: null,
        employee_id: null,
      }),
        (this.selectedRole = null);
        (this.selectedAccount = null);
      this.filterUsers = "";
    },
    clearSearch() {
      this.filterUsers = "";
    },
    async openEmployeeSearchModal() {
      this.employeeSearch = "";
      this.employeeResults = [];
      this.selectedEmployee = null;
      this.currentPageEmployees = 1; // Reset pagination
      await this.searchEmployees();
      this.$bvModal.show('bv-modal-employee-search');
    },
    closeEmployeeModal() {
      this.$bvModal.hide('bv-modal-employee-search');
    },
    async searchEmployees() {
      this.isEmployeeBusy = true;
      try {
        const res = await axios({
          method: "GET",
          url: `${this.$axios.defaults.baseURL}/admin/HRMS/get-employees?IsAssigned=1&IsAll=0&text=${this.employeeSearch}`,
          headers: {
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "GET",
          },
        });
        console.log(res.data,"EMP")
        this.employeeResults = res.data;
      } catch (error) {
        console.error("Failed to search employees", error);
        this.showAlert("Failed to load employees", "danger");
      } finally {
        this.isEmployeeBusy = false;
      }
    },
    onEmployeeRowClicked(employee) {
      
      this.closeEmployeeModal();
      this.selectedEmployee = employee.AccountName;
      
      // Extract name components from AccountName
      const nameParts = employee.AccountName.split(' ');
      this.usersData.FirstName = nameParts[0] || '';
      this.usersData.LastName = nameParts[nameParts.length - 1] || '';
      this.usersData.MiddleName = nameParts.length > 2 ? nameParts[1] : '';
      
      this.usersData.employee_id = employee.EmpId;
      
      // Find the selected account object to get Office_ID
      const selectedAccountObj = this.funcAccounts.find(account => account.Func_per_Office_ID === this.selectedAccount);
      this.usersData.office_id = selectedAccountObj ? selectedAccountObj.Office_ID : this.selectedAccount; 
      this.usersData.func_per_office_id = this.selectedAccount;
    },

  },

  layout: "sidebar",
};
</script>

<style></style>

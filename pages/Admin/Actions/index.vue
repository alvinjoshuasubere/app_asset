<template>
  <!-- DIVISION -->
  <div class="my-3" id="requests-view">
    <h4 class="color1 ml-4">
      <font-awesome-icon icon="tasks" class="icon" />Actions
    </h4>

    <!-- <div class="mainContent">
      <div class="tableContainer">
        <b-modal
          header-bg-variant="success"
          header-text-variant="light"
          id="Action"
          v-model="Action"
          hide-header-close
          title="Update Action"
        >
          <b-container fluid>
            <b-form-group
              id="Action"
              label="Action Name:"
              label-for="input-2"
              style="font-size: 13px"
            >
              <b-form-input
                style="font-size: 13px"
                id="update_Action"
                v-model="ActionNameInputForUpdate"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="addmodule"
              label="Module Name:"
              label-for="input-2"
              style="font-size: 13px"
            >
              <b-form-select
                style="font-size: 13px"
                id="moduleSelect"
                v-model="selectedUpdate"
                :options="ModuleNameSelect"
                required
              ></b-form-select>
            </b-form-group>

            <b-form-checkbox
              id="checkbox"
              v-model="checked"
              name="check-button"
              switch
            >
              <b style="font-size: 13px">{{
                checked ? "Active" : "Inactive"
              }}</b>
            </b-form-checkbox>
          </b-container>

          <template v-slot:modal-footer>
            <div>
            <b-button size="sm" id="btnUpdateModal" variant="success" class="mr-2 greenBtn" @click="updateAction">
              Save
            </b-button>
            <b-button size="sm" id="btnCloseModal" @click="closeModal" class="greyBtn">
              Close
            </b-button>
            </div>
          </template>

          <b-alert
            :show="dismissCountDownErrs"
            dismissible
            fade
            class="err fixed"
            @dismiss-count-down="countDownChangedErrs"
            >{{ errorMsg }}</b-alert
          >
        </b-modal>

        <b-form-group class="searchbar">
          <b-input-group size="sm">
            <b-form-input
              style="font-size: 13px"
              v-model="filter"
              type="search"
              id="filterInput"
              class="searchbar no-outline"
              placeholder="Type to Search"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                id="clearSearchInput"
                :disabled="!filter"
                @click="filter = ''"
                >Clear</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <b-table
          id="table"
          class="my-1"
          style="font-size: 13px"
          show-empty
          small
          fixed
          scrollable
          selectable
          select-mode="single"
          ref="selectableTable"
          stacked="md"
          :items="items"
          :busy="isbusy"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :filterIncludedFields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          @filtered="onFiltered"
        >
          <template #table-busy>
            <div class="text-center text-secondary my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>&nbsp;Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(Actions)="row">
            <button
              id="createDRm"
              class="editBtn"
              @click="openModal(row)"
              v-b-tooltip.noninteractive.hover
              title="Edit Action"
            >
              <font-awesome-icon icon="edit" class="editIcon" small />
            </button>
          </template>
          <template v-slot:table-caption>
            <b-row align-h="end">
              <b-col cols="6">{{ bottomLabel }}</b-col>

              <b-col cols="6">
                <b-pagination
                  id="pagination"
                  pills
                  v-model="currentPage"
                  :total-rows="totalRows"
                  :per-page="perPage"
                  align="right"
                  size="sm"
                ></b-pagination>
              </b-col>
            </b-row>
          </template>
        </b-table>
        <b-col></b-col>

        PAGINATION
        <b-col sm="7" md="3" class="mr-0">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
          ></b-pagination>
        </b-col>
       
      </div>
      <div class="addingContainer">
        <b-card-text>
          <h5 class="color1">ADD NEW ACTION</h5>
        </b-card-text>
        <hr />
        <b-form-group
          id="addaction"
          label="Action Name:"
          label-for="input-2"
          style="font-size: 13px"
        >
          <b-form-input
            style="font-size: 13px"
            id="actionInput"
            v-model="ActionNameInput"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="addmodule"
          label="Module Name:"
          label-for="input-2"
          style="font-size: 13px"
        >
          <b-form-select
            style="font-size: 13px"
            id="moduleSelect"
            v-model="selected"
            :options="ModuleNameSelect"
            required
          ></b-form-select>
        </b-form-group>
        <div class="btnContainer">
          <b-button
            id="addAction"
            @click="addAction"
            variant="success"
            :disabled="isbusy"
            class="greenBtn mr-2"
            style="font-size: 13px"
          >
            Add
          </b-button>
          <button
            id="clearAction"
            @click="clearAction()"
            class="greyBtn"
            style="font-size: 13px"
          >
            Clear
          </button>
        </div>
      </div>

      <b-alert
        :show="dismissCountDown"
        dismissible
        fade
        class="button1 fixed"
        @dismiss-count-down="countDownChanged"
        >{{ successMsg }}</b-alert
      >
      <b-alert
        :show="dismissCountDownErr"
        dismissible
        fade
        class="err fixed"
        @dismiss-count-down="countDownChangedErr"
        >{{ errorMsg }}</b-alert
      >
    </div>
    <br /> -->
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  components: {
    // Loading
  },
  async created() {
    // this.notif = localStorage.notiCounter != 0 ? localStorage.notiCounter : ''
    // await Promise.all([
    //   this.connectSocket(),
    //   this.getActions(),
    //   this.getModules(),
    // ])
    // this.totalRows = this.items.length;
    // this.isbusy = false;
  },
  // middleware: "pageValidator",
  // meta: {
  //   access: { right: "view actions" }
  // },
  head() {
    // return {
    //   title: this.notif == 0 || this.notif == null ? "Admin | Actions - TSIS": '('+this.notif+')'+' Admin | Actions - TSIS',
    //   meta: [
    //     {
    //       hid: "description",
    //       name: "description",
    //       content: "Truck Scale Integrated System"
    //     }
    //   ]
    // };
  },
  data() {
    return {
      showLoading: false,
      isbusy: true,
      //Switch
      checked: true,
      //Modal Action
      Action: false,
      //Table
      perPage: 12,
      totalRows: 1,
      currentPage: 1,
      dismissSecs: 3,
      dismissCountDown: 0,
      showDismissibleAlert: false,
      editModal: false,
      indexForUpdate: null,
      ActionNameInput: "",
      ActionNameInputForUpdate: "",
      selected: "",
      selectedUpdate: null,
      ModuleNameSelect: [],
      dataTest: null,
      items: [],
      //TABLE HEADER
      fields: [
        { key: "ActionName", label: "Action Name", sortable: true },
        { key: "ModuleName", label: "Module Name", sortable: true },
        { key: "status", label: "Status", sortable: true },
        { key: "createdBy", label: "Created By", sortable: true },
        { key: "createdAt", label: "Date Created", sortable: true },
        { key: "Actions", label: "Actions", class: "text-center" }
      ],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      successMsg: null,
      errorMsg: null,
      dismissCountDownErrs: 0,
      dismissCountDownErr: 0
    };
  },
  computed: {
    // bottomLabel() {
    //   let end = this.perPage * this.currentPage;
    //   let start = end - this.perPage + 1;

    //   if (end > this.items.length) {
    //     end = this.items.length;
    //   }

    //   if (this.items.length === 0) {
    //     start = 0;
    //   }

    //   return `Showing ${start} to ${end} of ${this.items.length} entries`;
    // },

    // sortOptions() {
    //   // Create an options list from our fields
    //   return this.fields
    //     .filter(f => f.sortable)
    //     .map(f => {
    //       return { text: f.label, value: f.key };
    //     });
    // }
  },
  mounted() {
    // Set the initial number of items
    // this.totalRows = this.items.length;
  },
  methods: {
    // async connectSocket(){
    //   try {
    //     this.socket = io.connect(process.env.socketUrl, { secure: true }); //connect to the server
    //     const id = localStorage.id //get current user's id
    //     this.socket.on(`new req - ${id}`, data => { //listen to new notification
    //       this.socket.emit(`my notif`, { id }); //you emit this to get notifications, by triggering this, you request the list of notification from the server
    //     })
    //     this.socket.on(`request`, data => { //listen for updates
    //       this.socket.emit(`my notif`, { id });
    //     })
    //     await this.socket.on(`my req - ${id}`, data => { //get notification for this user
    //       let unread = data.notifs.filter(notif => notif.is_read == false)//filter only the unread notifs
    //       this.notif = unread.length //set the notif number to the number of unread notifs
    //     })
    //   } catch (e) {
    //     console.log("~ file: index.vue ~ line 51 ~ connectSocket ~ e", e)
    //   }
    // },
    // // convert to pascal case
    // convertCase(str) {
    //   if (str) {
    //     const splitStr = str.toLowerCase().split(" ");
    //     for (let i = 0; i < splitStr.length; i++) {
    //       splitStr[i] =
    //         splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    //     }
    //     return splitStr.join(" ");
    //   } else {
    //     return str;
    //   }
    // },
    // onFiltered(filteredItems) {
    //   this.totalRows = filteredItems.length;
    //   this.currentPage = 1;
    // },

    // countDownChanged(dismissCountDown) {
    //   this.dismissCountDown = dismissCountDown;
    // },
    // showAlert() {
    //   this.dismissCountDown = this.dismissSecs;
    // },
    // countDownChangedErr(dismissCountDown) {
    //   this.dismissCountDownErr = dismissCountDown;
    // },
    // showAlertErr() {
    //   this.dismissCountDownErr = this.dismissSecs;
    // },
    // // modal update
    // countDownChangedErrs(dismissCountDown) {
    //   this.dismissCountDownErrs = dismissCountDown;
    // },
    // showAlertErrs() {
    //   this.dismissCountDownErrs = this.dismissSecs;
    // },
    // async getModules() {
    //   try {
    //     // this.showLoading = true;
    //     this.isbusy = true;
    //     if (localStorage.mode == 1) {
    //       const res = await axios({
    //         method: "POST",
    //         url: `${this.$axios.defaults.baseURL}/modules/select`,
    //         headers: {
    //           "Content-Type": "application/json",
    //           "X-HTTP-Method-Override": "GET",
    //           authorization: `B1SESSION=${localStorage.session}`
    //         },
    //         data: {
    //           mode: localStorage.mode,
    //           modules: JSON.parse(localStorage.modules)
    //         }
    //       });

    //       this.showLoading = false;
    //       this.isbusy = false;

    //       const data = res.data.view;
    //       for (let i = 0; i < data.length; i++) {
    //         const e = data[i];
    //         if (e.U_TS_STATUS.toLowerCase() === "active") {
    //           this.ModuleNameSelect.push({
    //             value: e.Code,
    //             text: this.convertCase(e.U_TS_DESC)
    //           });
    //         }
    //       }
    //     } else {
    //       await axios({
    //         method: "GET",
    //         url: `${this.$axios.defaults.baseURL}/Modules/select`,
    //         headers: {
    //           authorization: "Bearer " + localStorage.token
    //         }
    //       })
    //         .then(res => {
    //           for (let i = 0; i < res.data.view.length; i++) {
    //             if (res.data.view[i].status === "active") {
    //               this.ModuleNameSelect.push({
    //                 value: res.data.view[i].id,
    //                 text: res.data.view[i].description
    //               });
    //             }
    //           }
    //         })
    //         .catch(error => {
    //           console.log(error);
    //         });
    //     }
    //   } catch (e) {
    //     this.showLoading = false;
    //     this.isbusy = false;
    //     console.log("Error select all modules: ", e);
    //   }
    // },
    // intToTime(i) {
    //   const str = i.toString();
    //   const len = str.length;

    //   let time = null;

    //   if (len == 4) {
    //     const hour = str.substring(0, 2);
    //     const min = str.substring(2, 4);
    //     time = `${hour}:${min}`;
    //     return time;
    //   } else if (len == 3) {
    //     const hour = str.substring(0, 1);
    //     const min = str.substring(1, 3);
    //     time = `0${hour}:${min}`;
    //     return time;
    //   } else {
    //     return `00:00`;
    //   }
    // },
    // async getActions() {
    //   this.items = [];
    //   // this.showLoading = true;
    //   this.isbusy = true;
    //   try {
    //     if (localStorage.mode == 1) {
    //       // online
    //       const res = await axios({
    //         method: "POST",
    //         url: `${this.$axios.defaults.baseURL}/actions/select`,
    //         headers: {
    //           "Content-Type": "application/json",
    //           "X-HTTP-Method-Override": "GET",
    //           authorization: `B1SESSION=${localStorage.session}`
    //         },
    //         data: {
    //           mode: localStorage.mode,
    //           modules: JSON.parse(localStorage.modules)
    //         }
    //       });

    //       // hide loader
    //       this.showLoading = false;
    //       this.isbusy = false;

    //       const data = res.data.view;

    //       for await (let i of data) {
    //         const date = moment(`${i.ACTIONCREATEDATE}`).format("MM-DD-YYYY");
    //         const time = this.intToTime(i.ACTIONCREATETIME);
    //         const dateTime = `${date} ${time}`;

    //         this.items.push({
    //           id: i.ACTIONCODE,
    //           ActionName: this.convertCase(i.ACTIONDESCRIPTION),
    //           ModuleName: this.convertCase(i.MODULEDESCRIPTION),
    //           moduleId: i.MODULECODE,
    //           status: this.convertCase(i.ACTIONSTATUS),
    //           createdBy: this.convertCase(`${i.firstName} ${i.lastName}`),
    //           createdAt: moment(dateTime).format("MMM DD, YYYY hh:mm A")
    //         });
    //       }
    //     } else {
    //       // offline
    //       await axios({
    //         method: "GET",
    //         url: `${this.$axios.defaults.baseURL}/Actions/select`,
    //         headers: {
    //           authorization: "Bearer " + localStorage.token
    //         }
    //       })
    //         .then(res => {
    //           for (let i = 0; i < res.data.view.length; i++) {
    //             //  if (res.data.view[i].module[0].modules_status === 'inactive' && res.data.view[i].status === 'inactive'){
    //             this.items.push({
    //               id: res.data.view[i].id,
    //               ActionName: res.data.view[i].description,
    //               ModuleName: res.data.view[i].module[0].descriptions,
    //               moduleId: res.data.view[i].module[0].modules_id,
    //               status: res.data.view[i].status,
    //               createdBy: `${res.data.view[i].created_by[0].firstname} ${res.data.view[i].created_by[0].middlename} ${res.data.view[i].created_by[0].lastname}`,
    //               createdAt: moment(
    //                 res.data.view[i].created_by[0].created_at
    //               ).format("MM-DD-YYYY hh:mm ")
    //             });
    //           }
    //         })
    //         .catch(error => {
    //           console.log(error);
    //         });
    //     }
    //   } catch (e) {
    //     this.showLoading = false;
    //     this.isbusy = false;
    //     console.log("Error select all actions: ", e);
    //   }
    // },
    // async updateAction() {
    //   try {
    //     if (localStorage.mode == 1) {
    //       this.isbusy = true;
    //       this.showLoading = true;

    //       const state = this.checked ? "active" : "inactive";
    //       const d = new Date().toDateString();
    //       const t = new Date().toTimeString();
    //       const date = moment(d).format("YYYY-MM-DD");
    //       const time = await this.fixTime(t);

    //       const res = await axios({
    //         method: "PUT",
    //         url: `${this.$axios.defaults.baseURL}/actions/update/${this.indexForUpdate}`,
    //         data: {
    //           U_TS_STATUS: state,
    //           U_TS_MODIFYBY: localStorage.id,
    //           U_TS_DESC: this.ActionNameInputForUpdate,
    //           U_TS_MOD_ID: this.selectedUpdate,
    //           U_TS_UPDATEDATE: date,
    //           U_TS_UPDATETIME: time,
    //           mode: localStorage.mode,
    //           modules: JSON.parse(localStorage.modules)
    //         },
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `B1SESSION=${localStorage.session}`
    //         }
    //       });
    //       this.showLoading = false;

    //       const status = res.data.patched.status;
    //       if (status == 204) {
    //         // success
    //         this.closeModal();
    //         this.getActions();
    //         this.successMsg = "Updated successfully.";
    //         this.showAlert();
    //       }
    //     } else {
    //       const status = this.checked ? "active" : "inactive";

    //       const res = await axios({
    //         method: "PUT",
    //         url: `${this.$axios.defaults.baseURL}/actions/update/${this.indexForUpdate}`,
    //         data: {
    //           status: status,
    //           modified_by: localStorage.id,
    //           description: this.ActionNameInputForUpdate,
    //           module_id: this.selectedUpdate
    //         },
    //         headers: {
    //           authorization: "Bearer " + localStorage.token
    //         }
    //       });
    //       this.getActions();
    //       this.closeModal();
    //       this.successMsg = res.data.patched.msg;
    //       this.showAlert();
    //         this.isbusy = false;
    //     }
    //   } catch (e) {
    //     if (localStorage.mode == 1) {
    //       this.showLoading = false;
    //       try {
    //         // JSON error
    //         const err = JSON.parse(e.response.data.error);
    //         this.errorMsg = err.msg;
    //         this.showAlertErr();
    //       } catch (er) {
    //         // not JSON
    //         this.errorMsg = e.response.data.error;
    //         this.showAlertErr();
    //       }
    //     } else {
    //       console.log("Error: ", e);
    //       this.errorMsg = e.response.data.error;
    //       this.showAlertErr();
    //     }
    //   }
    // },
    // // get integer from time
    // async fixTime(t) {
    //   try {
    //     const arr = t.split(":", 2);
    //     const raw = `${arr[0]}${arr[1]}`;
    //     const time = raw;
    //     return time;
    //   } catch (e) {
    //     console.log("Error: ", e);
    //   }
    // },
    // openModal(row) {
    //   this.$refs.selectableTable.selectRow(row.index)
    //   if (row.item.status.toLowerCase() === "active") {
    //     this.checked = true;
    //   } else {
    //     this.checked = false;
    //   }
    //   this.indexForUpdate = row.item.id;
    //   this.ActionNameInputForUpdate = row.item.ActionName;

    //   this.selectedUpdate = row.item.moduleId;

    //   this.Action = true;
    // },
    // closeModal() {
    //   // this.isbusy = true;
    //   this.ActionNameInputForUpdate = null;
    //   this.indexForUpdate = null;
    //   this.selectedUpdate = null;
    //   this.Action = false;
    //   // this.isbusy = true;
    // },

    // async addAction() {
    //   try {
    //     if (localStorage.mode == 1) {
    //       this.showLoading = true;
    //       this.isbusy = true;

    //       const d = new Date().toDateString();
    //       const t = new Date().toTimeString();
    //       const date = moment(d).format("YYYY-MM-DD");
    //       const time = await this.fixTime(t);

    //       const res = await axios({
    //         method: "POST",
    //         url: `${this.$axios.defaults.baseURL}/actions/add`,
    //         data: {
    //           U_TS_CREATEDBY: localStorage.id,
    //           U_TS_MODIFYBY: localStorage.id,
    //           U_TS_DESC: this.ActionNameInput,
    //           U_TS_MOD_ID: this.selected,
    //           U_TS_CREATEDATE: date,
    //           U_TS_CREATETIME: time,
    //           U_TS_UPDATEDATE: date,
    //           U_TS_UPDATETIME: time,
    //           mode: localStorage.mode,
    //           U_TS_STATUS: "active",
    //           modules: JSON.parse(localStorage.modules)
    //         },
    //         headers: {
    //           authorization: `B1SESSION=${localStorage.session}`
    //         }
    //       });
    //       this.showLoading = false;
    //       this.isbusy = false;

    //       const status = res.data.posted.status;
    //       if (status == 201) {
    //         // success
    //         this.ActionNameInput = "";
    //         this.selected = "";
    //         this.successMsg = "Action added successfully.";
    //         this.getActions();
    //         this.showAlert();
    //       }
    //     } else {
    //       const res = await axios({
    //         method: "POST",
    //         url: `${this.$axios.defaults.baseURL}/actions/add`,
    //         data: {
    //           created_by: localStorage.id,
    //           description: this.ActionNameInput,
    //           module_id: this.selected
    //         },
    //         headers: {
    //           authorization: "Bearer " + localStorage.token
    //         }
    //       });

    //       this.ActionNameInput = "";
    //       this.selected = "";
    //       this.successMsg = res.data.posted.msg;
    //       this.getActions();
    //       this.showAlert();
    //     }
    //   } catch (e) {
    //     if (localStorage.mode == 1) {
    //       this.showLoading = false;
    //       this.isbusy = false;
    //       try {
    //         // JSON error
    //         const err = JSON.parse(e.response.data.error);
    //         this.errorMsg = err.msg;
    //         this.showAlertErr();
    //       } catch (er) {
    //         // not JSON
    //         this.errorMsg = e.response.data.error;
    //         this.showAlertErr();
    //       }
    //     } else {
    //       this.errorMsg = e.response.data.error;
    //       console.log("Error: ", e);
    //       this.showAlertErr();
    //     }
    //   }
    // },
    // clearAction() {
    //   this.ActionNameInput = "";
    //   this.selected = null;
    // }
  },

  layout: "sidebar"
};
</script>

<style>
.button1 {
  background-color: #00803e;
  color: white;
}
.err {
  background-color: #f12d2d;
  color: white;
}
.color1 {
  color: #00803e;
}
.icon {
  margin-left: 0%;
  margin-right: 1%;
}
.fixed {
  position: fixed;
  bottom: 0%;
  right: 2%;
  z-index: 99999;
}
.page-item.active .page-link {
  background-color: #00a651 !important;
  border-color: #00a651 !important;
  transition: background-color 0.3s;
}
.page-item .page-link {
  color: black;
}
#filterInput {
  height: 31px;
}
</style>

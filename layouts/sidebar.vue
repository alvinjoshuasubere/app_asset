<template>
  <div class="wrapper">
    <nav id="sidebar">
      <div class="sidebar-header">
        <div>
          <b-img
            src="/AIMS.png"
            class="bfiImage"
            style="width: 80%; height: auto"
            center
          ></b-img>
          <b-img
            src="/aims_logo.png"
            class="cityIcon"
            style="width: 100%; height: 100%; display: none"
            center
          ></b-img>
        </div>
        <hr class="hr" />

        <ul class="list-unstyled">
          <li>
            <a
              id="sb-admin"
              v-b-toggle.collapse-1
              data-toggle="collapse"
              aria-expanded="false"
              class="sideBarDrpdown mb-1"
              @click="adminwasclicked"
            >
              <b-row class="adminStyle">
                <b-col cols="2">
                  <span
                    ><font-awesome-icon icon="user-tie" class="icon"
                  /></span>
                </b-col>
                <b-col>
                  <span class="ml-2 mr-2 sidebarText">Administrator</span>
                  <span class="caretIcon">
                    <span id="adminCaretToggle" class="mr-2 caretStyle"
                      ><i class="fas fa-caret-down fa-sm"></i
                    ></span>
                  </span>
                  <span class="plusIcon">
                    <span v-show="clickStatus === false"
                      ><i class="fas fa-plus fa-sm"></i
                    ></span>
                    <span v-show="clickStatus === true"
                      ><i class="fas fa-minus fa-sm"></i
                    ></span>
                  </span>
                </b-col>
              </b-row>
            </a>

            <b-collapse id="collapse-1">
              <li
                v-for="(adminsubmenu, index) in adminsubmenus"
                :key="index"
                class="adminSubMenusStyle"
                v-if="hasAccess(adminsubmenu.action)"
              >
                <router-link :id="'sb-' + index" :to="adminsubmenu.path">
                  <b-row>
                    <b-col cols="2">
                      <span
                        ><font-awesome-icon
                          :icon="adminsubmenu.icon"
                          class="icon"
                        />
                      </span>
                    </b-col>
                    <span class="ml-4 adminDrpdown">{{
                      adminsubmenu.description
                    }}</span>
                  </b-row>
                </router-link>
              </li>
            </b-collapse>
          </li>
          <li v-if="files.length > 0">
            <a
              id="sb-admin"
              v-b-toggle.collapse-2
              data-toggle="collapse"
              aria-expanded="false"
              class="sideBarDrpdown mb-1"
              @click="filewasclicked"
            >
              <b-row class="adminStyle">
                <b-col cols="2">
                  <span><font-awesome-icon icon="sliders" class="icon" /></span>
                </b-col>
                <b-col>
                  <span class="ml-2 mr-2 sidebarText">File Maintenance</span>
                  <span class="caretIcon">
                    <span id="fileCaretToggle" class="mr-2 caretStyle"
                      ><i class="fas fa-caret-down fa-sm"></i
                    ></span>
                  </span>
                  <span class="plusIcon">
                    <span v-show="clickStatus === false"
                      ><i class="fas fa-plus fa-sm"></i
                    ></span>
                    <span v-show="clickStatus === true"
                      ><i class="fas fa-minus fa-sm"></i
                    ></span>
                  </span>
                </b-col>
              </b-row>
            </a>

            <b-collapse id="collapse-2">
              <li
                v-for="(file, index) in files"
                :key="index"
                class="adminSubMenusStyle"
                v-if="hasAccess(file.action)"
              >
                <router-link :id="'sb-' + index" :to="file.path">
                  <b-row>
                    <b-col cols="2">
                      <span
                        ><font-awesome-icon :icon="file.icon" class="icon" />
                      </span>
                    </b-col>
                    <span class="ml-4 adminDrpdown">{{
                      file.description
                    }}</span>
                  </b-row>
                </router-link>
              </li>
            </b-collapse>
          </li>
          <hr style="background-color: white;">
          <li v-for="(link, index) in links" :key="index" v-if="hasAccess(link.action)">
            <router-link class="my-1" :id="'sb1-' + index" :to="link.path">
              <b-row>
                <b-col cols="2">
                  <span
                    ><font-awesome-icon :icon="link.icon" class="icon"
                  /></span>
                </b-col>
                <b-col>
                  <span class="ml-2 sidebarText">{{ link.description }}</span>
                </b-col>
              </b-row>
            </router-link>
          </li>
        </ul>
      </div>
      <footer class="footerStyle">Copyright &copy; 2026 Koronadal City</footer>
    </nav>

    <!-- HEADER NAVIGATION BAR-->
    <div class="topRightBarContainer">
      <div class="topRightBar">
        <span class="userBtn">
          <i class="fas fa-user userIcon"></i>
        </span>
        <span class="mb-1" style="position: relative; padding-left: 1.5rem">
          <b-row>
            <b style="font-size: 10px; font-size: 12px; color: #343a40"
              >Alvin Subere&nbsp;</b
            >
          </b-row>
          <b-row>
            <b-badge
              class="dark"
              style="
                margin-top: 1px;
                font-size: 9px;
                border-radius: 100px;
                padding: 3px 6px;
              "
              >Administrator</b-badge
            >
          </b-row>
        </span>
        <div class="userGuideBtnContainer" v-b-tooltip.hover title="User Guide">
          <!-- <button @click="openPDF" class="userGuideBtn" variant="none">
            <i class="fas fa-question userGuideIcon"></i>
          </button> -->
        </div>
        <b-badge
          v-if="notifCounter == 0"
          variant="danger"
          class="invisNotiCounter"
          >11</b-badge
        >

        <span
          id="btnLO"
          class="loBtnContainer"
          align="right"
          style="margin-top: 5px"
          v-b-tooltip.hover
          title="Sign-out"
        >
          <b-button
            id="btnLogout"
            pill
            class="customBtnLO"
            @click="show = true"
            v-b-modal.modal-logout
          >
            <i class="fas fa-power-off loIcon"></i>
          </b-button>
          <b-modal
            id="modal-logout"
            v-model="show"
            header-class="assetColor"
            title="Do you really wish to logout?"
            size="md"
            no-close-on-backdrop
            @close="show = false"
          >
            <small>
              Any pending changes will not be saved... Press Logout to confirm
              or press esc to cancel.
            </small>
            <template #modal-footer>
              <div class="w-100">
                 <b-button
                  variant="primary"
                  size="sm"
                  class="float-right primaryBtn"
                  @click="logout"
                >
                  Logout
                </b-button>

                <b-button
                  variant="secondary"
                  size="sm"
                  class="float-right greyBtn mr-2"
                  @click="show = false"
                >
                  Cancel
                </b-button>
               
              </div>
            </template>
          </b-modal>
        </span>
      </div>
    </div>

    <div class="mainContainer">
      <nuxt />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  
  data() {
    return {
      disp: false,
      show: false,
      myInterval: null,
      role: localStorage.role,
      user: localStorage.name,
      modules: [],
      activeadminsubmenus: [],
      activelinks: [],
      clickStatus: false,
      adminsubmenus: [
        {
          path: "/admin/modules",
          icon: "cubes",
          description: "Modules",
          action: "View Modules",
        },
        {
          path: "/admin/actions",
          icon: "list-check",
          description: "Actions",
          action: "View Actions",
        },
        {
          path: "/admin/accessrights",
          icon: "fingerprint",
          description: "Roles & Access",
          action: "View Roles",
        },
        {
          path: "/admin/user",
          icon: "id-badge",
          description: "Users",
          action: "View Users",
        },
        {
          path: "/admin/activitylogs",
          icon: "chart-line",
          description: "Activity Logs",
          action: "View Activity Logs",
        },
      ],
      files: [
        {
          path: "/file_maintenance/accounts",
          icon: "file-invoice",
          description: "Accounts",
          action: "View Accounts",
        },
        {
          path: "/file_maintenance/subcategory",
          icon: "border-all",
          description: "Subcategory",
          action: "View Subcategory",
        },
        {
          path: "/file_maintenance/suppliers",
          icon: "people-group",
          description: "Suppliers",
          action: "View Suppliers",
        },
        {
          path: "/file_maintenance/manufacturers",
          icon: "chart-simple",
          description: "Manufacturers",
          action: "View Manufacturers",
        },
        {
          path: "/file_maintenance/attachments",
          icon: "image",
          description: "Attachments",
          action: "View Attachments",
        },
      ],
      links: [
        {
          path: "/dashboard",
          icon: "magnifying-glass",
          description: "Dashboard",
          action: "View Dashboard",
        },
        {
          path: "/assets",
          icon: "desktop",
          description: "Assets",
          action: "View Assets",
        },
        {
          path: "/maintenance",
          icon: "wrench",
          description: "Maintenance",
          action: "View Maintenance",
        },
        {
          path: "/reports",
          icon: "file",
          description: "Reports",
          action: "View Reports",
        },
      ],

      notifCounter: 0,
      notifs: [],
      socket: null,
      requestCounter: 0,
    };
  },
  mounted() {},
  async created() {
    if (localStorage.accessRights) {
      const access = JSON.parse(localStorage.accessRights);
      const actions = access.flatMap((menu) =>
        menu.actions.map((action) => action.actionname)
      );

      // Filter and assign data based on actions
      this.adminsubmenus = this.adminsubmenus.filter((submenu) =>
        actions.includes(submenu.action)
      );

      this.files = this.files.filter((file) => actions.includes(file.action));

      // Filter main links based on allowed actions
      this.links = this.links.filter((link) => actions.includes(link.action));
    } else {
      // If 'menus' doesn't exist, hide all sections
      this.adminsubmenus = [];
      this.files = [];
      this.links = [];
    }
  },
  methods: {
    hasAccess(actionName) {
      try {
        const accessRights = localStorage.getItem('accessRights');
        if (!accessRights) return false;
        
        const userAccessRights = JSON.parse(accessRights);
        
        // Check through modules and their actions
        for (const module of userAccessRights) {
          if (module.actions && Array.isArray(module.actions)) {
            const hasAction = module.actions.some(action => 
              action.actionname === actionName ||
              action.action_description === actionName ||
              action.right_name === actionName ||
              action.right === actionName ||
              action === actionName
            );
            if (hasAction) return true;
          }
        }
        return false;
      } catch (error) {
        console.error('Error checking access rights:', error);
        return false;
      }
    },
    notifClicked(data) {
      localStorage.setItem("request_id", data.request_id);
      // setTimeout(this.$root.$emit('selectNotiRow'), 100)
      try {
        if (!data.is_read) {
          const id = localStorage.id;

          this.socket.emit("notif read", {
            id: data.id,
            userId: id,
            session: localStorage.session,
          });
        }
        this.$refs.ndropdown.hide(true);
        this.$root.$emit("selectNotiRow");
        this.$router.push(`/request`);
      } catch (e) {
        console.log("Error from sidebar.vue notifClicked", e);
      }
    },
    adminwasclicked() {
      this.clickStatus = !this.clickStatus;
      if (this.clickStatus == true) {
        document.getElementById("adminCaretToggle").style.transform =
          "rotate(-180deg)";
        document.getElementById("adminCaretToggle").style.transition =
          "all .3s linear";
        // document.getElementById("adminCaretToggle").setAttribute( "style", "transition: all .3s linear; transform: rotate(180);");
      } else {
        document.getElementById("adminCaretToggle").style.transform =
          "rotate(0deg)";
        document.getElementById("adminCaretToggle").style.transition =
          "all .3s linear";
        // document.getElementById("adminCaretToggle").setAttribute( "style", "transition: all .3s linear; transform: rotate(180);");
      }
      // console.log(this.clickStatus);
    },
    filewasclicked() {
      this.clickStatus = !this.clickStatus;
      if (this.clickStatus == true) {
        document.getElementById("fileCaretToggle").style.transform =
          "rotate(-180deg)";
        document.getElementById("fileCaretToggle").style.transition =
          "all .3s linear";
      } else {
        document.getElementById("fileCaretToggle").style.transform =
          "rotate(0deg)";
        document.getElementById("fileCaretToggle").style.transition =
          "all .3s linear";
      }
    },

    async markAllAsRead() {
      try {
        const id = localStorage.id;

        this.socket.emit("notif all read", {
          id,
          session: localStorage.session,
        });

        this.$refs.ndropdown.hide(true);
      } catch (e) {
        console.log(e);
      }
    },
    logout() {
      // stop the interval to emit to socket;
      clearInterval(this.myInterval);
      localStorage.clear();
      this.$router.push(`/`);
    },
    openPDF() {
      const role = localStorage.role ? localStorage.role.toLowerCase() : '';
      if (role.includes("admin")) {
        window.open("/User_Guide_Admin_1.6.pdf");
      } else if (role.includes("controller")) {
        window.open("/User_Guide_Controller_1.6.pdf");
      } else if (role.includes("supervisor")) {
        window.open("/User_Guide_Supervisor_1.6.pdf");
      } else if (role.includes("accounting")) {
        window.open("/User_Guide_Accounting_1.6.pdf");
      } else if (role.includes("revive")) {
        window.open("/User_Guide_Revive.pdf");
      }
    },
    openNav() {
      document.getElementById("sidebar").style.width = "250px";
      document.getElementById("main").style.marginLeft = "250px";
    },

    async connectSocket() {
      this.notifs = [];
      try {
        this.socket = io.connect(process.env.socketUrl, { secure: true }); //connect to server

        const id = localStorage.id;
        // receive new notif;
        this.socket.on(`new req - ${id}`, (data) => {
          const e = data.e;

          let msg = "";
          let pre = "";
          let user;

          // start words of the notif
          if (localStorage.id == e.created_by) {
            if (!e.modified_by) {
              pre = "your";
              user = "You";
            } else {
              pre = "your";
              user = e.first_name_mod + " " + e.last_name_mod;
            }
          } else {
            pre = "the";
            user = e.first_name + " " + e.last_name;
          }

          // if pending
          if (e.request_status === "pending") {
            pre = "";
          }

          const hour = e.date.split(" ");
          const time = new Date(
            "1970-01-01T" + hour[1] + "Z"
          ).toLocaleTimeString("en-US", {
            timeZone: "UTC",
            hour12: true,
            hour: "numeric",
            minute: "numeric",
          });

          this.notifs.unshift({
            id: e.id,
            msg,
            is_read: e.is_read,
            date_updated: time,
            request_id: e.request_id,
            data: e,
            currentUser: localStorage.id,
            user: user,
            pre: pre,
          });
          this.notifCounter = this.notifCounter + 1; // just making sure maybe ++ not gonna work
          localStorage.setItem("notiCounter", this.notifCounter);
        });

        // retrieve current notifs;
        this.socket.emit(`my notif`, { id });

        // get current notifs;
        this.socket.on(`my req - ${id}`, (data) => {
          this.requestCounter = data.unfinishedRequestsCount;

          let temp = [];
          this.notifs = []; // clear

          const notifs = data.notifs;
          let counter = 0;

          for (let i = 0; i < notifs.length; i++) {
            const e = notifs[i];
            let msg = "";
            let pre = "";
            let user;

            // start words of the notif
            if (localStorage.id == e.created_by) {
              if (e.created_by == e.modified_by) {
                pre = "your";
                user = "You";
              } else {
                pre = "your";
                user = e.first_name_mod + " " + e.last_name_mod;
              }
            } else if (localStorage.id == e.modified_by) {
              pre = "the";
              user = "You";
            } else {
              pre = "the";
              user = e.first_name + " " + e.last_name;
            }

            // if pending
            if (e.request_status === "pending") {
              pre = "";
            }

            // how many notifs;
            if (!e.is_read) {
              counter++;
            }
            const hour = e.date.split(" ");
            const time = new Date(
              "1970-01-01T" + hour[1] + "Z"
            ).toLocaleTimeString("en-US", {
              timeZone: "UTC",
              hour12: true,
              hour: "numeric",
              minute: "numeric",
            });

            temp.push({
              id: e.id,
              msg,
              is_read: e.is_read,
              date_updated: time,
              request_id: e.request_id,
              data: e,
              currentUser: localStorage.id,
              user: user,
              pre: pre,
            });
          }

          this.notifs = temp;

          this.notifCounter = counter;
          localStorage.setItem("notiCounter", this.notifCounter);
        });

        // done update after clicking all read
        this.socket.on(`done all read - ${id}`, (data) => {
          // retrieve current notifs;

          this.socket.emit(`my notif`, { id });
        });

        // this.socket.emit(`remain requests`, { id });
      } catch (e) {
        console.log(e);
      }
    },

    formatDate(created_at) {
      return moment(created_at).format("MMM DD, YYYY hh:mm A");
    },
  },

  computed: {
    checkAdmin() {
      for (let i = 0; i < this.modules.length; i++) {
        if (this.modules[i].modulename.toLowerCase() === "admin") {
          return true;
        }
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
a[data-toggle="collapse"] {
  position: relative;
  /* font-size: large; */
}
.dropdown-toggle::after {
  display: fixed;
  position: absolute;
  top: 50%;
  right: 10px;
  /* transform: translateY(-50%); */
}
body {
  font-family: "Poppins", sans-serif;
  background: #fafafa;
}
p {
  font-family: "Poppins", sans-serif;
  font-size: 1.1em;
  font-weight: 300;
  line-height: 1.7em;
  color: #999;
}
.primary {
  background-color: #008ed8;
}
.icon {
  margin-left: 13px;
  margin-right: 13px;
}

.hr {
  background-color: white;
}
a,
a:hover,
a:focus {
  color: inherit;
  text-decoration: none;
  transition: all 0.3s;
  border-radius: 3px;
}

ul ul a {
  font-size: 0.9em !important;
  padding-left: 30px !important;
  background: black;
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

/* Add some padding inside the card container */
.container {
  padding: 2px 16px;
}
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.notiButton {
  .btn:focus {
    box-shadow: none;
  }
}

.dropdown-menu {
  border: none;
}

.noti-body {
  list-style-type: none;
  margin: 0;
  padding: 0;
  max-height: 350px;
  overflow: auto;
  width: 25rem;
  padding: 0 0.8rem 0 1rem;
  // border-top: 1px solid #ddd;
}

.noti-text {
  font-size: 13px;
  display: block;
  cursor: pointer;
  font: 11px normal "Helvetica Neue", Helvetica, Arial, sans-serif;
  width: 100%;
  padding: 4%;
  line-height: 15px;
  background-color: #f5f6fd;
  margin-bottom: 3px;
  border-radius: 10px;
  // border-bottom: 1px solid #ddd;
}

.noti-text-read {
  font-size: 13px;
  display: block;
  cursor: pointer;
  font: 11px normal "Helvetica Neue", Helvetica, Arial, sans-serif;
  width: 100%;
  padding: 4%;
  line-height: 15px;
  margin-bottom: 3px;
  background-color: #fff;
  // border-radius: 10px;
}

.noti-footer {
  height: 0.5rem;
}
</style>

<template>
  <div class="loginContainer">
    <!-- LOADER -->
    <div class="loginForm">
      <img class="logo" src="/city_logo.png" />

      <div class="appName">AIMS</div>

      <div class="subName">Asset and Inventory Management System</div>
      <div class="pageName">LOGIN</div>

      <div>
        <div>
          <input
            type="text"
            class="loginFields"
            placeholder="Enter your username"
            v-model="user.username"
            @keyup.enter="login()"
            :input-attrs="{ autocomplete: true }"
          />

          <div class="passCons">
            <input
              :type="inpType"
              class="loginFields pass"
              placeholder="Enter the given password"
              v-model="user.pass"
              @keyup.enter="login()"
            />
            <div class="eye">
              <font-awesome-icon @click="show()" :icon="icn">
              </font-awesome-icon>
            </div>
          </div>

          <button class="loginButton loginBX" @click="login()">
            <span class="buttonName">Login</span>
          </button>
          <br />
          <small style="color: #20525c; font-size: 12px"
            ><em>Default password is 1234</em></small
          >
          <br />
          <div class="sysLabel">
            &copy;{{ year }} City Government of Koronadal
          </div>
        </div>
        <div>
          <b-alert
            :show="alert.showAlert"
            :variant="alert.variant"
            @dismissed="alert.showAlert = null"
          >
            <fa
              :icon="
                alert.variant == 'success'
                  ? 'check-circle'
                  : 'exclamation-triangle'
              "
              class="mr-1"
              style="font-size: 20px"
            />
            {{ alert.message }}
          </b-alert>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      modalEmail: false,
      saveAccessRights: [],
      pass: false,
      loader: false,
      icn: "eye-slash",
      inpType: "password",
      user: {
        username: "",
        pass: "",
      },
      alert: {
        showAlert: 0,
        variant: "success",
        message: "The username and / or password is Incorrect",
      },
    };
  },
  beforeCreate() {},

  created() {
    // CLEAR LOCAL STORAGE
    localStorage.clear();
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
  methods: {
    show() {
      this.pass = !this.pass;
      if (this.pass == true) {
        this.icn = "eye";
        this.inpType = "text";
      } else {
        this.icn = "eye-slash";
        this.inpType = "password";
      }
    },
  },
};
</script>

<style scoped lang="scss">
$colReject: #e84d2e;
$colPos2: #00a651;

.logo {
  height: auto;
  width: 80px;
}

.alert {
  position: fixed;
  bottom: 5%;
  right: 5%;
  z-index: 10000;
  animation: fadein 0.4s;
}

.alert svg path {
  color: white;
}

.alert-danger {
  color: #fff;
  background-color: $colReject;
  border-color: transparent;
}

.alert-success {
  color: white;
  background-color: $colPos2;
  border-color: transparent;
}

@keyframes fadein {
  0% {
    opacity: 0%;
    bottom: 1%;
    right: 5%;
  }

  50% {
    opacity: 50%;
  }

  100% {
    opacity: 1000%;
    bottom: 5%;
    right: 5%;
  }
}
</style>

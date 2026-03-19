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
            autocomplete="username"
            name="username"
            id="username"
          />

          <div class="passCons">
            <input
              :type="inpType"
              class="loginFields pass"
              placeholder="Enter the given password"
              v-model="user.pass"
              @keyup.enter="login()"
              autocomplete="current-password"
              name="password"
              id="password"
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
       
      </div>
    </div>
    <b-alert
      :show="alert.showAlert"
      dismissible
      :variant="alert.variant"
      @dismissed="alert.showAlert = null"
    >
      <font-awesome-icon
        :icon="alert.variant == 'success' ? 'circle-check' : 'circle-exclamation'"
        class="mr-1 alert-font"
      />
      {{ alert.message }}
    </b-alert>
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
        variant: "",
        message: "",
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
    showAlert(message, variant) {
      this.alert = { showAlert: 3, variant, message };
    },
    async login() {
      try {
        const res = await axios({
          method: "PUT",
          url: `${this.$axios.defaults.baseURL}/admin/user-accounts/login`,
          data: {
            user_name: this.user.username,
            password: this.user.pass
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
        console.log(res.data)
        // Store token and user data
        if (res.data) {
          localStorage.setItem('token', res.data.token || '');
          localStorage.setItem('user', JSON.stringify(res.data.firstName ? res.data.firstName + ' ' + (res.data.lastName || '') : ''));
          localStorage.setItem('accessRights', JSON.stringify(res.data.modules || []));
          localStorage.setItem('id', res.data.id || '');
          
          // Check if user needs to be redirected to First_Login
          if (res.data.isToReset == true) {
            localStorage.id = res.data.id;
            this.$router.push(`/First_Login`);
            return;
          }
        }
        
        // Show success message and redirect
        this.showAlert("Login successful! Redirecting...", "success");
        
        // Redirect to assets page
        setTimeout(() => {
          this.$router.push('/assets');
        }, 1000);
        
      } catch (error) {
        this.showAlert("The username and / or password is Incorrect", "danger");
      }
    },
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

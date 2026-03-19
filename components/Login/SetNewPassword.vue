<template>
  <div class="loginContainer">
    <!-- LOADER -->
    <div class="loginForm">
      <img class="logo" src="/city_logo.png" />

      <div class="appName">AIMS</div>

      <div class="subName">Asset and Inventory Management System</div>
      <br>
      <div class="pageName">SET NEW PASSWORD</div>
      <div class="userName" v-if="user.username">Username: <b> {{ String(user.username) }}</b></div>

      <div>
        <div>
          <div class="passCons">
            <input
              :type="inpTypeNew"
              class="loginFields pass"
              placeholder="Enter new password"
              v-model="user.new_password"
              @keyup.enter="setPassword"
            />
            <div class="eye">
              <font-awesome-icon @click="showNew()" :icon="icnNew">
              </font-awesome-icon>
            </div>
          </div>
          <div class="rePassCons">
            <input
              :type="inpTypeRe"
              class="loginFields pass"
              placeholder="Confirm new password"
              v-model="user.repassword"
              @keyup.enter="setPassword"
            />
            <div class="eye">
              <font-awesome-icon @click="showRe()" :icon="icnRe">
              </font-awesome-icon>
            </div>
          </div>

          <button class="mt-2 loginButton loginBX" @click="setPassword">
            <span class="buttonName">Set Password</span>
          </button>
          <br />
          <!-- <small style="color: #20525c; font-size: 12px"
            ><em>Please enter desired password</em></small
          > -->
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
      passNew: false,
      passRe: false,
      loader: false,
      icnNew: "eye-slash",
      icnRe: "eye-slash",
      inpTypeNew: "password",
      inpTypeRe: "password",
      user: {
        username: "",
        new_password: "",
        repassword: "",
      },
      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },
    };
  },

  created() {
    const username = localStorage.user;
    if (username) {
      this.user.username = username;
    }
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
    
    showNew() {
      this.passNew = !this.passNew;
      if (this.passNew == true) {
        this.icnNew = "eye";
        this.inpTypeNew = "text";
      } else {
        this.icnNew = "eye-slash";
        this.inpTypeNew = "password";
      }
    },
    
    showRe() {
      this.passRe = !this.passRe;
      if (this.passRe == true) {
        this.icnRe = "eye";
        this.inpTypeRe = "text";
      } else {
        this.icnRe = "eye-slash";
        this.inpTypeRe = "password";
      }
    },
    
    async setPassword() {
      // Validation
      if (!this.user.new_password || !this.user.repassword) {
        this.showAlert("Please fill in all password fields", "danger");
        return;
      }
      
      if (this.user.new_password !== this.user.repassword) {
        this.showAlert("Passwords do not match", "danger");
        return;
      }
      
      try {
        const res = await axios({
          method: "PUT",
          url: `${this.$axios.defaults.baseURL}/admin/user-accounts/reset-password/${localStorage.id}`,
          data: {
            repassword: this.user.repassword,
            password: this.user.new_password
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        // Check if user needs to be redirected to First_Login
        if (res.data.isToReset == true) {
          localStorage.id = res.data.id;
          this.$router.push(`/First_Login`);
          return;
        }
        
        // Show success message
        this.showAlert("Password set successfully! Redirecting to login...", "success");
        
        localStorage.clear();
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          this.$router.push('/');
        }, 2000);
        
      } catch (error) {
        this.showAlert("Failed to set password. Please try again.", "danger");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.userName {
  font-size: smaller;
  font-weight: normal;
  color: #666;
  margin-top: -30px;
  margin-bottom: 20px;
}
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
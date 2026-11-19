<template>
  <div class="login-page">
    <div class="login-bg"></div>
    <div class="login-overlay"></div>

    <transition name="toast">
      <div v-if="alert.showAlert" class="login-toast" :class="'toast-' + alert.variant">
        <div class="toast-icon">
          <font-awesome-icon v-if="alert.variant == 'success'" icon="circle-check" />
          <font-awesome-icon v-else-if="alert.variant == 'danger'" icon="circle-exclamation" />
          <font-awesome-icon v-else icon="info-circle" />
        </div>
        <span class="toast-msg">{{ alert.message }}</span>
        <button class="toast-close" @click="alert.showAlert = 0">&times;</button>
      </div>
    </transition>

    <div class="login-card">
      <div class="login-card-inner">
        <div class="login-header">
          <img class="login-logo" src="/city_logo.png" alt="logo" />
          <h1 class="login-title">AIMS</h1>
          <p class="login-subtitle">Asset and Inventory Management System</p>
        </div>

        <div class="login-body">
          <div class="input-group-custom">
            <font-awesome-icon icon="user" class="input-icon" />
            <input
              type="text"
              class="login-input"
              placeholder="Username"
              v-model="user.username"
              @keyup.enter="login()"
              autocomplete="username"
              name="username"
              id="username"
            />
          </div>

          <div class="input-group-custom">
            <font-awesome-icon icon="lock" class="input-icon" />
            <input
              :type="inpType"
              class="login-input"
              placeholder="Password"
              v-model="user.pass"
              @keyup.enter="login()"
              autocomplete="current-password"
              name="password"
              id="password"
            />
            <button class="eye-btn" @click="show()" type="button" tabindex="-1">
              <font-awesome-icon :icon="icn" />
            </button>
          </div>

          <button class="login-btn" @click="login()">
            <span>Sign In</span>
            <font-awesome-icon icon="arrow-right" class="btn-arrow" />
          </button>

          <p class="login-hint">
            <font-awesome-icon icon="info-circle" class="hint-icon" />
            Default password is <strong>1234</strong>
          </p>
        </div>

        <div class="login-footer">
          <p class="copyright">&copy;{{ year }} City Government of Koronadal</p>
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
      pass: false,
      icn: "eye-slash",
      inpType: "password",
      user: {
        username: "",
        pass: "",
      },
      alert: {
        showAlert: false,
        variant: "",
        message: "",
        timer: null,
      },
    };
  },

  created() {
    localStorage.clear();
  },

  computed: {
    year() {
      return new Date().getFullYear();
    },
  },

  methods: {
    showAlert(message, variant) {
      if (this.alert.timer) clearTimeout(this.alert.timer);
      this.alert = { showAlert: true, variant, message, timer: null };
      this.alert.timer = setTimeout(() => {
        this.alert.showAlert = false;
      }, 3500);
    },

    async login() {
      try {
        const res = await axios({
          method: "PUT",
          url: `${this.$axios.defaults.baseURL}/admin/user-accounts/login`,
          data: {
            user_name: this.user.username,
            password: this.user.pass,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.data) {
          localStorage.setItem("token", res.data.token || "");
          localStorage.setItem(
            "user",
            res.data.firstName
              ? res.data.firstName + " " + (res.data.lastName || "")
              : ""
          );
          localStorage.setItem(
            "accessRights",
            JSON.stringify(res.data.modules || [])
          );
          localStorage.setItem("id", res.data.id || "");
          localStorage.setItem("role", res.data.role);

          if (res.data.isToReset == true) {
            this.$router.push(`/First_Login`);
            return;
          }

          this.showAlert(
            "Login successful! Redirecting...",
            "success"
          );

          setTimeout(() => {
            this.$router.push("/assets");
          }, 1000);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.showAlert(
            "The username and / or password is incorrect",
            "danger"
          );
        } else if (error.response) {
          this.showAlert(
            "Server error. Please try again later.",
            "danger"
          );
        } else if (error.request) {
          this.showAlert(
            "Cannot connect to server. Check your network.",
            "danger"
          );
        } else {
          this.showAlert(
            "An unexpected error occurred. Please try again.",
            "danger"
          );
        }
        console.error("Login error:", error);
      }
    },

    show() {
      this.pass = !this.pass;
      this.icn = this.pass ? "eye" : "eye-slash";
      this.inpType = this.pass ? "text" : "password";
    },
  },
};
</script>

<style scoped lang="scss">
// ─── Variables ───────────────────────────────────────────
$primary: #0b345f;
$primary-light: #1a5276;
$accent: #fdf601;
$text-light: rgba(255, 255, 255, 0.85);
$text-muted: rgba(255, 255, 255, 0.55);
$card-bg: rgba(255, 255, 255, 0.08);
$card-border: rgba(255, 255, 255, 0.12);
$input-bg: rgba(255, 255, 255, 0.07);
$input-border: rgba(255, 255, 255, 0.15);
$input-focus-border: rgba(255, 255, 255, 0.5);
$shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

// ─── Page Container ──────────────────────────────────────
.login-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #0a0f1a;
}

// ─── Background ──────────────────────────────────────────
.login-bg {
  position: absolute;
  inset: 0;
  background: url("/cityhall.jpeg") center center / cover no-repeat;
  filter: blur(4px) brightness(0.4);
  transform: scale(1.05);
}

.login-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(11, 52, 95, 0.6) 0%,
    rgba(10, 15, 26, 0.8) 100%
  );
}

// ─── Toast Alert ─────────────────────────────────────────
.login-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 320px;
  max-width: 440px;
  padding: 14px 16px 14px 18px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  font-family: font_R, sans-serif;
  font-size: 14px;
  color: #fff;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  &.toast-success {
    background: linear-gradient(135deg, rgba(5, 150, 105, 0.92), rgba(16, 185, 129, 0.92));
  }

  &.toast-danger {
    background: linear-gradient(135deg, rgba(220, 38, 38, 0.92), rgba(239, 68, 68, 0.92));
  }

  &.toast-warning {
    background: linear-gradient(135deg, rgba(217, 119, 6, 0.92), rgba(245, 158, 11, 0.92));
  }
}

.toast-icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  opacity: 0.9;
}

.toast-msg {
  flex: 1;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.12);
  border: none;
  border-radius: 50%;
  color: #fff;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
}

// ─── Toast Transition ────────────────────────────────────
.toast-enter-active {
  animation: toastIn 0.35s ease-out;
}

.toast-leave-active {
  animation: toastOut 0.25s ease-in forwards;
}

@keyframes toastIn {
  0% {
    opacity: 0;
    transform: translateX(40px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes toastOut {
  0% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(40px) scale(0.95);
  }
}

// ─── Login Card ──────────────────────────────────────────
.login-card {
  position: relative;
  z-index: 1;
  width: 420px;
  max-width: 92vw;
  background: $card-bg;
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid $card-border;
  border-radius: 24px;
  box-shadow: $shadow;
  animation: fadeUp 0.6s ease-out;
}

.login-card-inner {
  padding: 48px 40px 32px;
}

// ─── Header ──────────────────────────────────────────────
.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.login-logo {
  width: 72px;
  height: auto;
  margin-bottom: 12px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.login-title {
  font-family: font_B, sans-serif;
  font-size: 36px;
  color: #fff;
  margin: 0 0 4px;
  letter-spacing: 2px;
}

.login-subtitle {
  font-family: font_R, sans-serif;
  font-size: 13px;
  color: $text-muted;
  margin: 0;
}

// ─── Body ────────────────────────────────────────────────
.login-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

// ─── Input Groups ────────────────────────────────────────
.input-group-custom {
  position: relative;
  display: flex;
  align-items: center;
  background: $input-bg;
  border: 1px solid $input-border;
  border-radius: 14px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;

  &:focus-within {
    border-color: $input-focus-border;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08);
  }
}

.input-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-left: 16px;
  color: $text-muted;
  font-size: 14px;
  transition: color 0.25s ease;
}

.input-group-custom:focus-within .input-icon {
  color: $text-light;
}

.login-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 14px 12px;
  font-family: font_P, sans-serif;
  font-size: 14px;
  color: #fff;
  min-width: 0;

  &::placeholder {
    color: $text-muted;
    font-size: 13px;
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px rgba(255, 255, 255, 0.05) inset;
    -webkit-text-fill-color: #fff;
    border-radius: 14px;
  }
}

// ─── Eye Toggle ──────────────────────────────────────────
.eye-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  margin-right: 4px;
  background: transparent;
  border: none;
  color: $text-muted;
  font-size: 14px;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.2s ease, color 0.2s ease;
  padding: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: $text-light;
  }

  &:focus-visible {
    outline: 2px solid $input-focus-border;
    outline-offset: 2px;
  }
}

// ─── Login Button ────────────────────────────────────────
.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px 24px;
  margin-top: 4px;
  background: linear-gradient(135deg, $primary 0%, $primary-light 100%);
  border: none;
  border-radius: 14px;
  color: #fff;
  font-family: font_M, sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.25s ease;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(11, 52, 95, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  .btn-arrow {
    font-size: 13px;
    transition: transform 0.25s ease;
  }

  &:hover .btn-arrow {
    transform: translateX(4px);
  }
}

// ─── Hint ────────────────────────────────────────────────
.login-hint {
  text-align: center;
  font-family: font_R, sans-serif;
  font-size: 12px;
  color: $text-muted;
  margin: 4px 0 0;

  .hint-icon {
    margin-right: 6px;
    font-size: 11px;
  }

  strong {
    color: $text-light;
    font-family: font_M, sans-serif;
  }
}

// ─── Footer ──────────────────────────────────────────────
.login-footer {
  text-align: center;
  margin-top: 28px;
}

.copyright {
  font-family: font_R, sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  margin: 0;
}

// ─── Animations ──────────────────────────────────────────
@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}



// ─── Responsive ──────────────────────────────────────────
@media (max-width: 480px) {
  .login-card-inner {
    padding: 36px 24px 24px;
  }

  .login-title {
    font-size: 28px;
  }

  .login-logo {
    width: 56px;
  }
}
</style>

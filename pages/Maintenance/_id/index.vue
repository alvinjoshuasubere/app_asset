<template>
  <div class="my-3 px-3" id="maintenance-create-view">
    <Loading v-if="showLoading" style="z-index: 9999" />

    <!-- Back Button -->
    <div class="mb-3">
      <b-button class="backBtn" @click="goBack()">
        <font-awesome-icon icon="circle-arrow-left" class="mr-1" />
        Back
      </b-button>
    </div>

    <!-- Asset Details Card -->
    <b-card class="asset-card mb-3">
      <h6 class="asset-card-title">
        <font-awesome-icon icon="chart-line" class="mr-2" />
        Asset Details:
      </h6>

      <!-- Property No -->
      <div class="prop-no">{{ asset.propertyNo }}</div>

      <!-- Item Name -->
      <div class="item-name mt-1">{{ asset.itemName || asset.description }}</div>

      <!-- Office -->
      <div class="office-name">{{ asset.officeName }}</div>

      <!-- Warranty Badge -->
      <div class="mt-1 mb-3">
        <span class="warranty-badge">
          {{ asset.hasWarranty ? 'With Warranty' : 'Warranty not included' }}
        </span>
      </div>

      <hr class="section-divider" />

      <!-- General Account -->
      <div class="meta-label">
        <font-awesome-icon icon="bars" class="mr-1" style="font-size:11px;" />
        General Account
      </div>
      <div class="meta-value mb-3">{{ asset.accountTitle }}</div>

      <!-- Category -->
      <div class="meta-label">
        <font-awesome-icon icon="table-cells-large" class="mr-1" style="font-size:11px;" />
        Category
      </div>
      <div class="meta-value mb-3">{{ asset.category }}</div>

      <!-- Bottom row: Subcategory | Date Acquired | Unit Cost -->
      <b-row class="mt-2">
        <b-col cols="4">
          <div class="meta-label">
            <font-awesome-icon icon="object-group" class="mr-1" style="font-size:11px;" />
            Subcategory
          </div>
          <div class="meta-value">{{ asset.subcategory }}</div>
        </b-col>
        <b-col cols="4">
          <div class="meta-label">
            <font-awesome-icon icon="calendar" class="mr-1" style="font-size:11px;" />
            Date Acquired
          </div>
          <div class="meta-value">{{ asset.dateAcquired }}</div>
        </b-col>
        <b-col cols="4">
          <div class="meta-label">
            <font-awesome-icon icon="credit-card" class="mr-1" style="font-size:11px;" />
            Unit Cost
          </div>
          <div class="meta-value">{{ asset.unitCost }}</div>
        </b-col>
      </b-row>
    </b-card>

    <!-- Maintenance Record Details Card -->
    <b-card class="asset-card">
      <h6 class="asset-card-title mb-4">
        <font-awesome-icon icon="gear" class="mr-2" />
        Maintenance Record Details
      </h6>

      <!-- Technician -->
      <b-form-group class="form-field-group">
        <label class="field-label">TECHNICIAN</label>
        <b-form-input
          v-model="form.technician"
          placeholder="ENTER MAINTAINANCE TECHNICIAN"
          class="field-input"
          size="sm"
        ></b-form-input>
      </b-form-group>

      <!-- Findings Description -->
      <b-form-group class="form-field-group">
        <label class="field-label">FINDINGS DESCRIPTION</label>
        <b-form-textarea
          v-model="form.findingsDescription"
          placeholder="ENTER PROBLEM DESCRIPTION HERE"
          class="field-input"
          rows="3"
        ></b-form-textarea>
      </b-form-group>

      <!-- Nature + Findings side by side -->
      <b-row>
        <b-col cols="6">
          <b-form-group class="form-field-group">
            <label class="field-label">NATURE AND SCOPE OF WORK TO BE DONE</label>
            <b-form-textarea
              v-model="form.natureOfWork"
              placeholder="ENTER FINDINGS HERE"
              class="field-input"
              rows="3"
            ></b-form-textarea>
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <b-form-group class="form-field-group">
            <label class="field-label">FINDINGS NEEDED/REPLACED</label>
            <b-form-textarea
              v-model="form.findingsNeeded"
              placeholder="ENTER FINDING DETAILS HERE"
              class="field-input"
              rows="3"
            ></b-form-textarea>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Attachment -->
      <b-form-group class="form-field-group">
        <label class="field-label">ATTACHMENT</label>
        <b-form-file
          v-model="form.attachment"
          class="field-input"
          placeholder="NO FILE CHOSEN"
          browse-text="Choose File"
          size="sm"
        ></b-form-file>
      </b-form-group>

      <!-- Action Buttons -->
      <div class="d-flex justify-content-end mt-4" style="gap: 10px;">
        <b-button
          variant="outline-secondary"
          size="sm"
          class="action-btn-cancel"
          @click="goBack()"
        >
          <font-awesome-icon icon="rotate-left" class="mr-1" />
          Cancel
        </b-button>
        <b-button
          class="action-btn-save"
          size="sm"
          @click="saveMaintenance()"
          :disabled="isSaving"
        >
          <b-spinner v-if="isSaving" small class="mr-1" />
          <font-awesome-icon v-else icon="pen-to-square" class="mr-1" />
          Save
        </b-button>
      </div>
    </b-card>

    <!-- Alert -->
    <b-alert
      :show="alert.showAlert"
      dismissible
      :variant="alert.variant"
      @dismissed="alert.showAlert = 0"
      class="mt-3"
    >
      <font-awesome-icon
        :icon="alert.variant === 'success' ? 'circle-check' : 'circle-exclamation'"
        class="mr-1"
      />
      {{ alert.message }}
    </b-alert>
  </div>
</template>

<script>
import Loading from "@/components/LoadingOverlay/Loading";
import moment from "moment";

export default {
  layout: "sidebar",
  components: { Loading },

  head() {
    return {
      meta: [{ hid: "description", name: "description", content: "Maintenance Create" }],
    };
  },

  data() {
    return {
      showLoading: false,
      isSaving: false,

      asset: {
        propertyNo: "",
        itemName: "",
        officeName: "",
        hasWarranty: false,
        accountTitle: "",
        category: "",
        subcategory: "",
        dateAcquired: "",
        unitCost: "",
        description: "",
        itemParamId: null,
      },

      form: {
        technician: "",
        findingsDescription: "",
        natureOfWork: "",
        findingsNeeded: "",
        attachment: null,
      },

      alert: {
        showAlert: 0,
        variant: "success",
        message: "",
      },
    };
  },

  async created() {
    await this.getAssetDetails();
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },

    async getAssetDetails() {
      this.showLoading = true;
      try {
        const id = this.$route.params.id ||  "";

        const res = await this.$axios.get(
          `${this.$axios.defaults.baseURL}/items/get-one?ItemHdrId=${id}`
        );
        const d = res.data;

        if (d) {
          this.asset = {
            propertyNo:   d.PropertyNo || "N/A",
            itemName:     d.Description || "N/A",
            officeName:   d.OfficeName   || d.Location      || "N/A",
            hasWarranty:  !!d.HasWarranty,
            accountTitle: d.AccountTitle  || "N/A",
            category:     d.Category || "N/A",
            subcategory:  d.Subcategory || "N/A",
            dateAcquired: d.DateAcquired  ? moment(d.DateAcquired).format("MMM DD, YYYY") : "N/A",
            unitCost:     d.UnitCost      ? "Php " + parseFloat(d.UnitCost).toLocaleString("en-PH", { minimumFractionDigits: 2 }) : "N/A",
            description:  d.Description   || "N/A",
            itemParamId:  d.ItemParamId || null,
          };
        }
      } catch (error) {
        console.error("Failed to load asset details:", error);
        this.showAlertMsg("Failed to load asset details.", "danger");
      } finally {
        this.showLoading = false;
      }
    },

    async saveMaintenance() {
      if (!this.form.technician || !this.form.findingsDescription) {
        this.showAlertMsg("Technician and Findings Description are required.", "warning");
        return;
      }

      this.isSaving = true;
      try {
        const payload = {
          ItemParamId:        this.asset.itemParamId,
          Technician:         this.form.technician,
          FindingsDescription: this.form.findingsDescription,
          NatureOfWork:       this.form.natureOfWork,
          FindingsNeeded:     this.form.findingsNeeded,
        };

        await this.$axios.post(
          `${this.$axios.defaults.baseURL}/items/save-maintenance`,
          payload
        );

        this.showAlertMsg("Maintenance record saved successfully.", "success");

        setTimeout(() => {
          this.$router.push("/maintenance");
        }, 1500);
      } catch (error) {
        console.error("Failed to save maintenance:", error);
        this.showAlertMsg("Failed to save maintenance record.", "danger");
      } finally {
        this.isSaving = false;
      }
    },

    showAlertMsg(message, variant) {
      this.alert.message = message;
      this.alert.variant = variant;
      this.alert.showAlert = 5;
    },
  },
};
</script>

<style scoped>
/* ── Card ─────────────────────────────────── */
.asset-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  padding: 1.25rem 1.5rem;
  background: #fff;
}

/* ── Card Title ───────────────────────────── */
.asset-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
}

/* ── Property No ──────────────────────────── */
.prop-no {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}

/* ── Item Name ────────────────────────────── */
.item-name {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
}

/* ── Office ───────────────────────────────── */
.office-name {
  font-size: 13px;
  color: #555;
  margin-top: 2px;
}

/* ── Warranty Badge ───────────────────────── */
.warranty-badge {
  display: inline-block;
  background-color: #6c757d;
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 20px;
  margin-top: 4px;
}

/* ── Divider ──────────────────────────────── */
.section-divider {
  border-color: #e8e8e8;
  margin: 12px 0;
}

/* ── Meta label/value ─────────────────────── */
.meta-label {
  font-size: 11px;
  color: #888;
  font-weight: 500;
  margin-bottom: 2px;
}

.meta-value {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

/* ── Form fields ──────────────────────────── */
.form-field-group {
  margin-bottom: 16px;
}

.field-label {
  font-size: 11px;
  font-weight: 700;
  color: #555;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
  display: block;
}

.field-input {
  font-size: 13px;
  color: #888;
  border: 1px solid #d0d0d0;
  border-radius: 5px;
  background: #fff;
}

.field-input:focus {
  border-color: #1a3a5c;
  box-shadow: 0 0 0 2px rgba(26, 58, 92, 0.12);
}

/* ── Buttons ──────────────────────────────── */
.backBtn {
  background: transparent;
  border: 1px solid #ccc;
  color: #333;
  font-size: 13px;
  padding: 4px 14px;
  border-radius: 5px;
}

.backBtn:hover {
  background: #f0f0f0;
}

.action-btn-cancel {
  font-size: 13px;
  padding: 5px 18px;
  border-radius: 6px;
  border: 1px solid #bbb;
  color: #444;
  background: #fff;
}

.action-btn-cancel:hover {
  background: #f5f5f5;
}

.action-btn-save {
  font-size: 13px;
  padding: 5px 20px;
  border-radius: 6px;
  background-color: #1a3a5c;
  border: none;
  color: #fff;
  font-weight: 600;
}

.action-btn-save:hover {
  background-color: #14304e;
}

/* ── Responsive ───────────────────────────── */
@media (max-width: 576px) {
  .meta-value {
    font-size: 13px;
  }
}
</style>
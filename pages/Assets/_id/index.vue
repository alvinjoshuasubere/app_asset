<template>
  <div class="my-3" id="requests-view">
    <Loading v-if="showLoading" style="z-index: 9999" />
    <div class="ml-3">
      <b-button class="backBtn" @click="goBack()">
        <font-awesome-icon icon="circle-arrow-left" class="mr-2" />Back
      </b-button>
    </div>
    <b-row>
      <b-col>
        <b-card class="mb-3 mainContent">
          <h5 class="section-title">Asset Details</h5>
          <div
            class="details-row"
            v-for="(value, label) in {
              'Account Title': asset.accountTitle,
              'Subcategory': asset.subcategory,
              'Description': asset.description,
              'Property No.': asset.propertyNo,
              'Unit Cost': 'PHP ' + asset.unitCost,
              'Date Acquired': asset.dateAcquired,
            }"
            :key="label"
          >
            <span class="label">{{ label }}:</span>
            <span class="value">{{ value }}</span>
          </div>

          <hr />

          <h5 class="section-title">Assignment Details</h5>

          <div
            class="details-row"
            v-for="(value, label) in {
              'Assigned To': assignment.assignedTo,
              'User Employee': assignment.userEmployee,
              Location: assignment.location,
            }"
            :key="label"
          >
            <span class="label">{{ label }}:</span>
            <span class="value">{{ value }}</span>
          </div>
        </b-card>

        <!-- Maintenance Details -->
        <b-card class="shadow-sm mainContent">
          <h5 class="mb-4 font-weight-bold">🛠 Maintenance Record Details</h5>

          <div v-if="maintenance.length === 0" class="text-center text-muted">
            <img
              class="server"
              style="height: 100px"
              src="/maintenance.png"
              alt="server down image"
            />
            <p>No Maintenance Record Found!</p>
          </div>

          <div v-else>
            <ul>
              <li v-for="(m, index) in maintenance" :key="index">
                {{ m.description }} — {{ m.date }}
              </li>
            </ul>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Loading from "@/components/LoadingOverlay/Loading";
import moment from "moment";
export default {
  layout: "sidebar",
  components: {
    Loading,
  },
  // meta: {
  //   access: { right: "view transactions" }
  // },
  head() {
    return {
      meta: [
        {
          hid: "description",
          name: "description",
          content: "System",
        },
      ],
    };
  },
  data() {
    return {
      showLoading : false,
      asset: {
        accountTitle: '',
        subcategory: '',
        description: '',
        propertyNo: '',
        unitCost: '',
        dateAcquired: '',
      },
      assignment: {
        assignedTo: '',
        userEmployee: '',
        location: '',
      },
      maintenance: [],
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
        const res = await this.$axios.get(
          `${this.$axios.defaults.baseURL}/items/get-filter?text=${this.$route.params.id}`
        );
        const assetData = res.data[0];
        console.log(assetData)
        
        if (assetData) {
          this.asset = {
            accountTitle: assetData.AccountTitle || 'N/A',
            subcategory: assetData.Subcategory || 'N/A',
            description: assetData.Description || 'N/A',
            propertyNo: assetData.PropertyNo || 'N/A',
            unitCost: assetData.UnitCost ? 'PHP ' + parseFloat(assetData.UnitCost).toLocaleString() : 'N/A',
            dateAcquired: assetData.DateAcquired ? this.formatDate(assetData.DateAcquired) : 'N/A'
          };
          
          this.assignment = {
            assignedTo: assetData.EmployeeAssigned || 'N/A',
            userEmployee: assetData.EmployeeAssigned || 'N/A',
            location: assetData.Location || 'N/A'
          };
          
          // const maintenanceRes = await this.$axios.get(
          //   `${this.$axios.defaults.baseURL}/maintenance/get-by-account-code?accountCode=${this.$route.params.id}`
          // );
          // this.maintenance = maintenanceRes.data || [];
        } else {
          // Handle case where asset is not found
          this.asset = {
            accountTitle: 'N/A',
            subcategory: 'N/A',
            description: 'N/A',
            propertyNo: 'N/A',
            unitCost: 'N/A',
            dateAcquired: 'N/A'
          };
          this.assignment = {
            assignedTo: 'N/A',
            userEmployee: 'N/A',
            location: 'N/A'
          };
          this.maintenance = [];
        }
      } catch (error) {
        console.error('Failed to load asset details:', error);
      } finally {
        this.showLoading = false;
      }
    },
    formatDate(date) {
      return moment(date).format("MMMM D, YYYY");
    },
  },
};
</script>

<style scoped>
html {
  background-color: #eee;
}

.color1 {
  color: #008ed8;
}
.icon {
  margin-left: 5px;
  margin-right: 10px;
}
.button1 {
  background-color: #008ed8;
  color: white;
}
.button2 {
  background-color: #ff6600;
  color: white;
}

.section-title {
  font-weight: bold;
  margin-bottom: 12px;
  color: #2b2b2b;
}

.details-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 8px;
  align-items: start;
  font-size: 15px;
  padding: 6px 0;
}

.label {
  width: 170px; /* fixed width keeps alignment perfect */
  font-weight: bold;
  color: #5b5b5b;
}

.value {
  color: #1a1a1a;
  font-weight: 600;
  word-break: break-word;
}
.backBtn {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.mainContent {
  background-color: #ffffff;
  border-radius: 8px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 1rem 1.25rem;
}

.details-row:nth-child(odd) {
  background-color: #f8f9fa;
}

@media (max-width: 576px) {
  .details-row {
    grid-template-columns: 1fr;
  }
  .label {
    width: auto;
  }
}

</style>

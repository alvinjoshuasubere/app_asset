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
              Subcategory: asset.subcategory,
              Description: asset.description,
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
      asset: {
        accountTitle: "ICT Equipment",
        subcategory: "Printer",
        description: "EPSON L3550 WIFI AIO Ink Tank Printer",
        propertyNo: "2025-01-030-0602-1022",
        unitCost: "13,545.00",
        dateAcquired: "May 06, 2025",
      },
      assignment: {
        assignedTo: "MARLOU SOMODIO",
        userEmployee: "KENJESAN PARLERO",
        location: "City Administrator's Office | 3rd Floor, Main Building",
      },
      maintenance: [],
    };
  },
  async created() {},
  methods: {},
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
  display: flex;
  justify-content: flex-start;
  margin-bottom: 6px;
  font-size: 15px;
}

.label {
  width: 170px; /* fixed width keeps alignment perfect */
  font-weight: bold;
  color: #5b5b5b;
}

.value {
  flex-grow: 1;
  color: #1a1a1a;
  font-weight: 600;
}
</style>

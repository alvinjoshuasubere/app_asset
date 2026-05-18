<template>
  <div class="dashboard-page" id="requests-view">
    <div class="mt-3">
      <b-row>
        <b-col>
          <nav class="breadcrumb-container ml-4">
            <a href="#" class="breadcrumb-link">Home</a>
            <span class="breadcrumb-separator">▶</span>
            <span class="breadcrumb-current">Dashboard</span>
          </nav>
       
    <!-- ── Top Stats Row ── -->
    <div class="stats-row">
      <button class="refresh-btn" @click="loadAll">
        <font-awesome-icon icon="rotate" :class="{ spinning: loading }" />
        Refresh
      </button>

      <div class="stat-card" v-for="(card, i) in statCards" :key="i">
        <div class="stat-label">{{ card.label }}</div>
        <div class="stat-value">{{ formatNumber(card.value) }}</div>
        <div class="stat-sub" :class="card.subClass">{{ card.sub }}</div>
      </div>
    </div>

    <!-- ── Bottom Row ── -->
    <div class="bottom-row">

      <!-- Category Table -->
      <div class="panel table-panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Category with Most Number of Overall Asset</div>
            <div class="panel-sub">
              <font-awesome-icon icon="table-cells" class="mr-1" />
              Total Asset Per Category
            </div>
          </div>
        </div>

        <div class="cat-table-wrapper">
          <table class="cat-table">
            <thead>
              <tr>
                <th>Subcategory</th>
                <th class="text-right">Total Assets</th>
                <th>Overall %</th>
                <th class="text-right">Total Obsolete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in paginatedCategories" :key="i" class="cat-row">
                <td class="cat-name">{{ row.subcategory }}</td>
                <td class="text-right cat-num">{{ row.total }}</td>
                <td class="cat-bar-cell">
                  <div class="cat-bar-wrap">
                    <span class="cat-pct">{{ row.pct }}</span>
                    <div class="cat-bar-bg">
                      <div
                        class="cat-bar-fill"
                        :style="{ width: row.pct }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="text-right cat-num">{{ row.obsolete }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="cat-pagination">
          <button class="pg-btn" :disabled="catPage === 1" @click="catPage--">Previous</button>
          <button
            v-for="p in totalCatPages" :key="p"
            class="pg-btn"
            :class="{ active: catPage === p }"
            @click="catPage = p"
          >{{ p }}</button>
          <button class="pg-btn" :disabled="catPage >= totalCatPages" @click="catPage++">Next</button>
        </div>
      </div>

      <!-- Line Chart -->
      <div class="panel chart-panel">
        <div class="panel-header">
          <div class="panel-title">Monthly Acquired Assets for the Year {{ currentYear }}</div>
        </div>
        <div class="chart-area">
          <canvas ref="lineChart"></canvas>
        </div>
      </div>

    </div>
        </b-col>
      </b-row>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  components: {},
  async created() {
    await this.loadAll();
  },
  data() {
    return {
      loading: false,
      currentYear: new Date().getFullYear(),
      catPage: 1,
      catPerPage: 10,

      statCards: [
        { label: "Total Assets",         value: 0,     sub: "0% than yesterday",   subClass: "sub-neutral" },
        { label: "Daily Assets",         value: 0,     sub: "+0 on this month",     subClass: "sub-neutral" },
        { label: "Monthly Assets",       value: 0,     sub: "+0 on this month",     subClass: "sub-neutral" },
        { label: "Total Maintenance",    value: 0,     sub: "+0 on this month",     subClass: "sub-neutral" },
      ],

      categories: [],

      monthlyData: [0,0,0,0,0,0,0,0,0,0,0,0],
    };
  },
  computed: {
    paginatedCategories() {
      const start = (this.catPage - 1) * this.catPerPage;
      return this.categories.slice(start, start + this.catPerPage);
    },
    totalCatPages() {
      return Math.max(1, Math.ceil(this.categories.length / this.catPerPage));
    },
  },
  mounted() {
    this.$nextTick(() => this.drawChart());
  },
  methods: {
    formatNumber(val) {
      return Number(val).toLocaleString("en-PH");
    },
    async loadAll() {
      this.loading = true;
      try {
        const res = await this.$axios.get(
          `${this.$axios.defaults.baseURL}/dashboard/get-all`
        );
        
        console.log(res.data)
        
        // Update stat cards with real data
        if (res.data.DashboardData && res.data.DashboardData.dasboardCardDetails) {
          const cardDetails = res.data.DashboardData.dasboardCardDetails[0];
          
          if (res.data.TotalAsset !== undefined) {
            this.statCards[0].value = res.data.TotalAsset;
          }
          if (cardDetails.DailyAsset !== undefined) {
            this.statCards[1].value = cardDetails.DailyAsset;
            this.statCards[1].sub = `${res.data.DailyPercentage > 0 ? '+' : ''}${res.data.DailyPercentage}% than yesterday`;
            this.statCards[1].subClass = res.data.DailyPercentage > 0 ? 'sub-up' : 'sub-neutral';
          }
          if (cardDetails.MonthlyAsset !== undefined) {
            this.statCards[2].value = cardDetails.MonthlyAsset;
            this.statCards[2].sub = `+${res.data.MonthlyPercentage} on this month`;
            this.statCards[2].subClass = 'sub-up';
          }
          if (cardDetails.TotalMaintenance !== undefined) {
            this.statCards[3].value = cardDetails.TotalMaintenance;
            this.statCards[3].sub = `${res.data.MonthlyMaintenance > 0 ? '+' : ''}${res.data.MonthlyMaintenance} on this month`;
            this.statCards[3].subClass = res.data.MonthlyMaintenance > 0 ? 'sub-up' : 'sub-neutral';
          }
          
          if (res.data.DashboardData.dashboardMonthlyData && Array.isArray(res.data.DashboardData.dashboardMonthlyData)) {
            this.monthlyData = res.data.DashboardData.dashboardMonthlyData.map(item => item.TotalAssets || 0);
          }
        }
      } catch (e) {
        console.error('Failed to load dashboard data:', e);
      } finally {
        this.loading = false;
      }
    },
    drawChart() {
      const canvas = this.$refs.lineChart;
      if (!canvas) return;

      // Dynamically load Chart.js from CDN if not available
      if (typeof Chart === "undefined") {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";
        script.onload = () => this.renderChart(canvas);
        document.head.appendChild(script);
      } else {
        this.renderChart(canvas);
      }
    },
    renderChart(canvas) {
      const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

      new Chart(canvas, {
        type: "line",
        data: {
          labels: months,
          datasets: [{
            label: "Assets Acquired",
            data: this.monthlyData,
            fill: true,
            backgroundColor: "rgba(59, 130, 246, 0.15)",
            borderColor: "#3b82f6",
            borderWidth: 2,
            pointBackgroundColor: "#3b82f6",
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#1e293b",
              titleColor: "#94a3b8",
              bodyColor: "#f1f5f9",
              padding: 10,
              cornerRadius: 8,
            },
          },
          scales: {
            x: {
              grid: { color: "rgba(0,0,0,0.04)" },
              ticks: { font: { size: 11 }, color: "#64748b" },
            },
            y: {
              grid: { color: "rgba(0,0,0,0.04)" },
              ticks: { font: { size: 11 }, color: "#64748b", stepSize: 5 },
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
  layout: "sidebar",
};
</script>

<style scoped>
</style>
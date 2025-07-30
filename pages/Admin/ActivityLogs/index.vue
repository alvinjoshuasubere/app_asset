<template>
  <!-- DIVISION -->
  <div class="my-3" id="requests-view">
    <b-row>
      <b-col>
        <h5 class="ml-4" style="font-weight: bolder; font-family: font_B">
          <font-awesome-icon
            icon="circle-info"
            class="viewIcon mr-2"
            small
          />Activity Logs Information
        </h5>
        <b-card class="cardProfile mainContent">
          <b-row>
            <b-col cols="8">
              <b-form-group class="searchbar" label-size="sm">
                <b-input-group size="md">
                  <b-form-input
                    type="search"
                    id="inputSearch"
                    class="searchbar no-outline"
                    placeholder="Type to Search"
                    v-model="filterfees"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button
                      class="buttonClearSearch"
                      id="buttonClearSearch"
                      :disabled="!filterfees"
                      @click="clearSearch"
                      >Clear</b-button
                    >
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
            <!-- <b-col cols="4" class="text-right">
              <b-button
                style="font-size: 13px; height: 2rem"
                class="ml-4"
                v-b-tooltip.noninteractive.hover
                title="Create MTOP"
                variant="dark"
                size="md"
                @click="$bvModal.show('bv-modal-create')"
              >
                <font-awesome-icon icon="plus" class="icon" />Add New
              </b-button>
            </b-col> -->
          </b-row>
          <b-table
            head-variant="light"
            style="font-size: 12px"
            class="my-3"
            show-empty
            small
            :current-page="currentPage"
            :per-page="perPage"
            :busy.sync="isBusy"
            :items="filteredFees"
            :fields="fieldsFees"
          >
            <template v-slot:cell(actions)>
              <button
                id="editAddress"
                class="editBtn"
                @click="edit(row)"
                v-b-tooltip.noninteractive.hover
                title="Edit"
              >
                <font-awesome-icon
                  icon="pen-to-square"
                  class="viewIcon"
                  small
                />
              </button>
              <button
                id="deleteAddress"
                class="deleteBtn"
                @click="deleteItem(row)"
                v-b-tooltip.noninteractive.hover
                title="Delete"
              >
                <font-awesome-icon icon="trash" class="viewIcon" small />
              </button>
            </template>
            <template v-slot:table-caption>
              <b-row align-h="end">
                <b-col cols="6">{{ bottomLabel }}</b-col>
                <b-col cols="6">
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    pills
                    align="right"
                    size="sm"
                  ></b-pagination>
                </b-col>
              </b-row>
            </template>
          </b-table>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  components: {},
  async created() {},
  // meta: {
  //   access: { right: "view actions" }
  // },
  data() {
    return {
      filterfees: "",
      isBusy: false,
      fees: [],
      currentPage: 1,
      perPage: 10,
      fieldsFees: [
        {
          key: "FullName",
          label: "FullName",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "LastName",
          label: "Last Name",
          sortable: true,
          sortDirection: "desc",
          class: "text-center",
        },
        {
          key: "FirstName",
          label: "First Name",
          sortable: true,
          sortDirection: "desc",
          class: "text-center",
        },
        {
          key: "DepartmentDescription",
          label: "Department",
          sortable: true,
          sortDirection: "desc",
          class: "text-center",
        },

        {
          key: "actions",
          label: "",
          sortable: true,
          class: "text-center",
        },
      ],
    };
  },
  async created() {
    await this.getUsers();
  },
  computed: {
    filteredFees() {
      if (this.filterfees == null) {
        return this.fees;
      }
      const filterLowerCase = this.filterfees.trim().toLowerCase();

      return this.fees.filter((item) => {
        return (
          String(item.Description).toLowerCase().includes(filterLowerCase) ||
          String(item.CategoryDesc).toLowerCase().includes(filterLowerCase)
        );
      });
    },
    totalRows() {
      return this.filteredFees.length;
    },
    bottomLabel() {
      let end = this.perPage * this.currentPage;
      let start = end - this.perPage + 1;

      if (end > this.filteredFees.length) {
        end = this.filteredFees.length;
      }
      if (this.filteredFees.length === 0) {
        start = 0;
      }
      return `Showing ${start} to ${end} of ${this.filteredFees.length} entries`;
    },
  },
  mounted() {},
  methods: {
    async getUsers() {
      this.isBusy = true;
      try {
        const res = await axios({
          method: "GET",
          url: `${this.$axios.defaults.baseURL}/admin/users/get-all`,
          headers: {
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "GET",
          },
        });
        this.fees = res.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isBusy = false;
      }
    },
  },

  layout: "sidebar",
};
</script>

<style></style>

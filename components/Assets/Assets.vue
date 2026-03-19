<template>
  <div>
    <!-- Employee Selection Modal -->
    <b-modal
      no-close-on-backdrop
      header-class="assetColor"
      id="bv-modal-employee-selection"
      title="Select Employee"
      size="lg"
    >
      <b-container fluid>
        <b-row class="mb-3">
          <b-col cols="12">
            <b-form-group label-size="sm" label="Search Employee">
              <b-form-input
                v-model="employeeFilter"
                type="search"
                placeholder="Type to search employees..."
                debounce="300"
                size="sm"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12">
            <b-table
              id="employeeTable"
              ref="employeeTable"
              class="tableAsset"
              style="font-size: 12px"
              head-variant="light"
              show-empty
              stacked="md"
              small
              sticky-header
              no-border-collapse
              hover
              selectable
              select-mode="single"
              :items="paginatedEmployees"
              :fields="employeeFields"
              :busy.sync="isEmployeeBusy"
              :per-page="employeePerPage"
              :current-page="employeeCurrentPage"
              @row-selected="onEmployeeSelected"
            >
              <template #table-busy>
                <div class="text-center text-secondary my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong>&nbsp;Loading...</strong>
                </div>
              </template>
            </b-table>
            <b-pagination
              v-model="employeeCurrentPage"
              :total-rows="filteredEmployees.length"
              :per-page="employeePerPage"
              pills
              align="center"
              size="sm"
              class="mt-3"
            ></b-pagination>
          </b-col>
        </b-row>
      </b-container>
      <template v-slot:modal-footer>
        <div>
          <b-button size="sm" class="greyBtn" @click="closeEmployeeModal">
            Cancel
          </b-button>
        </div>
      </template>
    </b-modal>

    <!-- ============================================================ -->
    <!-- View Details Modal                                           -->
    <!-- ============================================================ -->
    <b-modal
      no-close-on-backdrop
      header-class="assetColor"
      id="bv-modal-asset-details"
      title="Asset Item Details"
      size="xl"
      @close="closeModalView"
    >
      <b-container fluid>
        <!-- Asset Details Section -->
        <div class="asset-details-section">
          <div class="section-header">
            <i class="fas fa-chart-line"></i>
            <span class="section-title">Asset Details</span>
          </div>
          <div class="asset-info-card">
            <p class="property-no">{{ assetDetails.PropertyNo }}</p>
            <h5 class="asset-title">{{ assetDetails.Description }}</h5>
            <p class="office-name">{{ assetDetails.Office }}</p>
            <b-badge variant="primary" class="date-badge">
              <template v-if="assetDetails.date_validity">
                Until {{ formatDate(assetDetails.date_validity) }}
              </template>
              <template v-else>No warranty date</template>
            </b-badge>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">
                <i class="fas fa-credit-card"></i><span>General Account</span>
              </div>
              <p class="info-value">{{ assetDetails.AccountTitle }}</p>
            </div>
            <div class="info-item">
              <div class="info-label">
                <i class="fas fa-layer-group"></i><span>Category</span>
              </div>
              <p class="info-value">{{ assetDetails.Category || "N/A" }}</p>
            </div>
            <div class="info-item">
              <div class="info-label">
                <i class="fas fa-tags"></i><span>Subcategory</span>
              </div>
              <p class="info-value">{{ assetDetails.Subcategory }}</p>
            </div>
            <div class="info-item">
              <div class="info-label">
                <i class="far fa-calendar-alt"></i><span>Date Acquired</span>
              </div>
              <p class="info-value">
                {{ formatDate(assetDetails.DateAcquired) }}
              </p>
            </div>
            <div class="info-item">
              <div class="info-label">
                <i class="fas fa-money-bill-wave"></i><span>Unit Cost</span>
              </div>
              <p class="info-value">
                {{ formatCurrency(assetDetails.UnitCost) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="text-center my-3">
          <b-button
            size="sm"
            :disabled="!assetDetails.IsAssigned"
            class="primaryBtn mr-1"
            @click="showUnassignSection"
          >
            <font-awesome-icon icon="user-minus" class="mr-2" />Unassign
          </b-button>
          <b-button
            size="sm"
            :disabled="!assetDetails.IsAssigned"
            class="primaryBtn mr-1"
            @click="showTransferSection"
          >
            <font-awesome-icon icon="right-left" class="mr-2" />Transfer
          </b-button>
          <b-button
            size="sm"
            :disabled="assetDetails.IsAssigned"
            class="primaryBtn mr-1"
            @click="showAssignNewSection"
          >
            <font-awesome-icon icon="user-plus" class="mr-2" />Assign
          </b-button>
        </div>

        <hr />

        <!-- Current Assignment Info -->
        <div class="assignment-section" v-if="assetDetails.IsAssigned">
          <div class="section-header">
            <i class="fas fa-clipboard-list"></i>
            <span class="section-title">Current Assignment</span>
          </div>
          <div class="assignment-info mb-3">
            <h4 class="assigned-employee">
              {{ assetDetails.EmployeeAssigned || "N/A" }}
            </h4>
            <p class="office-location mb-1">
              {{ assetDetails.OfficeName || "N/A" }}
            </p>
            <p class="location-detail mb-1">
              {{ assetDetails.Location || "N/A" }}
            </p>
            <b-badge
              :variant="assetDetails.IsOutside ? 'warning' : 'success'"
              class="location-badge"
            >
              {{ assetDetails.IsOutside ? "OUTSIDE" : "ON PREMISES" }}
            </b-badge>
          </div>
        </div>

        <!-- ── UNASSIGN PANEL ── -->
        <b-collapse id="panel-unassign" v-model="showUnassignPanel">
          <b-card bg-variant="light" class="mt-2 border-danger">
            <div class="section-header mb-3">
              <i class="fas fa-user-minus text-danger"></i>
              <span class="section-title text-danger ml-1">Unassign Asset</span>
            </div>
            <p class="text-muted small mb-3">
              You are about to unassign this asset from
              <strong>{{ assetDetails.EmployeeAssigned }}</strong
              >. Are you sure you want to remove the assignment from the
              selected asset?
            </p>
            <div class="text-right">
              <b-button
                size="sm"
                class="greyBtn mr-2"
                @click="showUnassignPanel = false"
                >Cancel</b-button
              >
              <b-button
                size="sm"
                variant="danger"
                @click="confirmUnassignAsset"
              >
                <font-awesome-icon icon="user-minus" class="mr-1" />Confirm
                Unassign
              </b-button>
            </div>
          </b-card>
        </b-collapse>

        <!-- ── ASSIGN PANEL ── -->
        <b-collapse id="panel-assign" v-model="showAssignPanel">
          <b-card bg-variant="light" class="mt-2 border-success">
            <div class="section-header mb-3">
              <i class="fas fa-user-plus text-success"></i>
              <span class="section-title text-success ml-1">Assign Asset</span>
            </div>
            <b-row>
              <b-col md="6">
                <b-form-group label-size="sm" class="mb-0">
                  <label class="d-flex align-items-center mb-1">
                    <small>Accountable Employee</small>
                    <b-form-checkbox
                      v-model="actionDetails.sameAsActualUser"
                      class="ml-2 mb-0"
                      size="sm"
                    >
                      Same as Actual User
                    </b-form-checkbox>
                  </label>
                  <b-input-group>
                    <b-form-input
                      v-model="actionDetails.accountableEmployee"
                      placeholder="Insert Accountable Employee/Officer Here . . ."
                    ></b-form-input>
                    <b-input-group-append>
                      <b-button
                        size="sm"
                        variant="primary"
                        @click="openEmployeeModal('accountable')"
                      >
                        <font-awesome-icon icon="file" />
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label-size="sm" label="Actual User">
                  <b-input-group>
                    <b-form-input
                      v-model="actionDetails.actualUser"
                      placeholder="Insert Actual User Here . . ."
                    ></b-form-input>
                    <b-input-group-append>
                      <b-button
                        size="sm"
                        variant="primary"
                        @click="openEmployeeModalForAction('actual')"
                      >
                        <font-awesome-icon icon="file" />
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="6">
                <b-form-group label-size="sm" label="Department Assigned">
                  <v-select
                    v-model="actionDetails.departmentAssigned"
                    :options="departmentOptions"
                    placeholder="- Select Office -"
                    :reduce="(option) => option.value"
                    label="text"
                    size="sm"
                    clearable
                    :close-on-select="true"
                    :append-to-body="true"
                    :calculate-position="withPopper"
                  />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label-size="sm" label="Location">
                  <v-select
                    v-model="actionDetails.location"
                    :options="locationOptions"
                    placeholder="- Select Location -"
                    :reduce="(option) => option.value"
                    label="text"
                    size="sm"
                    clearable
                    :close-on-select="true"
                    :append-to-body="true"
                    :calculate-position="withPopper"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="6">
                <b-form-group label-size="sm" label="Asset's Condition">
                  <b-form-textarea
                    v-model="actionDetails.condition"
                    placeholder="Enter Condition Here (If Any)"
                    rows="3"
                    size="sm"
                  ></b-form-textarea>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label-size="sm" label="Remarks">
                  <b-form-textarea
                    v-model="actionDetails.remarks"
                    placeholder="Enter Remarks Here (If Any)"
                    rows="3"
                    size="sm"
                  ></b-form-textarea>
                </b-form-group>
              </b-col>
            </b-row>
            <div class="text-right">
              <b-button
                size="sm"
                class="greyBtn mr-2"
                @click="showAssignPanel = false"
                >Cancel</b-button
              >
              <b-button
                size="sm"
                class="primaryBtn"
                @click="confirmAssignAsset"
              >
                <font-awesome-icon icon="user-plus" class="mr-1" />Confirm
                Assign
              </b-button>
            </div>
          </b-card>
        </b-collapse>

        <!-- ── TRANSFER PANEL ── -->
        <b-collapse id="panel-transfer" v-model="showTransferPanel">
          <b-card bg-variant="light" class="mt-2 border-primary">
            <div class="section-header mb-3">
              <i class="fas fa-right-left text-primary"></i>
              <span class="section-title text-primary ml-1"
                >Transfer Asset</span
              >
            </div>
            <p class="text-muted small mb-3">
              Transfer from
              <strong>{{ assetDetails.EmployeeAssigned }}</strong> to a new
              assignee.
            </p>
            <b-row>
              <b-col md="6">
                <b-form-group label-size="sm" class="mb-0">
                  <label class="d-flex align-items-center mb-1">
                    <small>Accountable Employee</small>
                    <b-form-checkbox
                      v-model="actionDetails.sameAsActualUser"
                      class="ml-2 mb-0"
                      size="sm"
                    >
                      Same as Actual User
                    </b-form-checkbox>
                  </label>
                  <b-input-group>
                    <b-form-input
                      v-model="actionDetails.accountableEmployee"
                      placeholder="Insert Accountable Employee/Officer Here . . ."
                    ></b-form-input>
                    <b-input-group-append>
                      <b-button
                        size="sm"
                        variant="primary"
                        @click="openEmployeeModalForAction('accountable')"
                      >
                        <font-awesome-icon icon="file" />
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label-size="sm" label="Actual User">
                  <b-input-group>
                    <b-form-input
                      v-model="actionDetails.actualUser"
                      placeholder="Insert Actual User Here . . ."
                    ></b-form-input>
                    <b-input-group-append>
                      <b-button
                        size="sm"
                        variant="primary"
                        @click="openEmployeeModalForAction('actual')"
                      >
                        <font-awesome-icon icon="file" />
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="6">
                <b-form-group label-size="sm" label="New Department">
                  <v-select
                    v-model="actionDetails.departmentAssigned"
                    :options="departmentOptions"
                    placeholder="- Select Office -"
                    :reduce="(option) => option.value"
                    label="text"
                    size="sm"
                    clearable
                    :close-on-select="true"
                    :append-to-body="true"
                    :calculate-position="withPopper"
                  />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label-size="sm" label="New Location">
                  <v-select
                    v-model="actionDetails.location"
                    :options="locationOptions"
                    placeholder="- Select Location -"
                    :reduce="(option) => option.value"
                    label="text"
                    size="sm"
                    clearable
                    :close-on-select="true"
                    :append-to-body="true"
                    :calculate-position="withPopper"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="6">
                <b-form-group label-size="sm" label="Asset's Condition">
                  <b-form-textarea
                    v-model="actionDetails.condition"
                    placeholder="Enter Condition Here (If Any)"
                    rows="3"
                    size="sm"
                  ></b-form-textarea>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label-size="sm" label="Transfer Remarks">
                  <b-form-textarea
                    v-model="actionDetails.remarks"
                    placeholder="Enter Remarks Here (If Any)"
                    rows="3"
                    size="sm"
                  ></b-form-textarea>
                </b-form-group>
              </b-col>
            </b-row>
            <div class="text-right">
              <b-button
                size="sm"
                class="greyBtn mr-2"
                @click="showTransferPanel = false"
                >Cancel</b-button
              >
              <b-button
                size="sm"
                variant="primary"
                @click="confirmTransferAsset"
              >
                <font-awesome-icon icon="right-left" class="mr-1" />Confirm
                Transfer
              </b-button>
            </div>
          </b-card>
        </b-collapse>
      </b-container>
      <template v-slot:modal-footer>
        <div>
          <b-button size="sm" class="greyBtn mr-2" @click="closeModalView">
            Close
          </b-button>
        </div>
      </template>
    </b-modal>
    <!-- End View Details Modal -->

    <!-- ============================================================ -->
    <!-- Add Asset Modal                                              -->
    <!-- ============================================================ -->
    <b-modal
      no-close-on-backdrop
      header-class="assetColor"
      id="bv-modal-add-asset"
      title="Add Asset"
      size="xl"
      @close="cancelAssetDetails"
    >
      <b-container fluid>
        <div class="section-header">
            <i class="fas fa-chart-line"></i>
            <span class="section-title">Asset Details</span>
          </div>
        <b-row>
          <b-col cols="12">
            <b-form-group label-size="sm" label="Status">
              <b-form-input
                size="sm"
                v-model="assetInfo.status"
                value="Serviceable"
                readonly
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label-size="sm" label="Asset Account">
              <v-select
                v-model="assetInfo.assetAccount"
                :options="assetAccountOptions"
                placeholder="Select Account"
                :reduce="(option) => option.value"
                label="text"
                size="sm"
                clearable
                :close-on-select="true"
                :append-to-body="true"
                :calculate-position="withPopper"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-size="sm" label="Asset Category">
              <v-select
                v-model="assetInfo.assetCategory"
                :options="assetCategoryOptions"
                placeholder="Select Category"
                label="text"
                size="sm"
                :disabled="!assetInfo.assetAccount"
                clearable
                :close-on-select="true"
                :append-to-body="true"
                :calculate-position="withPopper"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label-size="sm" label="Asset Subcategory">
              <v-select
                v-model="assetInfo.assetSubcategory"
                :options="assetSubcategoryOptions"
                placeholder="Select Subcategory"
                :reduce="(option) => option.value"
                label="text"
                size="sm"
                :disabled="!assetInfo.assetCategory"
                clearable
                :close-on-select="true"
                :append-to-body="true"
                :calculate-position="withPopper"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-size="sm" label="Unit">
              <v-select
                v-model="assetInfo.unit"
                :options="unitOptions"
                placeholder="Nothing selected"
                :reduce="(option) => option.value"
                label="text"
                size="sm"
                clearable
                :close-on-select="true"
                :append-to-body="true"
                :calculate-position="withPopper"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label-size="sm" label="Asset Department">
              <v-select
                v-model="assetInfo.assetDepartment"
                :options="departmentOptions"
                placeholder="Nothing selected"
                :reduce="(option) => option.value"
                label="text"
                size="sm"
                clearable
                :close-on-select="true"
                :append-to-body="true"
                :calculate-position="withPopper"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-size="sm" label="Date Acquired">
              <b-form-input
                type="date"
                v-model="assetInfo.dateAcquired"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label-size="sm" label="Item Description">
              <b-form-textarea
                size="sm"
                v-model="assetInfo.itemDescription"
                placeholder="Enter Asset Description Here"
                rows="3"
              ></b-form-textarea>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-size="sm" label="Cost">
              <b-input-group>
                <b-input-group-prepend>
                  <b-input-group-text>PHP</b-input-group-text>
                </b-input-group-prepend>

                <b-form-input
                  type="text"
                  v-model="assetInfo.cost"
                  placeholder="Enter Asset Cost Here"
                  @input="formatCost"
                >
                </b-form-input>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col cols="12">
            <div class="d-flex align-items-center">
              <span>No Asset Warranty Available</span>
              <b-form-checkbox
                v-model="assetInfo.hasWarranty"
                name="has-warranty"
                value="true"
                unchecked-value="false"
                class="ml-3 mb-0"
              >
                Has Warranty
              </b-form-checkbox>
            </div>
          </b-col>
        </b-row>

        <b-row class="mb-4">
          <b-col cols="12">
            <div class="d-flex align-items-center">
              <b-form-checkbox
                v-model="assetInfo.removeAssignment"
                switch
                size="lg"
                class="mr-3"
              ></b-form-checkbox>
              <span class="font-weight-bold">Remove Asset Assignment</span>
            </div>
          </b-col>
        </b-row>

        <hr />

        <template v-if="!assetInfo.removeAssignment">
          <b-row class="mb-4">
            <b-col cols="12" class="text-center">
              <h5 class="section-title-custom">
                <i class="fas fa-user"></i> Assignment Details
              </h5>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <b-form-group label-size="sm" class="mb-0">
                <label class="d-flex align-items-center mb-1">
                  <small>Accountable Employee</small>
                  <b-form-checkbox
                    v-model="assetInfo.sameAsActualUser"
                    class="ml-2 mb-0"
                    size="sm"
                  >
                    Same as Actual User
                  </b-form-checkbox>
                </label>
                <b-input-group>
                  <b-form-input
                    v-model="assetInfo.accountableEmployee"
                    placeholder="Insert Accountable Employee/Officer Here . . ."
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button
                      size="sm"
                      variant="primary"
                      @click="openEmployeeModal('accountable')"
                    >
                      <font-awesome-icon icon="file" />
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label-size="sm" label="Actual User">
                <b-input-group>
                  <b-form-input
                    v-model="assetInfo.actualUser"
                    placeholder="Insert Actual User Here . . ."
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button
                      size="sm"
                      variant="primary"
                      @click="openEmployeeModal('actual')"
                    >
                      <font-awesome-icon icon="file" />
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <b-form-group label-size="sm" label="Department Assigned">
                <b-form-input
                  v-model="assetInfo.departmentAssigned"
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label-size="sm" label="Location">
                <v-select
                  v-model="assetInfo.location"
                  :options="locationOptions"
                  placeholder="Nothing selected"
                  :reduce="(option) => option.value"
                  label="text"
                  size="sm"
                  clearable
                  :close-on-select="true"
                  :append-to-body="true"
                />
              </b-form-group>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <b-form-group label-size="sm" label="Condition">
                <b-form-textarea
                  v-model="assetInfo.condition"
                  placeholder="Enter Condition Here (If Any)"
                  rows="4"
                ></b-form-textarea>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label-size="sm" label="Remarks">
                <b-form-textarea
                  v-model="assetInfo.remarks"
                  placeholder="Enter Remarks Here (If Any)"
                  rows="4"
                ></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </template>
      </b-container>

      <template v-slot:modal-footer>
        <div>
          <b-button size="sm" class="greyBtn mr-2" @click="cancelAssetDetails"
            >Cancel</b-button
          >
          <b-button size="sm" class="primaryBtn" @click="saveAssetChanges"
            >Save Asset</b-button
          >
        </div>
      </template>
    </b-modal>

    <!-- ============================================================ -->
    <!-- Edit Asset Modal                                             -->
    <!-- ============================================================ -->
    <b-modal
      no-close-on-backdrop
      header-class="assetColor"
      id="bv-modal-edit-asset"
      title="Edit Asset"
      size="xl"
      @close="cancelAssetDetails"
    >
      <b-container fluid>
        <div class="section-header">
          <i class="fas fa-chart-line"></i>
          <span class="section-title">Asset Details</span>
          <div class="property-no-badge">
            Property No: {{ assetInfo.PropertyNo }}
          </div>
          <b-button
            size="lg"
            variant="link"
            class="text-right"
            @click="showOtherDetailsModal"
            style="font-size: 1.5rem; color: #0b345f; padding: 0"
            v-b-tooltip.hover
            title="Other Details"
          >
            <font-awesome-icon icon="ellipsis" />
          </b-button>
        </div>
        <b-row>
          <b-col cols="12">
            <b-form-group label-size="sm" label="Status">
              <b-form-input
                size="sm"
                v-model="assetInfo.status"
                readonly
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label-size="sm" label="Asset Account">
              <v-select
                v-model="assetInfo.assetAccount"
                :options="assetAccountOptions"
                placeholder="Select Account"
                :reduce="(option) => option.value"
                label="text"
                size="sm"
                clearable
                :close-on-select="true"
                :append-to-body="true"
                :calculate-position="withPopper"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-size="sm" label="Asset Category">
              <v-select
                v-model="assetInfo.assetCategory"
                :options="assetCategoryOptions"
                placeholder="Select Category"
                label="text"
                size="sm"
                :disabled="!assetInfo.assetAccount"
                clearable
                :close-on-select="true"
                :append-to-body="true"
                :calculate-position="withPopper"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label-size="sm" label="Asset Subcategory">
              <v-select
                v-model="assetInfo.assetSubcategory"
                :options="assetSubcategoryOptions"
                placeholder="Select Subcategory"
                :reduce="(option) => option.value"
                label="text"
                size="sm"
                :disabled="!assetInfo.assetCategory"
                clearable
                :close-on-select="true"
                :append-to-body="true"
                :calculate-position="withPopper"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-size="sm" label="Unit">
              <v-select
                v-model="assetInfo.unit"
                :options="unitOptions"
                placeholder="Nothing selected"
                :reduce="(option) => option.value"
                label="text"
                size="sm"
                clearable
                :close-on-select="true"
                :append-to-body="true"
                :calculate-position="withPopper"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label-size="sm" label="Asset Department">
              <v-select
                v-model="assetInfo.assetDepartment"
                :options="departmentOptions"
                placeholder="Nothing selected"
                :reduce="(option) => option.value"
                label="text"
                size="sm"
                clearable
                :close-on-select="true"
                :append-to-body="true"
                :calculate-position="withPopper"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-size="sm" label="Date Acquired">
              <b-form-input
                type="date"
                v-model="assetInfo.dateAcquired"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label-size="sm" label="Item Description">
              <b-form-textarea
                size="sm"
                v-model="assetInfo.itemDescription"
                placeholder="Enter Asset Description Here"
                rows="3"
              ></b-form-textarea>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-size="sm" label="Cost">
              <b-input-group>
                <b-input-group-prepend>
                  <b-input-group-text>PHP</b-input-group-text>
                </b-input-group-prepend>

                <b-form-input
                  type="text"
                  v-model="assetInfo.cost"
                  placeholder="Enter Asset Cost Here"
                  @input="formatCost"
                >
                </b-form-input>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col cols="12">
            <div class="d-flex align-items-center">
              <span>No Asset Warranty Available</span>
              <b-form-checkbox
                v-model="assetInfo.hasWarranty"
                name="has-warranty"
                value="true"
                unchecked-value="false"
                class="ml-3 mb-0"
              >
                Has Warranty
              </b-form-checkbox>
            </div>
          </b-col>
        </b-row>

        <b-row class="mb-4">
          <b-col cols="12">
            <div class="d-flex align-items-center">
              <b-form-checkbox
                disabled
                v-model="assetInfo.removeAssignment"
                switch
                size="lg"
                class="mr-3"
              ></b-form-checkbox>
              <span class="font-weight-bold">Remove Asset Assignment</span>
            </div>
          </b-col>
        </b-row>

        <!-- <hr />

        <template v-if="!assetInfo.removeAssignment">
          <b-row class="mb-4">
            <b-col cols="12" class="text-center">
              <h5 class="section-title-custom">
                <i class="fas fa-user"></i> Assignment Details
              </h5>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <b-form-group label-size="sm" class="mb-0">
                <label class="d-flex align-items-center mb-1">
                  <small>Accountable Employee</small>
                  <b-form-checkbox
                    v-model="assetInfo.sameAsActualUser"
                    class="ml-2 mb-0"
                    size="sm"
                  >
                    Same as Actual User
                  </b-form-checkbox>
                </label>
                <b-input-group>
                  <b-form-input
                    v-model="assetInfo.accountableEmployee"
                    placeholder="Insert Accountable Employee/Officer Here . . ."
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button
                      size="sm"
                      variant="primary"
                      @click="openEmployeeModal('accountable')"
                    >
                      <font-awesome-icon icon="file" />
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label-size="sm" label="Actual User">
                <b-input-group>
                  <b-form-input
                    v-model="assetInfo.actualUser"
                    placeholder="Insert Actual User Here . . ."
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button
                      size="sm"
                      variant="primary"
                      @click="openEmployeeModal('actual')"
                    >
                      <font-awesome-icon icon="file" />
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <b-form-group label-size="sm" label="Department Assigned">
                <b-form-input
                  v-model="assetInfo.departmentAssigned"
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label-size="sm" label="Location">
                <v-select
                  v-model="assetInfo.location"
                  :options="locationOptions"
                  placeholder="Nothing selected"
                  :reduce="(option) => option.value"
                  label="text"
                  size="sm"
                  clearable
                  :close-on-select="true"
                  :append-to-body="true"
                  :calculate-position="withPopper"
                />
              </b-form-group>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <b-form-group label-size="sm" label="Condition">
                <b-form-textarea
                  v-model="assetInfo.condition"
                  placeholder="Enter Condition Here (If Any)"
                  rows="4"
                ></b-form-textarea>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label-size="sm" label="Remarks">
                <b-form-textarea
                  v-model="assetInfo.remarks"
                  placeholder="Enter Remarks Here (If Any)"
                  rows="4"
                ></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </template> -->
      </b-container>

      <template v-slot:modal-footer>
        <div>
          <b-button size="sm" class="greyBtn mr-2" @click="cancelAssetDetails"
            >Cancel</b-button
          >
          <b-button size="sm" class="primaryBtn" @click="saveAssetChanges">
            {{ isEditMode ? "Update Asset" : "Save Asset" }}
          </b-button>
        </div>
      </template>
    </b-modal>
    <!-- End Edit Modal -->

    <!-- ============================================================ -->
    <!-- View Other Details Modal                                     -->
    <!-- ============================================================ -->
    <b-modal
      no-close-on-backdrop
      header-class="assetColor"
      id="bv-modal-other-details"
      title="Other Details"
      size="md"
    >
      <b-container fluid>
        <b-row>
          <b-col md="12">
            <b-form-group label-size="sm" label="Supplier">
              <v-select
                v-model="additionalDetails.supplier"
                :options="supplierOptions"
                placeholder="Select Supplier"
                :reduce="(option) => option.value"
                label="text"
                size="sm"
                clearable
                :close-on-select="true"
                :append-to-body="true"
                :calculate-position="withPopper"
              />
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group label-size="sm" label="Manufacturer">
              <v-select
                v-model="additionalDetails.manufacturer"
                :options="manufacturerOptions"
                placeholder="Select Manufacturer"
                :reduce="(option) => option.value"
                label="text"
                size="sm"
                clearable
                :close-on-select="true"
                :append-to-body="true"
                :calculate-position="withPopper"
              />
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group label-size="sm" label="Asset Tag">
              <b-form-input
                size="sm"
                v-model="additionalDetails.assetTag"
                placeholder="Enter Asset Tag"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group label-size="sm" label="Serial Number">
              <b-form-input
                size="sm"
                v-model="additionalDetails.serialNumber"
                placeholder="Enter Serial Number"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group label-size="sm" label="Model">
              <b-form-input
                size="sm"
                v-model="additionalDetails.model"
                placeholder="Enter Model"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </b-container>

      <template v-slot:modal-footer>
        <div>
          <b-button
            size="sm"
            class="greyBtn mr-2"
            @click="closeOtherDetailsModal"
          >
            Cancel
          </b-button>
          <b-button size="sm" class="primaryBtn" @click="saveOtherDetails">
            {{ existingDetails && existingDetails.data && existingDetails.data.length > 0 ? 'Update' : 'Save Details' }}
          </b-button>
        </div>
      </template>
    </b-modal>

    <!-- ============================================================ -->
    <!-- Main Content                                                 -->
    <!-- ============================================================ -->
    <b-row>
      <b-col>
        <nav class="breadcrumb-container ml-4">
          <a href="#" class="breadcrumb-link">Home</a>
          <span class="breadcrumb-separator">▶</span>
          <span class="breadcrumb-current">Assets</span>
        </nav>
        <b-card class="cardProfile mainContent">
          <b-row>
            <b-col cols="12">
              <b-row class="align-items-center">
                <b-col cols="4">
                  <b-form-group label-size="sm" label="Search" class="mb-2">
                    <b-form-input
                      v-model="filter"
                      type="search"
                      id="filterEmpInput"
                      class="searchbar"
                      placeholder="Type to Search"
                      debounce="500"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="2">
                  <b-form-group label-size="sm" label="Status" class="mb-2">
                    <v-select
                      v-model="statusFilter"
                      :options="statusOptions"
                      placeholder="All Status"
                      :reduce="(option) => option.value"
                      label="text"
                      size="sm"
                      clearable
                      :close-on-select="true"
                      :append-to-body="true"
                      :calculate-position="withPopper"
                    />
                  </b-form-group>
                </b-col>
                <b-col cols="2">
                  <b-form-group label-size="sm" label="Account" class="mb-2">
                    <v-select
                      v-model="accountFilter"
                      :options="assetAccountOptions"
                      placeholder="All Accounts"
                      :reduce="(option) => option.value"
                      label="text"
                      size="sm"
                      clearable
                      :close-on-select="true"
                      :append-to-body="true"
                      :calculate-position="withPopper"
                    />
                  </b-form-group>
                </b-col>
                <b-col cols="2">
                  <b-form-group label-size="sm" label="Department" class="mb-2">
                    <v-select
                      v-model="departmentFilter"
                      :options="departmentOptions"
                      placeholder="All Departments"
                      :reduce="(option) => option.value"
                      label="text"
                      size="sm"
                      clearable
                      :close-on-select="true"
                      :append-to-body="true"
                      :calculate-position="withPopper"
                    />
                  </b-form-group>
                </b-col>
                <b-col
                  cols="2"
                  class="d-flex justify-content-end align-items-end mt-3"
                >
                  <b-button
                    class="defaultBtn"
                    size="sm"
                    v-b-tooltip.hover
                    title="Add new Asset"
                    @click="$bvModal.show('bv-modal-add-asset')"
                  >
                    <font-awesome-icon icon="circle-plus" class="icon" />
                    Add New Asset
                  </b-button>
                </b-col>
              </b-row>
            </b-col>
          </b-row>

          <b-row class="mt-2">
            <b-col
              cols="12"
              class="d-flex justify-content-between align-items-center"
            >
              <div class="d-flex align-items-center">
                <b-form-checkbox
                  v-model="selectAll"
                  @change="toggleSelectAll"
                  class="mr-3"
                >
                  <small>Select All</small>
                </b-form-checkbox>
                <b-button
                  v-if="selectedItems.length > 0"
                  variant="primary"
                  size="sm"
                  @click="generateMultipleQRCodes"
                >
                  <font-awesome-icon icon="qrcode" class="mr-2" />
                  Generate QR Codes ({{ selectedItems.length }})
                </b-button>
              </div>
            </b-col>
          </b-row>

          <!-- table assets -->
          <b-table
            id="assetTable"
            ref="assetTable"
            class="tableAsset mt-4"
            style="font-size: 12px"
            head-variant="light"
            show-empty
            stacked="md"
            small
            sticky-header
            no-border-collapse
            hover
            selectable
            select-mode="multi"
            :items="paginatedItems"
            :fields="fields"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            :busy.sync="isBusy"
            @row-clicked="onRowClicked"
          >
            <template v-slot:cell(selected)="row">
              <b-form-checkbox
                v-if="row.item.AssetTag"
                v-model="row.item.selected"
                @change="toggleSelection(row.item)"
              ></b-form-checkbox>
            </template>
            <template #table-busy>
              <div class="text-center text-secondary my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>&nbsp;Loading...</strong>
              </div>
            </template>
            <template v-slot:cell(Category)="row">
              <b>{{ row.item.Subcategory }}</b
              ><br />
              <small>{{
                row.item.Category ? `(${row.item.Category})` : ""
              }}</small>
            </template>
            <template v-slot:cell(AccountTitle)="row">
              <b>{{ row.item.AccountCode }}</b
              ><br />
              <small>{{ row.item.AccountTitle }}</small>
            </template>
            <template v-slot:cell(PropertyNo)="row">
              <b>{{ row.item.PropertyNo }}</b>
              <br />
              <small v-if="row.item.AssetTag">Asset Tag: {{ row.item.AssetTag }}</small>
            </template>
            <template v-slot:cell(IsAssigned)="row">
              <b-form-checkbox
                v-model="row.item.IsAssigned"
                :checked="row.item.IsAssigned"
                disabled
                class="mr-2"
              ></b-form-checkbox>
            </template>
            <template v-slot:cell(actions)="row">
              <b-dropdown class="dropdownBtn" right variant="link" no-caret>
                <template #button-content>
                  <font-awesome-icon icon="bars" />
                </template>
                <b-dropdown-header class="dropdown-header"
                  >Actions</b-dropdown-header
                >
                <b-dropdown-item-button @click="openEditModal(row)">
                  <font-awesome-icon
                    icon="pen-to-square"
                    class="viewIcon mr-2"
                    small
                  />View/Edit Asset
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="viewMaintenance(row)">
                  <font-awesome-icon
                    icon="gear"
                    class="viewIcon mr-2"
                    small
                  />View Maintenance
                </b-dropdown-item-button>
              </b-dropdown>
            </template>
            <template v-slot:table-caption>
              <b-row align-h="end">
                <b-col cols="6">{{ bottomLabel }}</b-col>
                <b-col cols="6">
                  <b-pagination
                    v-model="currentPage"
                    class="mr-2"
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

    <b-alert
      :show="alert.showAlert"
      dismissible
      :variant="alert.variant"
      @dismissed="alert.showAlert = null"
    >
      <font-awesome-icon
        :icon="
          alert.variant == 'success' ? 'circle-check' : 'circle-exclamation'
        "
        class="mr-1 alert-font"
      />
      {{ alert.message }}
    </b-alert>
  </div>
</template>

<script>
import axios from "axios";
import Loading from "@/components/LoadingOverlay/Loading";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import moment from "moment";
import QRCode from "qrcode";
import vSelect from "vue-select";
import { createPopper } from "@popperjs/core";

export default {
  components: {
    FontAwesomeIcon,
    vSelect,
    Loading,
  },

  data() {
    return {
      showLoading: false,
      currentPage: 1,
      perPage: 10,
      isBusy: false,
      sortDesc: false,
      sortDirection: "asc",
      sortBy: "PropertyNo",
      filter: "",
      statusFilter: null,
      accountFilter: null,
      departmentFilter: null,
      selectedItems: [],
      selectAll: false,
      statusOptions: [],
      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },
      fields: [
        {
          key: "selected",
          label: "",
          class: "text-center",
          thStyle: { width: "5%" },
        },
        {
          key: "AccountTitle",
          label: "Account Title",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
          thStyle: { width: "20%" },
        },
        {
          key: "Category",
          label: "Subcategory",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
          thStyle: { width: "20%" },
        },
        {
          key: "Description",
          label: "Description",
          sortable: true,
          sortDirection: "desc",
          thStyle: { width: "30%" },
          class: "text-left",
        },
        {
          key: "PropertyNo",
          label: "Property No.",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        {
          key: "Status",
          label: "Status",
          sortable: true,
          sortDirection: "desc",
          class: "text-left",
        },
        { key: "IsAssigned", label: "Assigned", class: "text-center" },
        { key: "actions", label: "", sortable: true, class: "text-center" },
      ],
      assetInfo: {
        status: "Serviceable",
        assetAccount: null,
        assetCategory: null,
        assetSubcategory: null,
        assetTag: "",
        unit: null,
        assetDepartment: null,
        dateAcquired: "",
        itemDescription: "",
        cost: null,
        noWarranty: "false",
        hasWarranty: "false",
        removeAssignment: false,
        accountableEmployee: "",
        accountableEmployeeID: "",
        actualUser: "",
        actualUserID: "",
        sameAsActualUser: false,
        departmentAssigned: null,
        location: null,
        condition: "",
        remarks: "",
        itemHdrId: null,
        ItemDtlId:null,
        PropertyNo: ""
      },
      assetDetails: [],
      assetList: [],
      assignmentDetails: [],
      unitOptions: [],
      employeeOptions: [],
      employeeList: [],
      isEmployeeBusy: false,
      employeeFilter: "",
      employeePerPage: 20,
      employeeCurrentPage: 1,
      lastClickedField: null,
      // Track which context the employee modal was opened from
      // 'addEdit' = from add/edit modal, 'action' = from assign/transfer panel
      employeeModalContext: "addEdit",
      employeeFields: [
        {
          key: "AccountName",
          label: "Name",
          sortable: true,
          class: "text-left",
        },
        {
          key: "DeptDesc",
          label: "Department",
          sortable: true,
          class: "text-left",
        },
      ],
      // Panels for View Details modal actions
      showUnassignPanel: false,
      showAssignPanel: false,
      showTransferPanel: false,
      // Shared action details object used by Assign / Transfer / Unassign panels
      actionDetails: {
        accountableEmployee: "",
        accountableEmployeeID: null,
        actualUser: "",
        actualUserID: null,
        sameAsActualUser: false,
        departmentAssigned: null,
        location: null,
        condition: "",
        remarks: "",
        unassignRemarks: "",
      },
      locationOptions: [],
      assetAccountOptions: [],
      assetCategoryOptions: [],
      assetSubcategoryOptions: [],
      departmentOptions: [],
      isEditMode: false,
      // Additional Details Modal Data
      additionalDetails: {
        supplier: null,
        manufacturer: null,
        assetTag: "",
        serialNumber: "",
        model: "",
      },
      existingDetails: null,
      forUpdate: false,
      supplierOptions: [],
      manufacturerOptions: [],
      // Supplier/Manufacturer filter properties
      isActive: 1,
      filter: "",
    };
  },

  async created() {
    await this.getAccounts();
    await this.getStatusOptions();
    await this.getUnits();
    await this.getLocations();
    await this.getDepartments();
    await this.getSuppliers();
    await this.getManufacturers();
  },

  computed: {
    filteredItems() {
      let items = this.assetList;
      
      // Apply search filter first
      if (this.searchQuery) {
        const searchLower = this.searchQuery.toLowerCase();
        items = items.filter((item) => {
          return (
            item.Description?.toLowerCase().includes(searchLower) ||
            item.PropertyNo?.toString().toLowerCase().includes(searchLower) ||
            item.AccountTitle?.toLowerCase().includes(searchLower) ||
            item.OfficeName?.toLowerCase().includes(searchLower) ||
            item.Status?.toLowerCase().includes(searchLower) ||
            item.AssetTag?.toString().toLowerCase().includes(searchLower) ||
            item.SerialNumber?.toString().toLowerCase().includes(searchLower) ||
            item.Model?.toString().toLowerCase().includes(searchLower)
          );
        });
      }
      
      // Apply other filters
      if (this.statusFilter) {
        items = items.filter((item) => item.Status === this.statusFilter);
      }
      if (this.accountFilter) {
        items = items.filter(
          (item) => item.AccountTitle === this.accountFilter
        );
      }
      if (this.departmentFilter) {
        items = items.filter(
          (item) => item.OfficeName === this.departmentFilter
        );
      }
      return items;
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredItems.slice(start, start + this.perPage);
    },
    totalRows() {
      return this.filteredItems.length;
    },
    bottomLabel() {
      let end = this.perPage * this.currentPage;
      let start = end - this.perPage + 1;
      if (end > this.filteredItems.length) end = this.filteredItems.length;
      if (this.filteredItems.length === 0) start = 0;
      return `Showing ${start} to ${end} of ${this.filteredItems.length} entries`;
    },
    filteredEmployees() {
      if (!this.employeeFilter) return this.employeeList;
      const f = this.employeeFilter.toLowerCase();
      return this.employeeList.filter(
        (emp) =>
          (emp.AccountName && emp.AccountName.toLowerCase().includes(f)) ||
          (emp.DeptDesc && emp.DeptDesc.toLowerCase().includes(f))
      );
    },
    paginatedEmployees() {
      const start = (this.employeeCurrentPage - 1) * this.employeePerPage;
      return this.filteredEmployees.slice(start, start + this.employeePerPage);
    },
    accountableEmployeeDisplay: {
      get() {
        return this.assetInfo.accountableEmployee || "";
      },
      set(value) {
        this.assetInfo.accountableEmployee = value;
      },
    },
    actualUserDisplay: {
      get() {
        return this.assetInfo.actualUser || "";
      },
      set(value) {
        this.assetInfo.actualUser = value;
      },
    },
  },

  watch: {
    filter: {
      handler() {
        this.getAllAssets();
      },
      immediate: true,
    },
    statusFilter() {
      this.currentPage = 1;
    },
    accountFilter() {
      this.currentPage = 1;
      this.getAllAssets();
    },
    departmentFilter() {
      this.currentPage = 1;
    },
    employeeFilter: {
      handler() {
        if (this.employeeList.length > 0 || this.employeeFilter === "") {
          this.getEmployees();
        }
      },
      immediate: false,
    },
    "assetInfo.assetAccount": {
      handler(newValue, oldValue) {
        // Clear dependent fields when account changes
        this.assetInfo.assetCategory = null;
        this.assetInfo.assetSubcategory = null;
        this.assetCategoryOptions = [];
        this.assetSubcategoryOptions = [];
        // Load categories for new account if account is selected
        if (newValue) {
          this.getCategories();
        }
      },
      deep: true,
    },
    "assetInfo.assetCategory": {
      handler(newValue, oldValue) {
        // Clear dependent field when category changes
        this.assetInfo.assetSubcategory = null;
        this.assetSubcategoryOptions = [];
        // Load subcategories for new category if category is selected
        if (newValue) {
          this.getSubcategories();
        }
      },
      deep: true,
    },
    "assetInfo.sameAsActualUser"(newValue) {
      if (newValue) {
        this.assetInfo.actualUser = this.assetInfo.accountableEmployee;
        this.assetInfo.actualUserID = this.assetInfo.accountableEmployeeID;
      } else {
        this.assetInfo.actualUser = "";
        this.assetInfo.actualUserID = null;
      }
    },
    "actionDetails.sameAsActualUser"(newValue) {
      if (newValue) {
        this.actionDetails.actualUser = this.actionDetails.accountableEmployee;
        this.actionDetails.actualUserID =
          this.actionDetails.accountableEmployeeID;
      } else {
        this.actionDetails.actualUser = "";
        this.actionDetails.actualUserID = null;
      }
    },
  },

  methods: {
    withPopper(dropdownList, component, { width }) {
      dropdownList.style.width = width; 
      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: 'bottom-start', 
        modifiers: [
          { name: 'offset', options: { offset: [0, 2] } },
          {
            name: 'toggleClass',
            enabled: true,
            phase: 'write',
            fn({ state }) {
              component.$el.classList.toggle('drop-up', state.placement === 'top');
            },
          },
        ],
      });
      return () => popper.destroy();
    },

    formatDate(date) {
      return moment(date).format("MMMM D, YYYY");
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("en-PH", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
    formatCost(value) {
      // Remove non-numeric characters except decimal point
      let cleanValue = value.replace(/[^0-9.]/g, '');
      
      // Remove multiple decimal points
      const parts = cleanValue.split('.');
      if (parts.length > 2) {
        cleanValue = parts[0] + '.' + parts.slice(1).join('');
      }
      
      // Format as currency
      if (cleanValue) {
        const numValue = parseFloat(cleanValue);
        if (!isNaN(numValue)) {
          this.assetInfo.cost = new Intl.NumberFormat("en-PH", {
            style: "decimal",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }).format(numValue);
        }
      } else {
        this.assetInfo.cost = '';
      }
    },
    showAlert(message, variant) {
      this.alert = { showAlert: 3, variant, message };
    },

    // ── API calls ──────────────────────────────────────────────────────────
    async getAccounts() {
      try {
        const res = await this.$axios.get(
          `${this.$axios.defaults.baseURL}/file-maintenance/accounts/get-all-GenBOS`
        );
        this.assetAccountOptions = res.data
          .map((a) => ({ value: a.value, text: a.text }))
          .sort((a, b) => a.text.localeCompare(b.text));
      } catch (error) {
        console.error("Failed to load accounts", error);
      }
    },
    async getCategories() {
      if (!this.assetInfo.assetAccount) {
        this.assetCategoryOptions = [];
        return;
      }
      try {
        const res = await this.$axios.get(
          `${this.$axios.defaults.baseURL}/admin/SMS/get-account-category?RefAccountId=${this.assetInfo.assetAccount}`
        );
        this.assetCategoryOptions = res.data
          .map((c) => ({
            value: c.account_category_id,
            text: c.account_category_description,
          }))
          .sort((a, b) => a.text.localeCompare(b.text));
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    },
    async getSubcategories() {
      if (!this.assetInfo.assetCategory) {
        this.assetSubcategoryOptions = [];
        return;
      }
      try {
        const res = await this.$axios.get(
          `${this.$axios.defaults.baseURL}/file-maintenance/subcategory/get-all-by-category-id/?RefCategoryId=${this.assetInfo.assetCategory}`
        );
        this.assetSubcategoryOptions = res.data
          .map((s) => ({ value: s.subcategory_id, text: s.subcategory_desc }))
          .sort((a, b) => a.text.localeCompare(b.text));
      } catch (error) {
        console.error("Failed to load subcategories", error);
      }
    },
    async getSuppliers() {
      this.isBusy = true;
      this.showLoading = true;
      try {
        const res = await this.$axios.get(
          `${
            this.$axios.defaults.baseURL
          }/file-maintenance/suppliers/get-all/?isActive=${
            this.isActive
          }&supplier=${this.filter || ""}`
        );
        this.supplierOptions = res.data
          .map((s) => ({ value: s.supplier_id, text: s.supplier_name }))
          .sort((a, b) => a.text.localeCompare(b.text));
      } catch (error) {
        console.error("Failed to load suppliers", error);
        this.alert = {
          showAlert: true,
          variant: "danger",
          message: "Failed to load suppliers data",
        };
      } finally {
        this.isBusy = false;
        this.showLoading = false;
      }
    },
    async getManufacturers() {
      this.isBusy = true;
      this.showLoading = true;
      try {
        const res = await this.$axios.get(
          `${
            this.$axios.defaults.baseURL
          }/file-maintenance/manufacturers/get-all?manufacturer=${
            this.filter || ""
          }&isActive=${this.isActive}`
        );
        this.manufacturerOptions = res.data
          .map((m) => ({ value: m.manufacturer_id, text: m.manufacturer_name }))
          .sort((a, b) => a.text.localeCompare(b.text));
      } catch (error) {
        console.error("Failed to load manufacturers", error);
        this.alert = {
          showAlert: true,
          variant: "danger",
          message: "Failed to load manufacturers data",
        };
      } finally {
        this.isBusy = false;
        this.showLoading = false;
      }
    },
    async getStatusOptions() {
      try {
        const res = await this.$axios.get(
          `${this.$axios.defaults.baseURL}/file-maintenance/status/get-all`
        );
        this.statusOptions = res.data
          .map((s) => ({ value: s.status, text: s.status }))
          .sort((a, b) => a.text.localeCompare(b.text));
      } catch (error) {
        console.error("Failed to load status options", error);
      }
    },
    async getUnits() {
      try {
        const res = await this.$axios.get(
          `${this.$axios.defaults.baseURL}/file-maintenance/units/get-all`
        );
        this.unitOptions = res.data
          .map((u) => ({ value: u.unit_id, text: u.unit_description }))
          .sort((a, b) => a.text.localeCompare(b.text));
      } catch (error) {
        console.error("Failed to load unit options", error);
      }
    },
    async getLocations() {
      try {
        const res = await this.$axios.get(
          `${this.$axios.defaults.baseURL}/admin/locations/get-all`
        );
        this.locationOptions = res.data
          .map((l) => ({ value: l.location_id, text: l.location }))
          .sort((a, b) => a.text.localeCompare(b.text));
      } catch (error) {
        console.error("Failed to load location options", error);
      }
    },
    async getDepartments() {
      try {
        const res = await this.$axios.get(
          `${this.$axios.defaults.baseURL}/admin/BOS/get-func-offices`
        );
        this.departmentOptions = res.data
          .map((o) => ({
            value: o.FuncPerOfficeId || o.Func_per_Office_ID,
            text: o.FuncOffice,
          }))
          .sort((a, b) => a.text.localeCompare(b.text));
      } catch (error) {
        console.error("Failed to load department filter options", error);
      }
    },
    async getEmployees() {
      this.isEmployeeBusy = true;
      try {
        const res = await this.$axios.get(
          `${
            this.$axios.defaults.baseURL
          }/admin/HRMS/get-employees?IsAssigned=1&IsAll=0&text=${
            this.employeeFilter || ""
          }`
        );
        this.employeeList = res.data;
        this.$bvModal.show("bv-modal-employee-selection");
      } catch (error) {
        console.error("Failed to load employee options", error);
        this.showAlert("Failed to load employees", "danger");
      } finally {
        this.isEmployeeBusy = false;
      }
    },
    async getAllAssets() {
      this.isBusy = true;
      this.showLoading = true;
      try {
        let url = `${this.$axios.defaults.baseURL}/items/get-filter?text=${this.filter}`;
        if (this.accountFilter) url += `&accountTitle=${this.accountFilter}`;
        const res = await this.$axios.get(url);
        this.assetList = res.data || [];
      } catch (error) {
        console.error("Failed to load Assets", error);
      } finally {
        this.isBusy = false;
        this.showLoading = false;
      }
    },

    // ── Row / Modal actions ────────────────────────────────────────────────
    async onRowClicked(item) {
      if (item) {
        try {
          // Fetch detailed item data
          const res = await this.$axios.get(
            `${this.$axios.defaults.baseURL}/items/get-one?ItemHdrId=${item.ItemHdrId}`
          );
          this.assetDetails = res.data;
          console.log("Fetched asset details:", this.assetDetails);

          // Reset all panels
          this.showUnassignPanel = false;
          this.showAssignPanel = false;
          this.showTransferPanel = false;
          this.resetActionDetails();
          this.$bvModal.show("bv-modal-asset-details");
        } catch (error) {
          console.error("Failed to fetch asset details", error);
          this.showAlert("Failed to load asset details", "danger");
        }
      }
    },

    // ── FIX: Load categories then subcategories sequentially ──────────────
    async openEditModal(row) {
      this.isEditMode = true;
      console.log(row);

      this.assetInfo = {
        ...this.assetInfo,
        itemId: row.item.ItemHdrId,
        itemHdrId: row.item.ItemHdrId,
        assetAccount: row.item.RefAccountId,
        assetCategory: null,
        assetSubcategory: null,
        unit: row.item.UnitId,
        assetDepartment: String(row.item.FuncPerOfficeId),
        dateAcquired: row.item.DateAcquired
          ? row.item.DateAcquired.split("T")[0]
          : "",
        itemDescription: row.item.Description || "",
        cost: this.formatCurrency(row.item.UnitCost),
        status: this.getStatusText(row.item.StatusId),
        assetTag: row.item.AssetTag || "",
        remarks: row.item.Remarks || "",
        accountableEmployee: row.item.EmployeeAssigned || "",
        actualUser: row.item.EmployeeUser || "",
        departmentAssigned: row.item.OfficeName || "",
        location: row.item.LocationId,
        condition: row.item.Condition || "",
        removeAssignment: !row.item.IsAssigned,
        ItemDtlId: row.item.ItemDtlId || null,
        PropertyNo: row.item.PropertyNo || "",
      };

      this.additionalDetails = {
        supplier: row.item.SupplierId || null,
        manufacturer: row.item.ManufacturerId || null,
        assetTag: row.item.AssetTag || "",
        serialNumber: row.item.SerialNumber || "",
        model: row.item.Model || "",
      };
      
      // Check if any additional details exist to determine update vs insert
      const hasExistingData = 
        this.additionalDetails.supplier ||
        this.additionalDetails.manufacturer ||
        this.additionalDetails.assetTag ||
        this.additionalDetails.serialNumber ||
        this.additionalDetails.model;
      
      this.forUpdate = hasExistingData;
      console.log("Additional details found:", hasExistingData);

      await this.getCategories();
      // Find the category option object that matches the RefCategoryId
      const categoryOption = this.assetCategoryOptions.find(option => option.value === row.item.RefCategoryId);
      this.assetInfo.assetCategory = categoryOption || null;

      await this.getSubcategories();
      // Find the subcategory option object that matches the SubcategoryId
      const subcategoryOption = this.assetSubcategoryOptions.find(option => option.value === row.item.SubcategoryId);
      this.assetInfo.assetSubcategory = subcategoryOption || null;

      this.$bvModal.show("bv-modal-edit-asset");
    },

    // ── Employee modal helpers ─────────────────────────────────────────────
    openEmployeeModal(field) {
      this.lastClickedField = field;
      this.employeeModalContext = "addEdit";
      this.employeeFilter = "";
      this.employeeCurrentPage = 1;
      this.getEmployees();
    },
    openEmployeeModalForAction(field) {
      this.lastClickedField = field;
      this.employeeModalContext = "action";
      this.employeeFilter = "";
      this.employeeCurrentPage = 1;
      this.getEmployees();
    },
    closeEmployeeModal() {
      this.employeeFilter = "";
      this.employeeCurrentPage = 1;
      this.employeeList = [];
      this.lastClickedField = null;
      this.$bvModal.hide("bv-modal-employee-selection");
    },
    showOtherDetailsModal() {
      this.$bvModal.show("bv-modal-other-details");
    },
    closeOtherDetailsModal() {
      this.$bvModal.hide("bv-modal-other-details");
    },
    async saveOtherDetails() {
      try {
        // Use the forUpdate flag to determine update vs insert
        let res;
        if (this.forUpdate) {
          // Update existing details
          res = await axios({
            method: "PUT",
            url: `${this.$axios.defaults.baseURL}/items/update-details/${this.assetInfo.ItemDtlId}`,
            data: {
              SupplierId: this.additionalDetails.supplier || null,
              ManufacturerId: this.additionalDetails.manufacturer || null,
              SerialNumber: this.additionalDetails.serialNumber || "",
              Model: this.additionalDetails.model || "",
              DisposalId: null,
              Proceeds: 0,
              Reason: "",
              AssetTag: this.additionalDetails.assetTag || "",
              ItemHdrId: this.assetInfo.itemHdrId || "",
              user_id: localStorage.id || ""
            },
            headers: {
              "Content-Type": "application/json"
            }
          });
        } else {
          // Insert new details
          res = await axios({
            method: "POST",
            url: `${this.$axios.defaults.baseURL}/items/insert-details`,
            data: {
              SupplierId: this.additionalDetails.supplier || null,
              ManufacturerId: this.additionalDetails.manufacturer || null,
              SerialNumber: this.additionalDetails.serialNumber || "",
              Model: this.additionalDetails.model || "",
              DisposalId: null,
              Proceeds: 0,
              Reason: "",
              AssetTag: this.additionalDetails.assetTag || "",
              ItemHdrId: this.assetInfo.itemHdrId || "",
              user_id: localStorage.id || ""
            },
            headers: {
              "Content-Type": "application/json"
            }
          });
        }
        
        this.showAlert("Other details saved successfully!", "success");
        this.closeOtherDetailsModal();
      } catch (error) {
        console.error("Failed to save other details", error);
        this.showAlert("Failed to save other details", "danger");
      }
    },
    onEmployeeSelected(items) {
      if (items && items.length > 0) {
        const emp = items[0];
        const name = emp.AccountName || emp.name;
        const empId = emp.EmpId || emp.id || emp.AccountId;

        if (this.employeeModalContext === "action") {
          // Assign / Transfer panels
          if (this.lastClickedField === "accountable") {
            this.actionDetails.accountableEmployee = name;
            this.actionDetails.accountableEmployeeID = empId;
            if (this.actionDetails.sameAsActualUser) {
              this.actionDetails.actualUser = name;
              this.actionDetails.actualUserID = empId;
            }
          } else {
            this.actionDetails.actualUser = name;
            this.actionDetails.actualUserID = empId;
          }
        } else {
          // Add / Edit modals - store as object for display and value
          if (this.lastClickedField === "accountable") {
            this.assetInfo.accountableEmployee = name;
            this.assetInfo.accountableEmployeeID = empId;
            if (this.assetInfo.sameAsActualUser) {
              this.assetInfo.actualUser = name;
              this.assetInfo.actualUserID = empId;
            }
          } else {
            this.assetInfo.actualUser = name;
            this.assetInfo.actualUserID = empId;
          }
        }

        this.$bvModal.hide("bv-modal-employee-selection");
        this.lastClickedField = null;
      }
    },

    // ── Assign / Transfer / Unassign panel toggles ────────────────────────
    showAssignNewSection() {
      this.resetActionDetails();
      this.showUnassignPanel = false;
      this.showTransferPanel = false;
      this.showAssignPanel = !this.showAssignPanel;
    },
    showTransferSection() {
      this.resetActionDetails();
      this.showUnassignPanel = false;
      this.showAssignPanel = false;
      this.showTransferPanel = !this.showTransferPanel;
    },
    showUnassignSection() {
      this.resetActionDetails();
      this.showAssignPanel = false;
      this.showTransferPanel = false;
      this.showUnassignPanel = !this.showUnassignPanel;
    },
    resetActionDetails() {
      this.actionDetails = {
        accountableEmployee: "",
        accountableEmployeeID: null,
        actualUser: "",
        actualUserID: null,
        sameAsActualUser: false,
        departmentAssigned: null,
        location: null,
        condition: "",
        remarks: "",
        unassignRemarks: "",
      };
    },

    // ── Confirm actions ───────────────────────────────────────────────────
    async confirmAssignAsset() {
      try {
        const assignmentData = {
          ItemHdrId: this.assetDetails.ItemHdrId || null,
          IsTransfer: false,
          AssignmentId: null,
          AssignedEmpId: this.actionDetails.accountableEmployeeID || "",
          EmployeeAssigned: this.actionDetails.accountableEmployee || "",
          UserEmpId: this.actionDetails.actualUserID,
          EmployeeUser: this.actionDetails.actualUser || "",
          AssignedFuncPerOfficeId:
            this.actionDetails.departmentAssigned || null,
          LocationId: this.actionDetails.location || null,
          Condition: this.actionDetails.condition || "",
          Remarks: this.actionDetails.remarks || "",
          CreatedBy: localStorage.id,
          UpdatedBy: localStorage.id,
        };
        await this.$axios.post(
          `${this.$axios.defaults.baseURL}/items/assign`,
          assignmentData
        );
        this.showAlert("Asset assigned successfully!", "success");
        this.showAssignPanel = false;
        this.$bvModal.hide("bv-modal-asset-details");
        this.getAllAssets();
      } catch (error) {
        console.error("Failed to assign asset", error);
        this.showAlert("Failed to assign asset", "danger");
      }
    },
    async confirmTransferAsset() {
      try {
        const assignmentData = {
          ItemHdrId: this.assetDetails.ItemHdrId || null,
          IsTransfer: false,
          AssignmentId: null,
          AssignedEmpId: this.actionDetails.accountableEmployeeID || "",
          EmployeeAssigned: this.actionDetails.accountableEmployee || "",
          UserEmpId: this.actionDetails.actualUserID,
          EmployeeUser: this.actionDetails.actualUser || "",
          AssignedFuncPerOfficeId:
            this.actionDetails.departmentAssigned || null,
          LocationId: this.actionDetails.location || null,
          Condition: this.actionDetails.condition || "",
          Remarks: this.actionDetails.remarks || "",
          CreatedBy: localStorage.id,
          UpdatedBy: localStorage.id,
        };
        await this.$axios.post(
          `${this.$axios.defaults.baseURL}/items/assign`,
          assignmentData
        );
        this.showAlert("Asset transferred successfully!", "success");
        this.showTransferPanel = false;
        this.$bvModal.hide("bv-modal-asset-details");
        this.getAllAssets();
      } catch (error) {
        console.error("Failed to transfer asset", error);
        this.showAlert("Failed to transfer asset", "danger");
      }
    },
    async confirmUnassignAsset() {
      try {
        await this.$axios.put(
          `${this.$axios.defaults.baseURL}/items/unassign/${this.assetDetails.AssignmentId}`,
          {
            EmployeeAssigned: this.assetDetails.EmployeeAssigned || "",
            EmployeeUser: this.assetDetails.EmployeeUser || "",
            UpdatedBy: localStorage.id,
          }
        );
        this.showAlert("Asset unassigned successfully!", "success");
        this.showUnassignPanel = false;
        this.$bvModal.hide("bv-modal-asset-details");
        this.getAllAssets();
      } catch (error) {
        console.error("Failed to unassign asset", error);
        this.showAlert("Failed to unassign asset", "danger");
      }
    },

    // ── Selection helpers ─────────────────────────────────────────────────
    toggleSelection(item) {
      if (item.selected) {
        if (!this.selectedItems.find((s) => s.AssetTag === item.AssetTag)) {
          this.selectedItems.push(item);
        }
      } else {
        this.selectedItems = this.selectedItems.filter(
          (s) => s.AssetTag !== item.AssetTag
        );
      }
      this.selectAll = this.selectedItems.length === this.paginatedItems.length;
    },
    toggleSelectAll(value) {
      this.paginatedItems.forEach((item) => {
        item.selected = value;
      });
      this.selectedItems = value ? [...this.paginatedItems] : [];
    },

    // ── QR Code ───────────────────────────────────────────────────────────
    generateMultipleQRCodes() {
      if (this.selectedItems.length === 0) {
        this.$bvToast.toast("Please select at least one item", {
          title: "Warning",
          variant: "warning",
          solid: true,
        });
        return;
      }
      const qrPromises = this.selectedItems.map((item) => {
        const assetTag = item.AssetTag;
        if (!assetTag) return Promise.resolve(null);
        return QRCode.toDataURL(assetTag, {
          width: 200,
          margin: 1,
          color: { dark: "#000000", light: "#FFFFFF" },
        }).then((url) => ({ assetTag, url }));
      });
      Promise.all(qrPromises)
        .then((results) => {
          const validResults = results.filter((r) => r !== null);
          if (validResults.length === 0) {
            this.$bvToast.toast(
              "No valid Property No. found in selected items",
              { title: "Error", variant: "danger", solid: true }
            );
            return;
          }
          const printContent = this.generateMultiplePrintContent(validResults);
          const printWindow = window.open("", "_blank");
          printWindow.document.write(printContent);
          printWindow.document.close();
          printWindow.onload = function () {
            printWindow.print();
            printWindow.close();
          };
        })
        .catch((error) => {
          console.error("Error generating QR codes:", error);
          this.$bvToast.toast("Failed to generate QR codes", {
            title: "Error",
            variant: "danger",
            solid: true,
          });
        });
    },
    generateMultiplePrintContent(qrData) {
      const qrCodesHtml = qrData
        .map(
          ({ assetTag, url }) => `
        <div class="sticker-item">
          <div class="sticker-container">
            <div class="details-column">
              <div class="logo-header"><img src="city_logo.png" class="logo-img" alt="LOGO"></div>
              <div class="city-label">City Government of Koronadal</div>
              <div class="info-section">
                <div class="property-no">${assetTag}</div>
                <div class="asset-label">Asset Property</div>
              </div>
            </div>
            <div class="qr-container"><img src="${url}" alt="QR"></div>
          </div>
        </div>
      `
        )
        .join("");
      return `<!DOCTYPE html><html><head><title>Multiple QR Codes</title><style>
        @page { size: 70mm 30mm; margin: 0; }
        html, body { width: 70mm; height: auto; margin: 0; padding: 0; background-color: white; font-family: Arial, sans-serif; }
        .sticker-container { width: 70mm; height: 30mm; display: flex; flex-direction: row; align-items: center; justify-content: space-between; box-sizing: border-box; padding: 1.5mm; }
        .details-column { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center; overflow: hidden; }
        .logo-header { height: 7mm; margin-bottom: 1mm; }
        .logo-img { max-height: 100%; object-fit: contain; }
        .city-label { font-size: 6pt; font-weight: bold; text-transform: uppercase; border-bottom: 0.5pt solid black; width: 90%; padding-bottom: 0.5mm; margin-bottom: 1.5mm; line-height: 1; }
        .property-no { font-size: 11pt; font-family: 'Arial Black', sans-serif; font-weight: 900; margin-bottom: 1mm; line-height: 1; }
        .asset-label { font-size: 5.5pt; text-transform: uppercase; letter-spacing: 0.5px; }
        .qr-container { width: 27mm; height: 27mm; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .qr-container img { max-width: 100%; max-height: 100%; display: block; }
        .sticker-item { page-break-after: always; width: 70mm; height: 30mm; }
      </style></head><body>${qrCodesHtml}</body></html>`;
    },

    // ── Misc ──────────────────────────────────────────────────────────────
    viewMaintenance(row) {
      try {
        this.$router.push(`/assets/${row.item.AccountCode}`);
      } catch (e) {
        console.log("Error passing Employee ID: ", e);
      }
    },
    getStatusId(statusText) {
      const map = { Serviceable: "7", Unserviceable: "8", Disposed: "9" };
      return map[statusText] || "7";
    },
    getStatusText(statusId) {
      const map = { 7: "Serviceable", 8: "Unserviceable", 9: "Disposed" };
      return map[statusId] || "Serviceable";
    },
    resetAssetForm() {
      this.assetInfo = {
        status: "Serviceable",
        assetAccount: null,
        assetCategory: null,
        assetSubcategory: null,
        assetTag: "",
        unit: null,
        assetDepartment: null,
        dateAcquired: "",
        itemDescription: "",
        cost: null,
        noWarranty: "false",
        hasWarranty: "false",
        removeAssignment: false,
        accountableEmployee: "",
        accountableEmployeeID: null,
        actualUser: "",
        actualUserID: null,
        sameAsActualUser: false,
        departmentAssigned: null,
        location: null,
        condition: "",
        remarks: "",
        itemHdrId: null,
        ItemDtlId: null,
        PropertyNo: ""
      };
      this.assetCategoryOptions = [];
      this.assetSubcategoryOptions = [];
    },
    cancelAssetDetails() {
      this.resetAssetForm();
      this.isEditMode = false;
      this.$bvModal.hide("bv-modal-add-asset");
      this.$bvModal.hide("bv-modal-edit-asset");
    },
    async closeModalView() {
      this.$refs.assetTable.clearSelected();
      this.$bvModal.hide("bv-modal-asset-details");
    },

    async saveAsset() {
      try {
        const assetData = {
          Qty: "1",
          RefAccountId: this.assetInfo.assetAccount,
          RefCategoryId: this.assetInfo.assetCategory,
          SubcategoryId: this.assetInfo.assetSubcategory,
          FuncPerOfficeId: this.assetInfo.assetDepartment,
          DateAcquired: this.assetInfo.dateAcquired,
          Description: this.assetInfo.itemDescription,
          UnitId: this.assetInfo.unit,
          UnitCost: this.assetInfo.cost,
          StatusId: this.getStatusId(this.assetInfo.status),
          IsActive: "1",
          IsDonation: "0",
          Remarks: this.assetInfo.remarks,
          assetTag: this.assetInfo.assetTag,
          CreatedBy: localStorage.id,
        };
        const res = await this.$axios.post(
          `${this.$axios.defaults.baseURL}/items/insert`,
          assetData
        );
        this.assetInfo.itemHdrId =
          res.data?.item_hdr_id || res.data?.ItemId || res.data?.itemId || null;

        // Capture the employee IDs BEFORE resetting form
        const itemHdrId = this.assetInfo.itemHdrId;

        this.showAlert("Asset saved successfully!", "success");
        this.$bvModal.hide("bv-modal-add-asset");
        this.getAllAssets();

        // Return captured IDs along with itemHdrId
        return { itemHdrId };
      } catch (error) {
        console.error("Failed to save asset", error);
        this.showAlert("Failed to save asset", "danger");
        throw error;
      }
    },
    async updateAsset() {
      try {
        const assetData = {
          ItemId: this.assetDetails.ItemHdrId,
          Qty: "1",
          RefAccountId: this.assetInfo.assetAccount,
          RefCategoryId: this.assetInfo.assetCategory,
          SubcategoryId: this.assetInfo.assetSubcategory,
          FuncPerOfficeId: this.assetInfo.assetDepartment,
          DateAcquired: this.assetInfo.dateAcquired,
          Description: this.assetInfo.itemDescription,
          UnitId: this.assetInfo.unit,
          UnitCost: this.assetInfo.cost,
          StatusId: this.getStatusId(this.assetInfo.status),
          IsActive: "1",
          IsDonation: "0",
          Remarks: this.assetInfo.remarks,
          assetTag: this.assetInfo.assetTag,
          UpdatedBy: localStorage.id,
        };
        await this.$axios.put(
          `${this.$axios.defaults.baseURL}/items/update`,
          assetData
        );
        this.showAlert("Asset updated successfully!", "success");
        this.$bvModal.hide("bv-modal-edit-asset");
        this.getAllAssets();
      } catch (error) {
        console.error("Failed to update asset", error);
        this.showAlert("Failed to update asset", "danger");
        throw error;
      }
    },
    async saveAssetChanges() {
      try {
        let itemHdrId = null;

        if (this.isEditMode) {
          await this.updateAsset();
          itemHdrId = this.assetInfo.itemId;
        } else {
          const result = await this.saveAsset();
          itemHdrId = result.itemHdrId;
        }
        console.log(this.assetInfo, "GHHHHHHHH");
        if (!this.assetInfo.removeAssignment) {
          const assignmentData = {
            ItemHdrId: itemHdrId || null,
            IsTransfer: false,
            AssignmentId: null,
            AssignedEmpId: this.assetInfo.accountableEmployeeID || "",
            EmployeeAssigned: this.assetInfo.accountableEmployee || "",
            UserEmpId: this.assetInfo.actualUserID,
            EmployeeUser: this.assetInfo.actualUser || "",
            AssignedFuncPerOfficeId: this.assetInfo.departmentAssigned || null,
            LocationId: this.assetInfo.location || null,
            Condition: this.assetInfo.condition || "",
            Remarks: this.assetInfo.remarks || "",
            CreatedBy: localStorage.id,
            UpdatedBy: localStorage.id,
          };
          console.log("HERE");
          await this.$axios.post(
            `${this.$axios.defaults.baseURL}/items/assign`,
            assignmentData
          );
          this.resetAssetForm();
          this.showAlert("Asset and assignment saved successfully!", "success");
        } else {
          this.resetAssetForm();
          this.showAlert("Asset saved successfully!", "success");
        }
      } catch (error) {
        console.error("Failed to save asset changes", error);
      }
    },
  },
};
</script>
<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header i,
.section-header .section-title {
  flex: 1;
}

.section-header .section-title {
  margin-left: 8px;
}

.property-no-badge {
  background: linear-gradient(135deg, #0b345f 0%, #1e4d8b 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: auto;
  margin-right: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
}
</style>

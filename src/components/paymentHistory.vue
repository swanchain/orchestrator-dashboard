<template>
  <div id="payment">
    <div class="payment-history container-landing">
      <div class="title">Reward history</div>
      <div class="status-style flex-row">
        <el-radio-group v-model="statusRadio" class="ml-4" @change="radioFilterChange">
          <el-radio value="" size="large">payment status</el-radio>
          <el-radio value="Claim Failed" size="large">Claim Failed</el-radio>
          <el-radio value="Rewardable" size="large">reward claimable</el-radio>
          <el-radio value="Pending" size="large">Pending</el-radio>
          <el-radio value="Cooling Down" size="large">Cooling Down</el-radio>
          <el-radio value="Reward Claimed" size="large">Reward Claimed</el-radio>
          <el-radio value="Terminate Failed" size="large">Terminate Failed</el-radio>
        </el-radio-group>
      </div>

      <el-table v-loading="paymentLoad" :data="paymentData" stripe style="width: 100%" @filter-change="handleFilterChange">
        <!-- <el-table-column prop="chain_id" label="chain id" min-width="110" /> -->
        <el-table-column prop="job" label="task uuid" min-width="100">
          <template #default="scope">
            <div class="flex-row center copy-style" @click="system.$commonFun.copyContent(scope.row.task_uuid, 'Copied')">
              {{ system.$commonFun.hiddAddress(scope.row.task_uuid) || '-' }}
              <svg t="1706499607741" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2309" width="18" height="18">
                <path d="M720 192h-544A80.096 80.096 0 0 0 96 272v608C96 924.128 131.904 960 176 960h544c44.128 0 80-35.872 80-80v-608C800 227.904 764.128 192 720 192z m16 688c0 8.8-7.2 16-16 16h-544a16 16 0 0 1-16-16v-608a16 16 0 0 1 16-16h544a16 16 0 0 1 16 16v608z"
                  p-id="2310" fill="#b5b7c8"></path>
                <path d="M848 64h-544a32 32 0 0 0 0 64h544a16 16 0 0 1 16 16v608a32 32 0 1 0 64 0v-608C928 99.904 892.128 64 848 64z" p-id="2311" fill="#b5b7c8"></path>
                <path d="M608 360H288a32 32 0 0 0 0 64h320a32 32 0 1 0 0-64zM608 520H288a32 32 0 1 0 0 64h320a32 32 0 1 0 0-64zM480 678.656H288a32 32 0 1 0 0 64h192a32 32 0 1 0 0-64z" p-id="2312" fill="#b5b7c8"></path>
              </svg>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="hardware_type" label="Task Type" min-width="60">
          <template #default="scope">
            <span>{{ scope.row.hardware_type }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="node_id" label="NODE ID" min-width="100">
          <template #default="scope">
            <div class="flex-row center copy-style" @click="system.$commonFun.copyContent(scope.row.node_id, 'Copied')">
              {{ system.$commonFun.hiddAddress(scope.row.node_id) }}
              <svg t="1706499607741" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2309" width="18" height="18">
                <path d="M720 192h-544A80.096 80.096 0 0 0 96 272v608C96 924.128 131.904 960 176 960h544c44.128 0 80-35.872 80-80v-608C800 227.904 764.128 192 720 192z m16 688c0 8.8-7.2 16-16 16h-544a16 16 0 0 1-16-16v-608a16 16 0 0 1 16-16h544a16 16 0 0 1 16 16v608z"
                  p-id="2310" fill="#b5b7c8"></path>
                <path d="M848 64h-544a32 32 0 0 0 0 64h544a16 16 0 0 1 16 16v608a32 32 0 1 0 64 0v-608C928 99.904 892.128 64 848 64z" p-id="2311" fill="#b5b7c8"></path>
                <path d="M608 360H288a32 32 0 0 0 0 64h320a32 32 0 1 0 0-64zM608 520H288a32 32 0 1 0 0 64h320a32 32 0 1 0 0-64zM480 678.656H288a32 32 0 1 0 0 64h192a32 32 0 1 0 0-64z" p-id="2312" fill="#b5b7c8"></path>
              </svg>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="created at" min-width="120" column-key="created_at" filterable :filters="[
        { text: '60', value: '60' },
        { text: '50', value: '50' },
        { text: '40', value: '40' },
        { text: '30', value: '30' },
        { text: '20', value: '20' },
        { text: '10', value: '10' },
        { text: '5', value: '5' },
        { text: '1', value: '1' },
      ]" filter-placement="bottom-end" :filter-multiple="false">
          <template #default="scope">
            <span>
              {{ system.$commonFun.momentFun(scope.row.created_at) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="updated_at" label="updated at" min-width="120">
          <template #default="scope">
            <span>
              {{ system.$commonFun.momentFun(scope.row.updated_at) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="task_end_at" label="Estimated End At" min-width="120">
          <template #default="scope">
            <span>
              {{ system.$commonFun.momentFun(scope.row.task_end_at) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="task_status" label="Task Status" min-width="120">
          <template #default="scope">
            <div>
              <span v-if="scope.row.task_status && scope.row.task_status.toLowerCase() === 'task failed'" class="flex-row center">
                {{ scope.row.task_status }}
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="The Task cannot be deployed or the contract cannot be retrieved after the user has initiated an Early Termination.">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </span>
              <span v-else-if="scope.row.task_status && scope.row.task_status.toLowerCase() === 'task cancelled'" class="flex-row center">
                {{ scope.row.task_status }}
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="Auction waited for more than thirty minutes and could not be assigned.">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </span>
              <span v-else-if="scope.row.task_status && scope.row.task_status.toLowerCase() === 'task terminating'" class="flex-row center">
                {{ scope.row.task_status }}
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="The user initiated an early termination request and is waiting in the early termination queue for the task to be terminated">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </span>
              <span v-else>{{ scope.row.task_status }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="payment status" min-width="135">
          <!-- column-key="status" filterable :filters="[
        { text: 'Claim Failed', value: 'Claim Failed' },
        { text: 'Rewardable', value: 'Rewardable' },
        { text: 'Pending', value: 'Pending' },
        { text: 'Cooling Down', value: 'Cooling Down' },
        { text: 'Reward Claimed', value: 'Reward Claimed' },
        { text: 'Terminate Failed', value: 'Terminate Failed' },
      ]" filter-placement="bottom-end" :filter-multiple="false" -->
          <template #default="scope">
            <div>
              <!-- <span v-if="scope.row.chain_id === 80001 && scope.row.order.updated_at < 1700508000 && scope.row.status.toLowerCase() === 'refundable'">Pending</span> -->
              <!-- <el-button type="primary" v-if="scope.row.status.toLowerCase() === 'accepted' || scope.row.status.toLowerCase() === 'refundable'" plain @click="rewardFun(scope.row)">Refund</el-button> -->
              <!--              <span v-if="scope.row.status && scope.row.status.toLowerCase() === 'waiting_for_cooling_down'">Cooling Down</span>-->
              <!--              <span v-else-if="scope.row.status && scope.row.status.toLowerCase() === 'pending'">Job Running</span>-->
              <!--              <span v-else-if="scope.row.status && scope.row.status.toLowerCase() === 'completed'">Reward Claimed</span>-->
              <span v-if="scope.row.status && scope.row.status.toLowerCase() === 'reward claimed'" class="flex-row center">
                {{ scope.row.status }}
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="Rewards have been claimed or have been automatically distributed to the CP's wallet">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </span>
              <span v-else-if="scope.row.status && scope.row.status.toLowerCase() === 'cooling down'" class="flex-row center">
                {{ scope.row.status }}
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="Waiting for 3 day cooling down, you will be able to claim the reward if you pass the claim review">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </span>
              <span v-else-if="scope.row.status && scope.row.status.toLowerCase() === 'pending'" class="flex-row center">
                {{ scope.row.status }}
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="This task is still running, you can get your reward after task finished ">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </span>
              <span v-else-if="scope.row.status && scope.row.status.toLowerCase() === 'claim failed'" class="flex-row center">
                {{ scope.row.status }}
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="Cannot claim this reward because of some reason">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </span>
              <el-button type="primary" v-else-if="scope.row.status && scope.row.status.toLowerCase() === 'rewardable'" plain @click="rewardFun(scope.row, 1)">Claim Reward
              </el-button>
              <el-button type="primary" v-else-if="scope.row.status && scope.row.status.toLowerCase() === 'terminate failed'" plain @click="retryFun(scope.row)">Retry Terminate
              </el-button>
              <span v-else>{{ scope.row.status }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="token" label="token" min-width="100">
          <template #default="scope">
            <span>
              {{ scope.row.token || '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="transaction_hash" label="transaction hash" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.amount && scope.row.amount.indexOf('-') > -1">-</span>
            <a v-else :href="`${scope.row.url_tx}${scope.row.transaction_hash}`" target="_blank">{{scope.row.transaction_hash}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="Amount (SWAN)" min-width="90">
          <template #default="scope">
            <span>{{ scope.row.amount && scope.row.amount.indexOf('-') > -1 ? '-' : scope.row.amount || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="flex-row" :page-size="pagin.pageSize" :current-page="pagin.pageNo" :pager-count="5" :small="small" :background="background" layout="total, prev, pager, next" :total="pagin.total" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog v-model="txhashVisible" title="Payment Detail" :width="bodyWidth" :append-to-body="false" custom-class="wrongNet" :before-close="handleClose">
      <div class="cont">
        <div class="area flex-row">
          <div class="fast width">
            <label>Transaction Hash</label>
            <div class="address">
              <div class="flex-row hash">
                {{ system.$commonFun.hiddAddress(txHash) }}
                <svg @click="system.$commonFun.copyContent(txHash, 'Copied')" t="1706499607741" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2309" width="18" height="18">
                  <path d="M720 192h-544A80.096 80.096 0 0 0 96 272v608C96 924.128 131.904 960 176 960h544c44.128 0 80-35.872 80-80v-608C800 227.904 764.128 192 720 192z m16 688c0 8.8-7.2 16-16 16h-544a16 16 0 0 1-16-16v-608a16 16 0 0 1 16-16h544a16 16 0 0 1 16 16v608z"
                    p-id="2310" fill="#b5b7c8"></path>
                  <path d="M848 64h-544a32 32 0 0 0 0 64h544a16 16 0 0 1 16 16v608a32 32 0 1 0 64 0v-608C928 99.904 892.128 64 848 64z" p-id="2311" fill="#b5b7c8"></path>
                  <path d="M608 360H288a32 32 0 0 0 0 64h320a32 32 0 1 0 0-64zM608 520H288a32 32 0 1 0 0 64h320a32 32 0 1 0 0-64zM480 678.656H288a32 32 0 1 0 0 64h192a32 32 0 1 0 0-64z" p-id="2312" fill="#b5b7c8"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="area flex-row">
          <div class="fast width">
            <label>Amount</label>
            <div class="address">{{ system.$commonFun.NumFormat(rowAll.amount) }} {{ rowAll.token || '-' }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { defineComponent, computed, onMounted, onActivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import BiddingABI from '@/utils/abi/Bidding.json'
import TaskABI from '@/utils/abi/Task.json'

export default defineComponent({
  name: 'Payment History',
  setup () {
    const store = useStore()
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const bodyWidth = ref(document.body.clientWidth > 600 ? '450px' : '95%')
    const paymentData = ref([])
    const paymentLoad = ref(false)
    const paymentType = ref(route.query.type || 'user')
    const prevType = ref(true)
    const txhashVisible = ref(false)
    const txHash = ref('')
    const rowAll = ref({})
    const pagin = reactive({
      pageSize: 10,
      pageNo: 1,
      total: 0
    })
    const paramsFilter = reactive({
      data: {
        days_ago: '',
        status_filter: ''
      }
    })
    const small = ref(false)
    const background = ref(false)
    const statusRadio = ref('')
    let biddingContractAddress = process.env.VUE_APP_OPSWAN_BIDDING_ADDRESS
    let biddingContract = new system.$commonFun.web3Init.eth.Contract(BiddingABI, biddingContractAddress)

    function handleSizeChange (val) {
    }

    async function handleCurrentChange (currentPage) {
      pagin.pageNo = currentPage
      init()
    }

    async function reviewFun (row) {
      const net = await system.$commonFun.checkNetwork()
      if (net) return
      paymentLoad.value = true
      let formData = new FormData()
      formData.append('tx_hash', row.transaction_hash)
      formData.append('chain_id', row.chain_id)
      const reviewRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}claim_review`, 'post', formData)
      if (reviewRes) {
        ElMessageBox.alert(
          `Status: ${reviewRes.status}<br />Message: ${reviewRes.message}`,
          'Review Detail',
          {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: 'OK',
            dangerouslyUseHTMLString: true,
            callback: (action) => {
              init()
            }
          }
        )
      }
    }

    function handleClose () {
      txHash.value = ''
      rowAll.value = {}
      txhashVisible.value = false
    }

    function checkFun (row) {
      rowAll.value = row
      txHash.value = row.transaction_hash
      txhashVisible.value = true
    }

    async function retryFun (row) {
      if (getnetID.toString() !== '2024') {
        await system.$commonFun.walletChain(2024)
        return
      }
      paymentLoad.value = true
      let formData = new FormData()
      formData.append('task_uuid', row.task_uuid)
      const retryRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}terminate_retry`, 'post', formData)
      if (!retryRes || retryRes.status !== 'success') if (retryRes.message) system.$commonFun.messageTip('error', retryRes.message)
      init()
    }

    async function rewardFun (row, type) {
      if (getnetID.toString() !== '2024') {
        await system.$commonFun.walletChain(2024)
        return
      }
      paymentLoad.value = true
      try {
        // get task contract address
        let taskContractAddress = await biddingContract.methods.tasks(String(row.task_uuid)).call()
        console.log(row.task_uuid)
        if (taskContractAddress.indexOf('0x0') > -1) {
          system.$commonFun.messageTip('error', 'Cannot get task contract, Please try again later!')
          paymentLoad.value = false
          return
        }
        let taskContract = new system.$commonFun.web3Init.eth.Contract(TaskABI, taskContractAddress)

        if (type) {
          console.log('task_uuid:', row.task_uuid)
          let gasLimit = await taskContract.methods
            .claimReward()
            .estimateGas({ from: store.state.metaAddress })

          const tx = await taskContract.methods
            .claimReward()
            .send({ from: store.state.metaAddress, gasLimit: Math.floor(gasLimit * 1.5) })
            .on('transactionHash', async (transactionHash) => {
              console.log('claim transactionHash:', transactionHash)
            })
            .on('receipt', async (receipt) => {
              // receipt example
              console.log('claim receipt:', receipt)
              claimStatus(row, receipt)
            })
            .on('error', () => paymentLoad.value = false)
        } else {
          console.log('refund id:', row.transaction_hash)
          let gasLimit = await taskContract.methods
            .claimRefund()
            .estimateGas({ from: store.state.metaAddress })

          const tx = await taskContract.methods
            .claimRefund()
            .send({ from: store.state.metaAddress, gasLimit: Math.floor(gasLimit * 1.5) })
            .on('transactionHash', async (transactionHash) => {
              console.log('refund transactionHash:', transactionHash)
              refundStatus(row, transactionHash)
            })
            .on('error', () => paymentLoad.value = false)
        }
      } catch (err) {
        console.log('err', err)
        paymentLoad.value = false
        if (err && err.message) system.$commonFun.messageTip('error', err.message)
      }
    }

    async function refundStatus (row, transactionHash) {
      paymentLoad.value = true
      let formData = new FormData()
      formData.append('tx_hash', row.transaction_hash)
      formData.append('chain_id', row.chain_id)
      const refundRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}user/refund`, 'post', formData)
      if (!refundRes || refundRes.status !== 'success') if (refundRes.message) system.$commonFun.messageTip('error', refundRes.message)
      init()
    }

    async function claimStatus (row, receipt) {
      paymentLoad.value = true
      let formData = new FormData()
      formData.append('tx_hash', receipt.transactionHash)
      formData.append('chain_id', getnetID)
      formData.append('uuid', row.uuid)
      formData.append('token', 'SwanToken')
      try {
        formData.append('amount', system.$commonFun.web3Init.utils.fromWei(String(receipt.events.RewardClaimed.returnValues.reward), 'ether'))
      } catch {
      }
      const claimRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}user/provider/payments`, 'post', formData)
      if (!claimRes || claimRes.status !== 'success') if (claimRes.message) system.$commonFun.messageTip('error', claimRes.message)
      init()
    }

    async function init (pFilter) {
      paymentLoad.value = true
      paymentType.value = route.query.type || 'user'
      const requestURL = `${process.env.VUE_APP_BASEAPI}provider/payments`
      const page = pagin.pageNo > 0 ? pagin.pageNo - 1 : 0
      let paramsOption = {
        limit: pagin.pageSize,
        offset: page * pagin.pageSize
      }
      if (pFilter) paramsOption = Object.assign({}, paramsOption, pFilter)
      const paymentsRes = await system.$commonFun.sendRequest(`${requestURL}?${system.$Qs.stringify(paramsOption)}`, 'get') //?public_address=${store.state.metaAddress}
      if (paymentsRes && paymentsRes.status === 'success') {
        for (let p = 0; p < paymentsRes.data.payments.length; p++) {
          let { url_tx } = await system.$commonFun.getUnit(2024)
          paymentsRes.data.payments[p].url_tx = url_tx
        }
        paymentData.value = paymentsRes.data.payments || []
        pagin.total = paymentsRes.data.total || 0
      }
      // else if (paymentsRes.message) system.$commonFun.messageTip('error', paymentsRes.message)
      paymentLoad.value = false
    }
    const handleFilterChange = (filters) => {
      for (const key in filters) {
        if (key === 'created_at') paramsFilter.data.days_ago = filters.created_at[0] || ''
        else if (key === 'status') paramsFilter.data.status_filter = filters.status[0] || ''
      }
      init(paramsFilter.data)
    }
    const radioFilterChange = (filters) => {
      paramsFilter.data.status_filter = filters || ''
      init(paramsFilter.data)
    }

    let getnetID = NaN
    onMounted(async () => {
    })
    onActivated(async () => {
      getnetID = await system.$commonFun.web3Init.eth.net.getId()
      init()
    })
    watch(route, (to, from) => {
      if (to.name === "paymentHistory") init()
    })
    return {
      paymentData,
      paymentLoad,
      system,
      route,
      router,
      paymentType,
      txhashVisible,
      txHash,
      rowAll,
      pagin,
      background,
      small, bodyWidth, statusRadio,
      rewardFun, reviewFun, checkFun, handleClose, handleSizeChange, handleCurrentChange,
      retryFun, handleFilterChange, radioFilterChange
    }
  },
})
</script>
<style lang="less" scoped>
#payment {
  width: 100%;

  .payment-history {
    height: calc(100% - 1.2rem);
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    margin: 0 auto;
    box-sizing: border-box;
    word-break: break-word;
    color: @white-color;
    font-size: 14px;
    text-align: left;

    .title {
      margin: 0;
      font-weight: bold;
      font-size: 0.24rem;
      color: @white-color;
      text-transform: capitalize;
    }

    :deep(.status-style) {
      margin: 0.4rem 0 0.2rem;
      .el-radio-group {
        .el-radio {
          color: #d1d1d1;
          text-transform: capitalize;
          .el-radio__input {
            &.is-checked {
              .el-radio__inner {
                background-color: #409eff;
              }
              .el-radio__inner::after {
                display: none;
                transition: all 0s;
              }
            }
            .el-radio__inner {
              background-color: transparent;
            }
          }
        }
      }
    }

    :deep(.el-table) {
      background-color: transparent;
      // border-radius: 0.1rem;
      border: 1px solid rgb(30, 32, 39);

      tr {
        th,
        td {
          padding: 0.1rem 0;
          background-color: @primary-color;
          font-size: 15px;
          color: rgb(181, 183, 200);
          border-color: rgb(38, 39, 47);
          @media screen and (max-width: 1600px) {
            font-size: 13px;
          }
          @media screen and (max-width: 768px) {
            font-size: 12px;
          }

          .cell {
            display: flex;
            align-items: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            padding: 0 5px;
            line-height: 1.5;
            word-break: break-word;
            text-align: center;

            a {
              color: inherit;

              &:hover {
                text-decoration: underline;
              }
            }

            .el-button {
              height: auto;
              padding: 6px 0.1rem;
              background-color: transparent;
              font-family: inherit;
              font-size: inherit;
              border-color: @theme-color;
              border-radius: 1rem;
              line-height: 1;
              color: @theme-color;

              &:hover {
                background-color: @theme-color;
                color: @white-color;
              }

              &.is-disabled {
                border-color: @text-color;
                color: @text-color;

                &:hover {
                  background-color: transparent;
                  color: @text-color;
                }
              }
            }

            .el-tooltip__trigger {
              margin: 0 0 0 4px;
            }
          }
        }

        th {
          font-size: 16px;
          font-weight: normal;
          background-color: @primary-color;
          text-transform: uppercase;
          color: @text-color;
          @media screen and (max-width: 1600px) {
            font-size: 14px;
          }
          @media screen and (max-width: 768px) {
            font-size: 13px;
          }
        }
      }

      .el-table__inner-wrapper::before {
        height: 0;
      }
    }

    :deep(.el-pagination) {
      margin: 0.4rem auto;
      justify-content: center;

      .btn-next,
      .btn-prev,
      .el-pager li {
        background-color: @primary-color;
        color: rgb(181, 183, 200);

        &.active,
        &:hover {
          color: @white-color;
        }
      }

      .btn-prev {
        i {
          font-size: 14px;
          @media screen and (min-width: 1800px) {
            font-size: 16px;
          }
        }
      }
    }
  }
}

:deep(.el-overlay-dialog) {
  display: flex;
  justify-content: center;
  align-items: center;

  .wrongNet {
    margin: auto !important;
    box-shadow: 0 0 13px rgba(128, 128, 128, 0.8);
    border-radius: 0.2rem;
    text-align: left;

    .el-dialog__header {
      padding: 0.2rem 0.4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #dfdfdf;
      color: #000;
      font-size: 0.2rem;
      font-weight: 500;
      line-height: 1;
      text-transform: capitalize;
      @media screen and (max-width: 479px) {
        padding: 0.3rem 0.2rem;
      }

      .el-dialog__headerbtn {
        position: relative;
        top: auto;
        right: auto;
        font-size: inherit;

        i {
          font-size: inherit;

          * {
            cursor: pointer;
          }

          &:hover {
            color: #7405ff;
          }
        }
      }

      .el-dialog__title {
        font-size: inherit;
      }
    }

    .el-dialog__body {
      position: relative;
      padding: 0.3rem 0.4rem 0.4rem;
      font-size: 0.16rem;
      @media screen and (max-width: 540px) {
        padding: 0.2rem;
      }

      .cp-show {
        min-height: 50px;

        label {
        }
      }

      label {
        word-break: break-word;
        line-height: 1;
        color: #666;
        font-size: inherit;
      }

      .address {
        background: rgba(233, 233, 233, 1);
        padding: 8px;
        margin: 10px 0 12px;
        border-radius: 8px;
        font-size: inherit;

        .hash {
          svg {
            margin: 0 0 0 0.05rem;
            cursor: pointer;
          }
        }
      }

      .address_email {
        margin: 0 0 10px;

        .address_body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 10px 0 0;

          .address {
            width: 80%;
            margin: 0;
          }

          .address_right {
            position: relative;
            display: inline-block;
            padding: 0.05rem 0.2rem 0.05rem 0.32rem;
            margin: 0 5px;
            background-color: rgba(85, 128, 233, 0.15);
            font-size: 14px;
            border-radius: 0.5rem;
            white-space: nowrap;
            @media screen and (max-width: 1600px) {
              font-size: 13px;
            }
            @media screen and (max-width: 600px) {
              font-size: 12px;
            }

            &::before {
              position: absolute;
              left: 0.16rem;
              top: 50%;
              content: "";
              width: 0.08rem;
              height: 0.08rem;
              margin-top: -0.04rem;
              background-color: #606266;
              border-radius: 0.5rem;
            }
          }

          .bg-primary {
            &::before {
              background-color: #4d73ff;
            }
          }
        }

        .share {
          .el-button {
            width: 100%;
            margin: 3px 0 0;
            font-size: 13px;
            @media screen and (min-width: 1800px) {
              font-size: 14px;
            }
            @media screen and (max-width: 600px) {
              font-size: 12px;
            }
          }
        }

        .el-loading-mask {
          .el-loading-spinner {
            top: 50%;
          }
        }
      }

      .area {
        justify-content: space-between;

        .fast {
          width: 48%;

          &.width {
            width: 100%;
          }

          .address {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .error {
            font-size: 12px;
            color: firebrick;
          }

          .el-input-number {
            width: 100%;

            .el-input-number__decrease,
            .el-input-number__increase {
              display: none;
            }

            .el-input__inner {
              text-align: left;
            }
          }
        }
      }

      .share {
        flex-wrap: wrap;
        justify-content: flex-start;
        font-size: inherit;

        svg,
        path {
          fill: @theme-color;
        }

        .el-button {
          justify-content: flex-start;
          min-width: 50%;
          padding: 0;
          margin: 8px 0 0;
          background: transparent !important;
          border: 0;
          color: @theme-color !important;
          font-size: inherit;
          font-weight: normal;
          font-family: inherit;
          opacity: 0.8;
          box-shadow: none !important;

          span {
            display: flex;
            align-items: center;

            svg {
              width: 15px;
              height: 15px;
              margin: 0 3px 0 0;
            }

            .icon_big {
              width: 13px;
              height: 13px;
            }
          }

          &:hover {
            background: transparent;
            opacity: 1;
          }

          &.is-disabled {
            opacity: 0.4;
          }
        }
      }

      .loadStyle {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2000;
        background: rgba(255, 255, 255, 1);
        border-radius: 0.2rem;
      }

      .apiTipCont {
        p {
          display: flex;
          align-items: center;
          text-indent: 0.1rem;
          margin: 0.1rem;
          color: #7e7e7e;
          font-size: 0.18rem;

          .el-icon-document-copy {
            display: block;
            font-size: 17px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
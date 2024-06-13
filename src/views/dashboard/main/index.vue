<template>
  <section id="container">
    <div class="flex-row item-label">
      <h1 class="color t">Swan Provider Status</h1>

      <el-select v-model="versionRef.value" placeholder="Select" size="small" @change="versionMethod">
        <el-option v-for="item in versionRef.options" :key="item.value" :label="item.value" :value="item.value">
          <div class="font-14">{{item.value}}</div>
        </el-option>
      </el-select>
    </div>
    <div class="describe ">
      Use this status page to check an Swan Provider information and status.
      <br> This list is refreshed every 5 minutes. Below snapshot taken at
      <span class="color">{{gmtTime}}</span>
    </div>

    <div class="providers-overview mt-border">
      <div class="title">Providers Overview</div>
      <el-row :gutter="16">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="flex-row">
          <div class='chart' id='chart' v-loading="providersLoad" element-loading-background="rgba(0, 0, 0, 0)"></div>
        </el-col>
      </el-row>
      <div class="border-row">
        <div class="title top flex-row space-between">
          FCP (Fog Computing Provider)
        </div>
        <el-row :gutter="16" :class="{'hide': providerBody.collapse.general}">
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Network Providers</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.data.total_providers ? system.$commonFun.replaceFormat(providerBody.data.total_providers):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Active Applications</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{system.$commonFun.replaceFormat(pagin.active_applications)}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Total Deployments</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{system.$commonFun.replaceFormat(pagin.total_deployments)}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">total jobs</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.generalData?system.$commonFun.replaceFormat(providerBody.generalData.total_jobs):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">total running jobs</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.generalData?system.$commonFun.replaceFormat(providerBody.generalData.total_running_jobs):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">total leading jobs</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.generalData?system.$commonFun.replaceFormat(providerBody.generalData.total_leading_jobs):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">leading job duration</span>
                <small>(Hour)</small>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.generalData?system.$commonFun.replaceFormat(system.$commonFun.timeFormat(providerBody.generalData.total_leading_job_duration)):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">total GPU deployed jobs</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.generalData?system.$commonFun.replaceFormat(providerBody.generalData.total_gpu_deployed_jobs):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">total GPU hours</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.generalData?system.$commonFun.replaceFormat(providerBody.generalData.total_gpu_hours):'-'}}</b>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="border-row">
        <div class="title top flex-row space-between">
          ECP (Edge Computing Provider)
        </div>
        <el-row :gutter="16" :class="{'hide': providerBody.collapse.zk}">
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">CP Numbers of ZK Task</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.ubiData.providers?system.$commonFun.replaceFormat(providerBody.ubiData.providers.count):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Total ZK Tasks</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.ubiData.tasks && providerBody.ubiData.tasks.sent ?system.$commonFun.replaceFormat(providerBody.ubiData.tasks.sent.count) : '-'}}</b>
            </div>
          </el-col>

          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">GPU ZK Tasks</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.ubiData.tasks && providerBody.ubiData.tasks.sent ?system.$commonFun.replaceFormat(providerBody.ubiData.tasks.sent.count_gpu):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">CPU ZK Tasks</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.ubiData.tasks && providerBody.ubiData.tasks.sent ?system.$commonFun.replaceFormat(providerBody.ubiData.tasks.sent.count_cpu) : '-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Verified ZK Tasks</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.ubiData.tasks && providerBody.ubiData.tasks.verified ?system.$commonFun.replaceFormat(providerBody.ubiData.tasks.verified.count):'-'}}</b>
            </div>
          </el-col>

          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">24h Average ZK Reward</span>
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="Average ZK reward per CP over 24 hours">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.ubiData.rewards?system.$commonFun.replaceFormat(providerBody.ubiData.rewards.avg_24h):'-'}}
                <small>SWAN/CP</small>
              </b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">7d Average ZK Reward</span>
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="Average ZK reward per CP per day over 7 days">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.ubiData.rewards?system.$commonFun.replaceFormat(providerBody.ubiData.rewards.avg_7d):'-'}}
                <small>SWAN/CP</small>
              </b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">30d Average ZK Reward</span>
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="Average ZK reward per CP per day over 30 days">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.ubiData.rewards?system.$commonFun.replaceFormat(providerBody.ubiData.rewards.avg_30d):'-'}}
                <small>SWAN/CP</small>
              </b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">1y Average ZK Reward</span>
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="Average ZK reward per CP per day over 1 year">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.ubiData.rewards?system.$commonFun.replaceFormat(providerBody.ubiData.rewards.avg_1y):'-'}}
                <small>SWAN/CP</small>
              </b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Total ZK Reward</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.ubiData.rewards ? system.$commonFun.replaceFormat(providerBody.ubiData.rewards.total) : '-'}}
                <small>SWAN</small>
              </b>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="border-row">
        <div class="title top flex-row space-between">
          storage provider
        </div>
        <el-row :gutter="16" :class="{'hide': providerBody.collapse.provider}">
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">active SP</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.providerData?system.$commonFun.replaceFormat(providerBody.providerData.active_sp_quantity):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">daily sealed deals</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.providerData?system.$commonFun.replaceFormat(providerBody.providerData.daily_sealed_deals):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Storage Providers</span>
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="The number of storage providers offering decentralized storage capacity.">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.providerData?system.$commonFun.replaceFormat(providerBody.providerData.sp_quantity):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Daily Deals Processed</span>
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="The daily amount of all deals sent by swan client.">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.providerData?system.$commonFun.replaceFormat(providerBody.providerData.daily_upload):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Total Deals Processed</span>
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="Total deals sent by swan client.">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.providerData?system.$commonFun.replaceFormat(providerBody.providerData.total_upload):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Data Transferred</span>
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="Aggregate data transferred through swan platform.">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.providerData?system.$commonFun.replaceFormat(system.$commonFun.byteStorage(providerBody.providerData.data_transfered))+' GiB':'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Total CIDs</span>
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="The total amount of payload CIDS.">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.providerData?system.$commonFun.replaceFormat(providerBody.providerData.total_cid):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Total Files Archived</span>
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="The number of files archived on the Filecoin network.">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.providerData?system.$commonFun.replaceFormat(providerBody.providerData.active_storage_deals):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Storage Archived</span>
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="Total storage archived on the Filecoin network.">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.providerData?system.$commonFun.replaceFormat(system.$commonFun.byteStorage(providerBody.providerData.total_sealed_storage))+' GiB':'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Pledge Collateral</span>
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="Average pledge collateral price for sealing 1TB data cost on filecoin network.">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.storageData?system.$commonFun.storageNumformat(providerBody.storageData.average_data_cost_sealing_1TB):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Average Minimum Piece Size</span>
                <el-popover placement="top" :width="200" effect="dark" popper-style="word-break: break-word; text-align: left;font-size:12px;" trigger="hover" content="Average minimum piece size (accepting deal size) required by storage provider.">
                  <template #reference>
                    <div class="flex-row">
                      <svg t="1708417763428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="14" height="14">
                        <path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 71.972571a375.954286 375.954286 0 1 0 0 752.054858A375.954286 375.954286 0 0 0 512 135.972571z m35.181714 266.020572c12.361143 0 21.796571 2.486857 28.672 8.045714 7.314286 5.997714 11.044571 14.043429 11.044572 23.917714 0 10.971429-11.190857 52.589714-33.060572 123.172572l-4.096 13.677714C517.778286 676.498286 512.731429 698.514286 512.731429 720.384c0 3.510857 0.731429 6.070857 2.194285 7.68 1.462857 1.755429 2.340571 2.340571 2.706286 2.340571 8.265143 0 35.766857-20.333714 78.262857-59.245714l8.777143 0.146286 19.456 18.944-0.146286 9.289143-2.779428 2.56c-45.568 41.691429-77.677714 67.584-98.889143 79.213714l-1.682286 0.877714c-21.357714 11.702857-39.058286 17.773714-53.248 17.773715a44.324571 44.324571 0 0 1-32.914286-12.726858 49.371429 49.371429 0 0 1-11.922285-34.596571c0-42.130286 13.531429-97.645714 64.219428-257.243429a57.197714 57.197714 0 0 0 3.291429-17.92V476.891429c0-2.56-0.438857-2.706286-2.852572-2.706286a41.179429 41.179429 0 0 0-19.748571 6.802286l-0.512 0.219428c-7.972571 4.900571-25.380571 20.260571-55.808 49.005714l-8.265143 0.438858-22.089143-16.822858-0.731428-9.508571 2.048-2.194286c33.572571-35.84 63.634286-61.001143 91.209143-76.288 28.525714-15.872 53.174857-23.844571 73.874285-23.844571z m51.565715-157.988572c11.776 0 22.162286 4.169143 30.134857 12.141715 8.045714 7.972571 12.141714 18.285714 12.141714 30.866285a64.658286 64.658286 0 0 1-17.554286 41.910858 51.2 51.2 0 0 1-39.131428 18.505142 40.448 40.448 0 0 1-29.622857-12.141714 43.373714 43.373714 0 0 1-12.141715-31.670857c0-16.676571 5.339429-30.427429 16.603429-42.276571a53.101714 53.101714 0 0 1 39.497143-17.334858z"
                          fill="#ffffff" p-id="7202"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.storageData?system.$commonFun.storageNumformat(providerBody.storageData.average_min_piece_size):'-'}}</b>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="border-row">
        <div class="title top flex-row space-between">
          Swan Proxima Chain
        </div>
        <el-row :gutter="16" :class="{'hide': providerBody.collapse.total}">
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Total Addresses</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.totalData.total_addresses?system.$commonFun.replaceFormat(providerBody.totalData.total_addresses):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Total Contracts</span>
                <small>(24H)</small>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">
                {{providerBody.totalData.smart_contracts?system.$commonFun.replaceFormat(providerBody.totalData.smart_contracts):'-'}}
                <span class="span" :class="{'up': providerBody.totalData.new_smart_contracts_24h&&providerBody.totalData.new_smart_contracts_24h>=0,'down': providerBody.totalData.new_smart_contracts_24h&&providerBody.totalData.new_smart_contracts_24h<0}">{{providerBody.totalData.new_smart_contracts_24h?providerBody.totalData.new_smart_contracts_24h>=0?'+':'-':''}}{{system.$commonFun.replaceFormat(providerBody.totalData.new_smart_contracts_24h)}}</span>
              </b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Transactions Today</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.totalData.transactions_today?system.$commonFun.replaceFormat(providerBody.totalData.transactions_today):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Total Transactions</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.totalData.total_transactions?system.$commonFun.replaceFormat(providerBody.totalData.total_transactions):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Gas Used Today</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.totalData.gas_used_today?system.$commonFun.replaceFormat(providerBody.totalData.gas_used_today):'-'}}</b>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div class="grid-content">
              <h6 class="flex-row">
                <span class="t">Total Blocks</span>
              </h6>
              <b v-loading="providersLoad" class="flex-row font-bold color">{{providerBody.totalData.total_blocks?system.$commonFun.replaceFormat(providerBody.totalData.total_blocks):'-'}}</b>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="tabs-container">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane name="CP" label="FCP (Fog Computing Provider)"></el-tab-pane>
          <el-tab-pane name="ZK-CP" label="ECP (Edge Computing Provider)"></el-tab-pane>

          <el-row :gutter="16" v-if="activeName === 'CP'" class="erchart-body" v-loading="cpLoad">
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <div class="erchart">
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="title">VCPU</div>
                <h6>Current VCPU usage</h6>
                <div id="maychar-vcpu" class="maychar"></div>
                <h6 class="background-free">
                  <i></i>
                  <b>{{providerBody.data.total_cpu - providerBody.data.total_used_cpu}}</b> vcpu Free
                </h6>
                <h6 class="background-used">
                  <i></i>
                  <b>{{providerBody.data.total_used_cpu}}</b> vcpu Used
                </h6>
                <h6 class="background-total">
                  <i></i>
                  <b>{{providerBody.data.total_cpu}}</b> Total
                </h6>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <div class="erchart">
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="title">Memory</div>
                <h6>Current Memory usage</h6>
                <div id="maychar-memory" class="maychar"></div>
                <h6 class="background-free">
                  <i></i>
                  <b>{{system.$commonFun.sizeChange(providerBody.data.total_memory-providerBody.data.total_used_memory)}}</b> Free
                </h6>
                <h6 class="background-used">
                  <i></i>
                  <b>{{system.$commonFun.sizeChange(providerBody.data.total_used_memory)}}</b> Used
                </h6>
                <h6 class="background-total">
                  <i></i>
                  <b>{{system.$commonFun.sizeChange(providerBody.data.total_memory)}}</b> Total
                </h6>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <div class="erchart">
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="title">Storage</div>
                <h6>Current Storage usage</h6>
                <div id="maychar-storage" class="maychar"></div>
                <h6 class="background-free">
                  <i></i>
                  <b>{{system.$commonFun.sizeChange(providerBody.data.total_storage-providerBody.data.total_used_storage)}}</b> Free
                </h6>
                <h6 class="background-used">
                  <i></i>
                  <b>{{system.$commonFun.sizeChange(providerBody.data.total_used_storage)}}</b> Used
                </h6>
                <h6 class="background-total">
                  <i></i>
                  <b>{{system.$commonFun.sizeChange(providerBody.data.total_storage)}}</b> Total
                </h6>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <div class="erchart">
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="title">GPU</div>
                <h6>Current GPU usage</h6>
                <div id="maychar-gpu" class="maychar"></div>
                <h6 class="background-free">
                  <i></i>
                  <b>{{providerBody.data.total_gpu-providerBody.data.total_used_gpu}}</b> Free
                </h6>
                <h6 class="background-used">
                  <i></i>
                  <b>{{providerBody.data.total_used_gpu}}</b> Used
                </h6>
                <h6 class="background-total">
                  <i></i>
                  <b>{{providerBody.data.total_gpu}}</b> Total
                </h6>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="16" v-if="activeName === 'ZK-CP'" class="erchart-body" v-loading="cpLoad">
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <div class="erchart">
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="title">VCPU</div>
                <h6>Current VCPU usage</h6>
                <div id="maychar-zk-vcpu" class="maychar"></div>
                <h6 class="background-free">
                  <i></i>
                  <b v-if="providerBody.ubiData.providers">{{providerBody.ubiData.providers.vcpu.free}}</b> vcpu Free
                </h6>
                <h6 class="background-used">
                  <i></i>
                  <b v-if="providerBody.ubiData.providers">{{providerBody.ubiData.providers.vcpu.total - providerBody.ubiData.providers.vcpu.free}}</b> vcpu Used
                </h6>
                <h6 class="background-total">
                  <i></i>
                  <b v-if="providerBody.ubiData.providers">{{providerBody.ubiData.providers.vcpu.total}}</b> Total
                </h6>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <div class="erchart">
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="title">Memory</div>
                <h6>Current Memory usage</h6>
                <div id="maychar-zk-memory" class="maychar"></div>
                <h6 class="background-free">
                  <i></i>
                  <b v-if="providerBody.ubiData.providers">{{system.$commonFun.sizeChange(providerBody.ubiData.providers.memory.free)}}</b> Free
                </h6>
                <h6 class="background-used">
                  <i></i>
                  <b v-if="providerBody.ubiData.providers">{{system.$commonFun.sizeChange(providerBody.ubiData.providers.memory.total-providerBody.ubiData.providers.memory.free)}}</b> Used
                </h6>
                <h6 class="background-total">
                  <i></i>
                  <b v-if="providerBody.ubiData.providers">{{system.$commonFun.sizeChange(providerBody.ubiData.providers.memory.total)}}</b> Total
                </h6>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <div class="erchart">
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="title">Storage</div>
                <h6>Current Storage usage</h6>
                <div id="maychar-zk-storage" class="maychar"></div>
                <h6 class="background-free">
                  <i></i>
                  <b v-if="providerBody.ubiData.providers">{{system.$commonFun.sizeChange(providerBody.ubiData.providers.storage.free)}}</b> Free
                </h6>
                <h6 class="background-used">
                  <i></i>
                  <b v-if="providerBody.ubiData.providers">{{system.$commonFun.sizeChange(providerBody.ubiData.providers.storage.total-providerBody.ubiData.providers.storage.free)}}</b> Used
                </h6>
                <h6 class="background-total">
                  <i></i>
                  <b v-if="providerBody.ubiData.providers">{{system.$commonFun.sizeChange(providerBody.ubiData.providers.storage.total)}}</b> Total
                </h6>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <div class="erchart">
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="drain-time"></div>
                <div class="title">GPU</div>
                <h6>Current GPU usage</h6>
                <div id="maychar-zk-gpu" class="maychar"></div>
                <h6 class="background-free">
                  <i></i>
                  <b v-if="providerBody.ubiData.providers">{{providerBody.ubiData.providers.gpu.free}}</b> Free
                </h6>
                <h6 class="background-used">
                  <i></i>
                  <b v-if="providerBody.ubiData.providers">{{providerBody.ubiData.providers.gpu.total-providerBody.ubiData.providers.gpu.free}}</b> Used
                </h6>
                <h6 class="background-total">
                  <i></i>
                  <b v-if="providerBody.ubiData.providers">{{providerBody.ubiData.providers.gpu.total}}</b> Total
                </h6>
              </div>
            </el-col>
          </el-row>
        </el-tabs>
      </div>
    </div>

    <div class="providers-network">
      <div class="providers-cp" v-if="activeName === 'CP'">
        <!-- <div class="search-body flex">
          <el-input v-model="networkInput" placeholder="Search Providers" @chang="searchProvider" @input="searchProvider" />
          <el-button type="primary" :disabled="!networkInput ? true:false" round @click="searchProvider">Search</el-button>
          <el-button type="info" :disabled="!networkInput ? true:false" round @click="clearProvider">Clear</el-button>
        </div> -->
        <el-table :data="providersData" @expand-change="expandChange" :row-key="getRowKeys" :expand-row-keys="expands" style="width: 100%" empty-text="No Data" v-loading="providersTableLoad">
          <el-table-column type="expand" width="40">
            <template #default="props">
              <div class="service-body" v-if="props.row.computer_provider">
                <div v-for="n in props.row.computer_provider.machines" :key="n" class="list">
                  <div class="li-title">Machine ID: {{n.machine_id}}</div>
                  <ul>
                    <li v-for="(child, vcpuKeys, k) in n.specs" :key="k" v-show="vcpuKeys === 'vcpu'">
                      <div class="li-body">
                        <p :class="{'t':true, 't-capitalize': vcpuKeys === 'vcpu'}">{{vcpuKeys}}</p>
                        <p>
                          <strong>{{child.free}}</strong>free</p>
                        <p>
                          <strong>{{child.total}}</strong>total</p>
                        <p>
                          <strong>{{child.used}}</strong>used</p>
                      </div>
                    </li>
                    <li v-for="(child, memoryKeys, k) in n.specs" :key="k" v-show="memoryKeys === 'memory'">
                      <div class="li-body">
                        <p :class="{'t':true, 't-capitalize': memoryKeys === 'vcpu'}">{{memoryKeys}}</p>
                        <p>
                          <strong>{{child.free}}</strong>free</p>
                        <p>
                          <strong>{{child.total}}</strong>total</p>
                        <p>
                          <strong>{{child.used}}</strong>used</p>
                      </div>
                    </li>
                    <li v-for="(child, storageKeys, k) in n.specs" :key="k" v-show="storageKeys === 'storage'">
                      <div class="li-body">
                        <p :class="{'t':true, 't-capitalize': storageKeys === 'vcpu'}">{{storageKeys}}</p>
                        <p>
                          <strong>{{child.free}}</strong>free</p>
                        <p>
                          <strong>{{child.total}}</strong>total</p>
                        <p>
                          <strong>{{child.used}}</strong>used</p>
                      </div>
                    </li>
                  </ul>
                  <div class="li-title">GPU Source</div>
                  <ul>
                    <li class="m-r" v-for="(child, gpuKeys, k) in n.specs" :key="k" v-show="gpuKeys === 'gpu'" style="width:100%;">
                      <div class="flex-row">
                        <div v-for="g in child.details" :key="g" :class="{'li-body':true}">
                          <p :class="{'t':true, 't-capitalize': gpuKeys === 'gpu'}">{{g.product_name}} ({{gpuKeys}})</p>
                          <p>
                            <strong>{{g.fb_memory_usage.free}}</strong>free</p>
                          <p>
                            <strong>{{g.fb_memory_usage.total}}</strong>total</p>
                          <p>
                            <strong>{{g.fb_memory_usage.used}}</strong>used</p>
                          <p>Status:
                            <strong>{{g.status}}</strong>
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="service-body" v-else>No Data</div>
            </template>
          </el-table-column>
          <el-table-column prop="multiAddress" label="Multi Address" min-width="120">
            <template #default="scope">
              <div class="badge">
                <img v-if="scope.$index < 2 && pagin.pageNo <= 1" :src="badgeIcon01" alt="">
                <img v-else :src="badgeIcon02" alt="">
                <span v-for="address in scope.row.multiAddress" :key="address">{{address}}</span>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="country" label="Country" /> -->
          <el-table-column prop="computer_provider.active_deployment" label="Active deployment" width="130" />
          <el-table-column prop="computer_provider.score" label="Score" width="120" />
          <el-table-column prop="gpu_list" label="GPU" min-width="140">
            <template #default="scope">
              <div class="badge">
                <div class="flex-row machines-style">
                  <span v-for="(gpu, g) in scope.row.gpu_list" :key="g" :class="{'green': gpu.status === 'available'}">
                    {{gpu.name}}
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="region" label="Region" min-width="100" />
          <el-table-column prop="uptime" label="Uptime">
            <template #default="scope">
              <div>
                {{system.$commonFun.unifyNumber(scope.row.uptime)}}%
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination hide-on-single-page :page-size="pagin.pageSize" :current-page="pagin.pageNo" :pager-count="5" :small="small" :background="background" layout="total, prev, pager, next" :total="pagin.total" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        />
      </div>
      <div class="providers-cp" v-if="activeName === 'ZK-CP'">
        <div class="search-body flex">
          <el-input class="zk-input" v-model="networkZK.owner_addr" placeholder="Owner Addr" @chang="searchZKProvider" @input="searchZKProvider" />
          <el-input class="zk-input" v-model="networkZK.node_id" placeholder="Node ID" @chang="searchZKProvider" @input="searchZKProvider" />
          <el-button type="primary" :disabled="!networkZK.owner_addr && !networkZK.node_id ? true:false" round @click="searchZKProvider">Search</el-button>
          <el-button type="info" :disabled="!networkZK.owner_addr && !networkZK.node_id  ? true:false" round @click="clearProvider">Clear</el-button>
        </div>
        <el-table :data="providerBody.ubiTableData" @expand-change="expandChange" :row-key="getRowKeys" :expand-row-keys="expands" style="width: 100%" empty-text="No Data" v-loading="providersTableLoad">
          <el-table-column type="expand" width="40">
            <template #default="props">
              <div class="service-body" v-if="props.row.resources">
                <div v-for="n in props.row.resources" :key="n" class="list">
                  <div class="li-title">Machine ID: {{n.machine_id}}</div>
                  <ul>
                    <li>
                      <div class="li-body">
                        <p :class="{'t':true, 't-capitalize': true}">vcpu</p>
                        <p>
                          <strong>{{system.$commonFun.replaceFormat(n.vcpu.free)}}</strong>free</p>
                        <p>
                          <strong>{{system.$commonFun.replaceFormat(n.vcpu.total)}}</strong>total</p>
                      </div>
                    </li>
                    <li>
                      <div class="li-body">
                        <p :class="{'t':true}">memory</p>
                        <p>
                          <strong>{{system.$commonFun.sizeChange(n.memory.free)}}</strong>free</p>
                        <p>
                          <strong>{{system.$commonFun.sizeChange(n.memory.total)}}</strong>total</p>
                      </div>
                    </li>
                    <li>
                      <div class="li-body">
                        <p :class="{'t':true}">storage</p>
                        <p>
                          <strong>{{system.$commonFun.sizeChange(n.storage.free)}}</strong>free</p>
                        <p>
                          <strong>{{system.$commonFun.sizeChange(n.storage.total)}}</strong>total</p>
                      </div>
                    </li>
                  </ul>
                  <div class="li-title">GPU Source</div>
                  <ul>
                    <li class="m-r" style="width:100%;">
                      <div class="flex-row">
                        <div v-for="g in n.gpu.gpus" :key="g" :class="{'li-body':true}">
                          <p :class="{'t':true, 't-capitalize': true}">{{g.model}} (gpu)</p>
                          <p>
                            <strong>{{system.$commonFun.replaceFormat(g.free)}}</strong>free</p>
                          <p>
                            <strong>{{system.$commonFun.replaceFormat(g.total)}}</strong>total</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="service-body" v-else>No Data</div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Name" min-width="120">
            <template #default="scope">
              <div class="badge">
                {{scope.row.name}}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="country" label="Country" /> -->
          <el-table-column prop="node_id" label="nodeID" min-width="120">
            <template #default="scope">
              <div class="flex-row copy-style" @click="system.$commonFun.copyContent(scope.row.node_id, 'Copied')">
                {{system.$commonFun.hiddAddress(scope.row.node_id)}}
                <svg t="1706499607741" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2309" width="18" height="18">
                  <path d="M720 192h-544A80.096 80.096 0 0 0 96 272v608C96 924.128 131.904 960 176 960h544c44.128 0 80-35.872 80-80v-608C800 227.904 764.128 192 720 192z m16 688c0 8.8-7.2 16-16 16h-544a16 16 0 0 1-16-16v-608a16 16 0 0 1 16-16h544a16 16 0 0 1 16 16v608z"
                    p-id="2310" fill="#b5b7c8"></path>
                  <path d="M848 64h-544a32 32 0 0 0 0 64h544a16 16 0 0 1 16 16v608a32 32 0 1 0 64 0v-608C928 99.904 892.128 64 848 64z" p-id="2311" fill="#b5b7c8"></path>
                  <path d="M608 360H288a32 32 0 0 0 0 64h320a32 32 0 1 0 0-64zM608 520H288a32 32 0 1 0 0 64h320a32 32 0 1 0 0-64zM480 678.656H288a32 32 0 1 0 0 64h192a32 32 0 1 0 0-64z" p-id="2312" fill="#b5b7c8"></path>
                </svg>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="gpu_tags" label="GPU" min-width="140">
            <template #default="scope">
              <div class="badge">
                <div class="flex-row machines-style">
                  <span v-for="(gpu, g) in scope.row.gpu_tags" :key="g">
                    {{gpu}}
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="region" label="Region" min-width="100" />
          <el-table-column prop="task" label="Total Task">
            <template #default="scope">
              <div>
                {{scope.row.task?scope.row.task.total : ''}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="task" label="Completed(%)" min-width="140">
            <template #default="scope">
              <div>
                {{system.$commonFun.fixedformat(scope.row.completion_rate,10000)}}%
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination hide-on-single-page :page-size="paginZK.pageSize" :current-page="paginZK.pageNo" :pager-count="5" :small="small" :background="background" layout="total, prev, pager, next" :total="paginZK.total" @size-change="handleSizeChange"
          @current-change="handleZKCurrentChange" />
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, computed, onActivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  DocumentCopy, Avatar
} from '@element-plus/icons-vue'
import * as echarts from "echarts"
import worldGeoJSON from '@/assets/js/world.json'

export default defineComponent({
  components: {
    DocumentCopy, Avatar
  },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const accessToken = computed(() => (store.state.accessToken))
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const badgeIcon01 = require("@/assets/images/icons/badge-1.png")
    const badgeIcon02 = require("@/assets/images/icons/badge-2.png")
    const gmtTime = new Date().toGMTString()
    const providersLoad = ref(false)
    const providersTableLoad = ref(false)
    const providersData = ref([])
    const pagin = reactive({
      pageSize: 10,
      pageNo: 1,
      total: 0,
      total_deployments: 0,
      active_applications: 0
    })
    const paginZK = reactive({
      pageSize: 10,
      pageNo: 1,
      total: 0,
      total_deployments: 0,
      active_applications: 0
    })
    const providerBody = reactive({
      data: {},
      ubiData: {},
      ubiTableData: {},
      totalData: {
        gas_used_today: '',
        total_addresses: '',
        total_blocks: '',
        total_gas_used: '',
        total_transactions: '',
        transactions_today: '',
        smart_contracts: '',
        new_smart_contracts_24h: ''
      },
      storageData: {},
      providerData: {},
      generalData: {},
      collapse: {
        general: false,
        zk: false,
        total: false,
        provider: false
      }
    })
    const networkInput = ref('')
    const networkZK = reactive({
      owner_addr: '',
      node_id: ''
    })
    const small = ref(false)
    const background = ref(false)
    const dataArr = ref([])
    const expands = ref([])
    const activeName = ref('CP')
    const cpLoad = ref(false)
    const versionRef = reactive({
      value: store.state.versionValue || 'v1',
      options: [
        {
          value: 'v1'
        },
        {
          value: 'v2'
        }]
    })

    function handleSizeChange (val) { }
    async function handleCurrentChange (currentPage) {
      pagin.pageNo = currentPage
      init()
    }
    async function handleZKCurrentChange (currentPage) {
      paginZK.pageNo = currentPage
      getUBITable()
    }
    async function init () {
      providersTableLoad.value = true
      const page = pagin.pageNo > 0 ? pagin.pageNo - 1 : 0
      const params = {
        limit: pagin.pageSize,
        offset: page * pagin.pageSize,
        search_string: networkInput.value
      }
      const providerRes = await system.$commonFun.sendRequest(`${system.$baseurl}cp/cplist?${system.$Qs.stringify(params)}`, 'get')
      if (providerRes && providerRes.status === 'success') {
        pagin.total = providerRes.data.list_providers_cnt || 0
        providersData.value = await getList(providerRes.data.providers)
      } else {
        providersData.value = []
        if (providerRes.status) system.$commonFun.messageTip(providerRes.status, providerRes.message)
      }
      providersTableLoad.value = false
    }
    async function getUBITable () {
      providersTableLoad.value = true
      const page = paginZK.pageNo > 0 ? paginZK.pageNo - 1 : 0
      const params = {
        page_size: paginZK.pageSize,
        page_no: page,
        owner_addr: networkZK.owner_addr,
        node_id: networkZK.node_id
      }
      const uri = `${process.env.VUE_APP_UBI}${store.state.versionValue}/providers`
      const providerRes = await system.$commonFun.sendRequest(`${uri}?${system.$Qs.stringify(params)}`, 'get')
      if (providerRes && providerRes.code === 0) {
        paginZK.total = providerRes.data.total || 0
        providerBody.ubiTableData = providerRes.data.list || []
      } else {
        providerBody.ubiTableData = []
        paginZK.total = 0
        if (providerRes.msg) system.$commonFun.messageTip('error', providerRes.msg)
      }
      providersTableLoad.value = false
    }
    async function getList (list) {
      let l = list || []
      l.forEach((element) => {
        element.gpu_list = []
        element.multiAddress = []
        try {
          element.name.forEach(n => {
            const ip = n.split('/')
            const address = `${ip[2]}:${ip[4]}`
            element.multiAddress.push(address)
          })
        } catch{
          element.multiAddress.push(element.name)
        }
        try {
          if (element.computer_provider.machines && element.computer_provider.machines.length > 0) {
            element.computer_provider.machines.forEach((machines) => {
              if (machines.specs.gpu.details && machines.specs.gpu.details.length > 0) {
                machines.specs.gpu.details.forEach((gpu) => {
                  if (element.gpu_list.indexOf(gpu.product_name) < 0) element.gpu_list.push({
                    name: gpu.product_name,
                    status: gpu.status
                  })
                })
              }
            })
          }
        } catch{ }
      })
      return l
    }
    async function getUBITotal () {
      const statsRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_UBI}v1/stats`, 'get')
      if (statsRes && statsRes.code === 0) {
        providerBody.ubiData = statsRes.data || {}
        // changeZKtype()
      } else providerBody.ubiData = {}
    }
    async function getTotal () {
      const statsRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_STATS}v2/stats`, 'get')
      if (statsRes) {
        providerBody.totalData.gas_used_today = statsRes.gas_used_today || ''
        providerBody.totalData.total_addresses = statsRes.total_addresses || ''
        providerBody.totalData.total_blocks = statsRes.total_blocks || ''
        // providerBody.totalData.total_gas_used = statsRes.total_gas_used || ''
        providerBody.totalData.total_transactions = statsRes.total_transactions || ''
        providerBody.totalData.transactions_today = statsRes.transactions_today || ''
      }
    }
    async function getCounters () {
      const statsRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_STATS}v2/smart-contracts/counters`, 'get')
      if (statsRes) {
        providerBody.totalData.new_smart_contracts_24h = statsRes.new_smart_contracts_24h || ''
        providerBody.totalData.smart_contracts = statsRes.smart_contracts || ''
      }
    }
    async function getOverview () {
      providersLoad.value = true
      const overviewRes = await system.$commonFun.sendRequest(`${system.$baseurl}cp/overview`, 'get')
      if (overviewRes && overviewRes.status === 'success') {
        pagin.total_deployments = overviewRes.data.total_deployments
        pagin.active_applications = overviewRes.data.active_applications
        providerBody.data = overviewRes.data || {}
        dataArr.value = overviewRes.data.map_info
        drawChart(dataArr.value)
        changetype()
      }
      providersLoad.value = false
    }
    async function getStorageStats () {
      const storageRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_FILSWANSTATS}stats/storage`, 'get')
      if (storageRes && storageRes.status === "success") providerBody.storageData = storageRes.data || {}
    }
    async function getProviderStats () {
      const providerRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_FILSWANSTATS}stats/provider`, 'get')
      if (providerRes && providerRes.status === "success") providerBody.providerData = providerRes.data || {}
    }
    async function getGeneralStats () {
      const generalRes = await system.$commonFun.sendRequest(`${system.$baseurl}stats/general`, 'get')
      if (generalRes && generalRes.status === "success") providerBody.generalData = generalRes.data || {}
    }
    const searchProvider = system.$commonFun.debounce(async function () {
      pagin.pageSize = 10
      pagin.pageNo = 1
      init()
    }, 700)
    const searchZKProvider = system.$commonFun.debounce(async function () {
      paginZK.pageNo = 1
      getUBITable()
    }, 700)
    function clearProvider () {
      networkInput.value = ''
      networkZK.owner_addr = ''
      networkZK.node_id = ''
      if (activeName.value === 'ZK-CP') {
        paginZK.pageNo = 1
        getUBITable()
      } else {
        pagin.pageSize = 10
        pagin.pageNo = 1
        init()
      }
    }
    function expandChange (row, expandedRows) {
      // console.log(row, expandedRows)
      if (expandedRows.length) {
        expands.value = [];
        if (row) expands.value.push(row.node_id);
      } else expands.value = [];
    }
    let getRowKeys = (row) => {
      return row.node_id;
    }
    function reset (type) {
      pagin.total = 0
      pagin.total_deployments = 0
      pagin.active_applications = 0
      pagin.pageSize = 10
      pagin.pageNo = 1
      providersData.value = []
      providerBody.ubiTableData = []
      providersLoad.value = false
      providersTableLoad.value = false
      networkInput.value = ''
      networkZK.owner_addr = ''
      networkZK.node_id = ''
      if (type) init()
      getOverview()
      getUBITotal()
      getUBITable()
      getTotal()
      getCounters()
      getStorageStats()
      getProviderStats()
      getGeneralStats()
    }
    function drawChart (dataArr) {
      let chart = echarts.init(document.getElementById('chart'))
      window.addEventListener('resize', function () {
        chart.resize()
      })
      chart.setOption({
        grid: {
          top: '2%',
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        tooltip: {
          trigger: "item",
          formatter: function (val) {
            if (val.data && val.data.city) return val.data.city
            else return val.name
          },
          // show: false,
          padding: 5,
          textStyle: {
            fontSize: 8,
            lineHeight: 10,
            align: "left"
          }
        },
        geo: {
          show: true,
          map: 'worldHq',
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          // aspectScale: 0.75,
          roam: false,
          itemStyle: {
            normal: {
              areaColor: '#565658',
              borderColor: '#404042'
            },
            // emphasis: {
            //   areaColor: '#a467d1',
            //   label: {
            //     show: false
            //   }
            // }
          },
          emphasis: {
            focus: 'none'
          },
          silent: true
          // left: '5%',
          // right: '5%'
        },
        series: [
          {
            name: 'world',
            type: 'scatter',
            coordinateSystem: 'geo',
            itemStyle: {
              // borderWidth: 1,
              // borderColor: '#fff',
              // color: 'rgba(89, 152, 14, 1)',
              color: '#447dff',
              shadowBlur: 2,
              shadowColor: '#7ca3fb'
            },
            data: dataArr,
            symbolSize: 8,
            zlevel: 1
          }
        ]
      })
    }
    const changetype = () => {
      const machart_gpu = echarts.init(document.getElementById("maychar-gpu"));
      const machart_memory = echarts.init(document.getElementById("maychar-memory"));
      const machart_storage = echarts.init(document.getElementById("maychar-storage"));
      const machart_vcpu = echarts.init(document.getElementById("maychar-vcpu"));
      const option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'none'
        },
        color: ['#4db470', '#00b4ff'],
        series: [
          {
            name: 'Total',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 3,
              borderColor: 'transparent',
              borderWidth: 5
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 11,
                borderColor: 'transparent',
                color: '#fff'
              }
            },
            labelLine: {
              show: false
            }
          }
        ]
      }
      const option2 = JSON.parse(JSON.stringify(option))
      const option3 = JSON.parse(JSON.stringify(option))
      const option4 = JSON.parse(JSON.stringify(option))
      const option5 = JSON.parse(JSON.stringify(option))
      option2.series[0].data = [
        { value: providerBody.data.total_gpu - providerBody.data.total_used_gpu, name: (providerBody.data.total_gpu - providerBody.data.total_used_gpu) + ' ' },
        { value: providerBody.data.total_used_gpu, name: providerBody.data.total_used_gpu },
      ]
      option3.series[0].data = [
        { value: providerBody.data.total_memory - providerBody.data.total_used_memory, name: system.$commonFun.sizeChange(providerBody.data.total_memory - providerBody.data.total_used_memory) + ' ' },
        { value: providerBody.data.total_used_memory, name: system.$commonFun.sizeChange(providerBody.data.total_used_memory) },
      ]
      option4.series[0].data = [
        { value: providerBody.data.total_storage - providerBody.data.total_used_storage, name: system.$commonFun.sizeChange(providerBody.data.total_storage - providerBody.data.total_used_storage) + ' ' },
        { value: providerBody.data.total_used_storage, name: system.$commonFun.sizeChange(providerBody.data.total_used_storage) },
      ]
      option5.series[0].data = [
        { value: providerBody.data.total_cpu - providerBody.data.total_used_cpu, name: `${providerBody.data.total_cpu - providerBody.data.total_used_cpu} vcpu ` },
        { value: providerBody.data.total_used_cpu, name: `${providerBody.data.total_used_cpu} vcpu` },
      ]
      machart_gpu.setOption(option2);
      machart_memory.setOption(option3);
      machart_storage.setOption(option4);
      machart_vcpu.setOption(option5);
      window.addEventListener("resize", function () {
        machart_gpu.resize();
        machart_memory.resize();
        machart_storage.resize();
        machart_vcpu.resize();
      })
      cpLoad.value = false
    }
    const changeZKtype = () => {
      const machart_zk_gpu = echarts.init(document.getElementById("maychar-zk-gpu"));
      const machart_zk_memory = echarts.init(document.getElementById("maychar-zk-memory"));
      const machart_zk_storage = echarts.init(document.getElementById("maychar-zk-storage"));
      const machart_zk_vcpu = echarts.init(document.getElementById("maychar-zk-vcpu"));
      const option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'none'
        },
        color: ['#4db470', '#00b4ff'],
        series: [
          {
            name: 'Total',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 3,
              borderColor: 'transparent',
              borderWidth: 5
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 11,
                borderColor: 'transparent',
                color: '#fff'
              }
            },
            labelLine: {
              show: false
            }
          }
        ]
      }
      const option2 = JSON.parse(JSON.stringify(option))
      const option3 = JSON.parse(JSON.stringify(option))
      const option4 = JSON.parse(JSON.stringify(option))
      const option5 = JSON.parse(JSON.stringify(option))

      try {
        option2.series[0].data = [
          { value: providerBody.ubiData.providers.gpu.free, name: providerBody.ubiData.providers.gpu.free },
          { value: providerBody.ubiData.providers.gpu.total - providerBody.ubiData.providers.gpu.free, name: (providerBody.ubiData.providers.gpu.total - providerBody.ubiData.providers.gpu.free) + ' ' },
        ]
        option3.series[0].data = [
          { value: providerBody.ubiData.providers.memory.free, name: system.$commonFun.sizeChange(providerBody.ubiData.providers.memory.free) + ' ' },
          { value: providerBody.ubiData.providers.memory.total - providerBody.ubiData.providers.memory.free, name: system.$commonFun.sizeChange(providerBody.ubiData.providers.memory.total - providerBody.ubiData.providers.memory.free) },
        ]
        option4.series[0].data = [
          { value: providerBody.ubiData.providers.storage.free, name: system.$commonFun.sizeChange(providerBody.ubiData.providers.storage.free) + ' ' },
          { value: providerBody.ubiData.providers.storage.total - providerBody.ubiData.providers.storage.free, name: system.$commonFun.sizeChange(providerBody.ubiData.providers.storage.total - providerBody.ubiData.providers.storage.free) },
        ]
        option5.series[0].data = [
          { value: providerBody.ubiData.providers.vcpu.free, name: `${providerBody.ubiData.providers.vcpu.free} vcpu ` },
          { value: providerBody.ubiData.providers.vcpu.total - providerBody.ubiData.providers.vcpu.free, name: `${providerBody.ubiData.providers.vcpu.total - providerBody.ubiData.providers.vcpu.free} vcpu` },
        ]
      } catch{ }
      machart_zk_gpu.setOption(option2);
      machart_zk_memory.setOption(option3);
      machart_zk_storage.setOption(option4);
      machart_zk_vcpu.setOption(option5);
      window.addEventListener("resize", function () {
        machart_zk_gpu.resize();
        machart_zk_memory.resize();
        machart_zk_storage.resize();
        machart_zk_vcpu.resize();
      })
      cpLoad.value = false
    }
    const handleClick = async (tab, event) => {
      activeName.value = tab.props.name || 'CP'
      echartReset()
    }
    const echartReset = async () => {
      cpLoad.value = true
      await system.$commonFun.timeout(500)
      if (activeName.value === 'ZK-CP') changeZKtype()
      else changetype()
    }
    function handleSelect (key, keyPath) {
      // console.log(key, keyPath)
      echartReset()
      handleZKCurrentChange(1)
    }
    function versionMethod (key) {
      store.dispatch('setVersion', key)
      system.$baseurl = `${process.env.VUE_APP_BASEAPI}${store.state.versionValue}/`
      // console.log(key, system.$baseurl)
      echartReset()
      reset('init')
    }
    onActivated(async () => {
      echarts.registerMap('worldHq', worldGeoJSON)
      reset('init')
    })
    return {
      system,
      route,
      metaAddress,
      gmtTime,
      providersLoad,
      providersTableLoad,
      providersData,
      networkInput,
      networkZK,
      pagin,
      paginZK,
      small,
      background,
      providerBody,
      badgeIcon01,
      badgeIcon02,
      accessToken, expands, activeName, cpLoad,
      versionRef,
      handleSizeChange, handleCurrentChange, handleZKCurrentChange, searchProvider, searchZKProvider, clearProvider, expandChange, getRowKeys,
      handleClick, handleSelect, versionMethod
    }
  }
})
</script>

<style lang="less" scoped>
#container {
  font-size: 16px;
  line-height: 1.6;
  letter-spacing: 1px;
  @media screen and (max-width: 1200px) {
    font-size: 14px;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  :deep(.el-button) {
    border: 0;
    border-radius: 0.08rem;
    background: linear-gradient(45deg, #025bd5, #3c73ec);
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    font-family: inherit;
  }
  h1 {
    font-size: 0.35rem;
    font-weight: 600;
  }
  .item-label {
    align-items: self-end;
    width: 100%;
    margin: 0.1rem 0 0.3rem;
    line-height: 1;
    h1 {
      margin: 0 0.15rem 0 0;
    }
    :deep(.el-select) {
      width: auto;
      .el-select__wrapper {
        width: 60px;
        background-color: transparent;
        font-size: 0.18rem;
        border: 0;
        border-radius: 0.5rem;
        box-shadow: none;
        .el-select__placeholder {
          color: @white-color;
        }
        .el-select__suffix {
          .el-select__icon {
            background: url(../../../assets/images/icons/icon-01.png) no-repeat
              center;
            background-size: 13px;
            svg {
              display: none;
            }
          }
        }
      }
    }
  }
  .color {
    color: #3c85ff;
  }
  :deep(.providers-overview),
  :deep(.providers-network) {
    padding: 0.4rem 0;
    &.providers-overview {
      padding: 0.4rem 0 0;
      @media screen and (max-width: 992px) {
        padding: 0.4rem 0.5rem;
      }
    }
    .border-row {
      padding: 0.15rem 0.18rem;
      margin: 0.35rem 0 0;
      border: 1px solid #3a67cf;
      border-radius: 0.14rem;
      .title.top {
        margin: 0;
        cursor: pointer;
        .button {
          transition: all 0.2s;
          &.button-transform {
            transform: rotate(-90deg);
          }
        }
      }
      .el-row {
        animation: showing 0.1s linear 1 forwards;
        overflow: hidden;
        &.hide {
          animation: hiddening 0.1s linear 1 forwards;
        }
      }
    }
    .title {
      width: 100%;
      margin: 0;
      font-size: 0.24rem;
      font-weight: 600;
      &.top {
        margin: 0.15rem 0 0;
        font-size: 0.18rem;
        font-weight: 600;
        text-transform: capitalize;
        // border-bottom: 2px solid rgba(255, 255, 255, 0.3);
      }
    }
    .tabs-container {
      margin: 0.6rem 0 0;
      .el-tabs {
        .el-tabs__header {
          margin: 0;
          .el-tabs__nav {
            display: flex;
            align-items: stretch;
            width: 100%;
            border-top: 1px solid #868688;
            border-bottom-left-radius: 0.15rem;
            border-bottom-right-radius: 0.15rem;
            overflow: hidden;
            .el-tabs__item {
              width: 50%;
              height: auto;
              padding: 0.2rem 0;
              background-color: #26272a;
              font-size: 0.18rem;
              font-weight: 600;
              color: #fff;
              text-align: center;
              line-height: 1;
              &.is-active {
                background-color: #447dff;
              }
              .t {
                margin: 0 0.15rem 0 0;
              }
            }
          }
        }
        .el-tabs__nav-wrap::after,
        .el-tabs__active-bar {
          display: none;
        }
      }
    }
    .el-row {
      .el-col {
        &.flex-row {
          display: flex;
        }
        .grid-content {
          padding: 0.15rem;
          margin: 0.15rem 0;
          background: #26272a;
          // backdrop-filter: blur(5px);
          border: 1px solid #3a67cf;
          border-radius: 0.14rem;
          // animation: glow 1s ease-in-out infinite alternate;
          overflow: hidden;
          h6 {
            min-height: 34px;
            font-size: 12px;
            line-height: 17px;
            text-transform: capitalize;
            @media screen and (min-width: 1800px) {
              min-height: 38px;
              font-size: 14px;
              line-height: 19px;
            }
            .el-tooltip__trigger {
              margin: 0 0 0 4px;
            }
            .t {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: normal;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            small {
              margin: 0 0 0 5px;
              font-family: "Montserrat-Regular";
              font-weight: normal;
              color: #a0a0a0;
              font-size: 0.13rem;
              @media screen and (min-width: 1800px) {
                font-size: 0.15rem;
              }
              @media screen and (max-width: 768px) {
                font-size: 12px;
              }
            }
          }
          b {
            align-items: baseline;
            margin: 6px 0;
            font-size: 0.195rem;
            line-height: 1;
            @media screen and (min-width: 1800px) {
              font-size: 0.21rem;
            }
            @media screen and (max-width: 1440px) {
              font-size: 0.19rem;
            }
            @media screen and (max-width: 768px) {
              font-size: 16px;
            }
            .span {
              margin: 0 0 0 10px;
              font-size: 0.16rem;
              @media screen and (min-width: 1800px) {
                font-size: 0.18rem;
              }
              @media screen and (max-width: 768px) {
                font-size: 15px;
              }
              &.up {
                color: #38a169;
              }
              &.down {
                color: #e53e3e;
              }
              small {
                margin: 0;
                font-family: "Montserrat-Regular";
                font-weight: normal;
                color: #a0a0a0;
                font-size: 0.14rem;
                @media screen and (min-width: 1800px) {
                  font-size: 0.16rem;
                }
                @media screen and (max-width: 768px) {
                  font-size: 13px;
                }
              }
            }
            small {
              margin: 0 0 0 4px;
              font-size: 0.16rem;
              @media screen and (min-width: 1800px) {
                font-size: 0.18rem;
              }
              @media screen and (max-width: 768px) {
                font-size: 15px;
              }
            }
          }
        }
        .chart {
          width: 100%;
          margin: 0.45rem auto 0;
          height: 500px;
          @media screen and (max-width: 540px) {
            height: 400px;
          }
        }
      }
      &.erchart-body {
        margin: 0;
        .el-col {
          margin: 0.3rem 0 0;
          .erchart {
            position: relative;
            padding: 0.15rem;
            margin: 0.3rem 0 0;
            border-radius: 0.15rem;
            // border: 2px solid @theme-color-opacity1;
            overflow: hidden;
            text-align: center;
            // box-shadow: 0 0 15px #447dff;

            background: #26272a;
            // backdrop-filter: blur(5px);
            border: 1px solid #3a67cf;
            // border: 2px solid red;
            // animation: glowing 2s linear infinite;

            @keyframes glowing {
              0% {
                border-color: red;
              }
              50% {
                border-color: green;
              }
              100% {
                border-color: red;
              }
            }

            .drain-time {
              display: none;
              position: absolute;
              z-index: 6;
              &:nth-child(1) {
                top: 0;
                left: 0;
                width: 100%;
                height: 2px;
                animation: run1 1s linear infinite; // animation-delay: 0s;
                background: linear-gradient(
                  to right,
                  @theme-color-opacity2,
                  @theme-color-opacity1,
                  @theme-color-opacity
                );
              }
              &:nth-child(2) {
                top: 0;
                right: 0;
                height: 100%;
                width: 2px;
                animation: run2 1s linear infinite;
                // animation-delay: 1s;
                background: linear-gradient(
                  to right,
                  @theme-color-opacity2,
                  @theme-color-opacity1,
                  @theme-color-opacity
                );
              }
              &:nth-child(3) {
                bottom: 0;
                left: 0;
                height: 2px;
                width: 100%;
                animation: run3 1s linear infinite;
                // animation-delay: 2s;
                background: linear-gradient(
                  to right,
                  @theme-color-opacity2,
                  @theme-color-opacity1,
                  @theme-color-opacity
                );
              }
              &:nth-child(4) {
                top: 0;
                left: -1px;
                height: 100%;
                width: 2px;
                animation: run4 1s linear infinite;
                // animation-delay: 3s;
                background: linear-gradient(
                  to right,
                  @theme-color-opacity2,
                  @theme-color-opacity1,
                  @theme-color-opacity
                );
              }
            }
            .title {
              font-size: 0.18rem;
            }
            h6 {
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 0 0.1rem;
              font-size: 0.14rem;
              font-weight: 100;
              &.background-free {
                i {
                  background-color: #4db470;
                }
                b {
                  color: #4db470;
                }
              }
              &.background-used {
                i {
                  background-color: #00b4ff;
                }
                b {
                  color: #00b4ff;
                }
              }
              &.background-total {
                i {
                  background-color: #9266a9;
                }
                b {
                  color: #9266a9;
                }
              }
              i {
                display: block;
                width: 23px;
                height: 8px;
                margin: auto 0.05rem auto 0;
                border-radius: 5px;
              }
              b {
                padding: 0 5px 0 0;
                font-size: 0.15rem;
                font-weight: normal;
              }
            }
            .maychar {
              width: 100%;
              height: 220px;
              @media screen and (max-width: 599px) {
                max-width: 250px;
                height: 150px;
                margin: auto;
              }
            }
          }
        }
      }
    }
    .search-body {
      justify-content: flex-start;
      flex-wrap: wrap;
      margin: 0.24rem 0 0;
      .el-input {
        width: 50%;
        margin: 0 0.2rem 0 0;
        &.zk-input {
          width: 30%;
        }
        .el-input__wrapper {
          background-color: rgb(21, 23, 28);
          border: 1px solid rgb(38, 39, 47);
          border-radius: 0.1rem;
          box-shadow: none;
          .el-input__inner {
            width: 100%;
            height: 40px;
            line-height: 40px;
            color: #d1d1d1;
            @media screen and (max-width: 768px) {
              width: 100%;
            }
            &:hover,
            &:active,
            &:focus {
              border-color: @theme-color;
            }
          }
        }
      }
      .el-button {
        font-family: inherit;
        &.el-button--primary {
          background-color: #7405ff;
          border-color: #7405ff;
        }
        &:hover,
        &.is-disabled {
          opacity: 0.9;
        }
      }
    }
    .el-table {
      margin: 0.24rem auto;
      background-color: transparent;
      border-radius: 0.1rem;
      border: 1px solid rgb(30, 32, 39);
      tr {
        background-color: transparent;
        th {
          word-break: break-word;
          padding: 0.1rem 0;
          background-color: @primary-color;
          border: 0;
          .cell {
            color: @text-color;
            word-break: break-word;
            @media screen and (max-width: 540px) {
              font-size: 12px;
              line-height: 1.1;
            }
          }
        }
        td {
          padding: 0.16rem 0;
          background-color: @primary-color;
          color: rgb(181, 183, 200);
          border-color: rgb(38, 39, 47);
          @media screen and (max-width: 540px) {
            font-size: 12px;
            line-height: 1.1;
          }
          i {
            margin-right: 5px;
            color: @text-color;
            font-size: 18px;
            @media screen and (max-width: 1260px) {
              font-size: 16px;
            }
          }
          .service-body {
            padding: 0 0.25rem 0.1rem;
            // color: #333;
            // border-top: rgb(220, 223, 230) 1px solid;
            // border-bottom: rgb(220, 223, 230) 1px solid;
            .tit {
              margin: 0.2rem 0 0;
              font-size: 16px;
              font-weight: 500;
              text-transform: capitalize;
              @media screen and (max-width: 1260px) {
                font-size: 14px;
              }
            }
            .desc {
              padding: 0 0 0.1rem;
              font-size: 14px;
              @media screen and (max-width: 1260px) {
                font-size: 12px;
              }
            }
            .list {
              padding: 0.1rem 0 0;
              .li-title {
                width: 100%;
                padding: 0 0 0.1rem;
                border-bottom: 1px solid #26272f;
              }
              ul {
                display: flex;
                align-items: stretch;
                justify-content: space-between;
                flex-wrap: wrap;
                margin: 0 auto 0.25rem;
                @media screen and (max-width: 768px) {
                  justify-content: flex-start;
                }
                li {
                  width: 27%;
                  margin-right: 6%;
                  @media screen and (max-width: 768px) {
                    width: auto;
                    margin-right: 0.5rem;
                  }
                  &.m-r {
                    margin-right: 0;
                  }
                  .flex-row {
                    flex-wrap: wrap;
                    .li-body {
                      width: 27%;
                      margin-right: 6%;
                      @media screen and (max-width: 768px) {
                        width: auto;
                        margin-right: 0.5rem;
                      }
                    }
                  }
                  .li-body {
                    position: relative;
                    padding: 0.15rem;
                    margin: 0.3rem 0;
                    background-color: #0d0e12;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
                    -webkit-backdrop-filter: blur(5px);
                    backdrop-filter: blur(5px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 0.1rem;
                    animation: glow 1s ease-in-out infinite alternate;
                    @media screen and (max-width: 768px) {
                      padding: 0.15rem 0.3rem;
                    }
                    p {
                      padding: 3px 0;
                      font-size: 14px;
                      line-height: 1.3;
                      text-align: center;
                      @media screen and (max-width: 1260px) {
                        font-size: 12px;
                      }
                      strong,
                      b {
                        margin-right: 5px;
                        font-size: 17px;
                        @media screen and (max-width: 1260px) {
                          font-size: 15px;
                        }
                        @media screen and (max-width: 540px) {
                          font-size: 13px;
                        }
                      }
                      &.t {
                        text-transform: capitalize; // color: #808290;
                      }
                      &.t-capitalize {
                        text-transform: uppercase;
                      }
                      &:nth-child(2) {
                        strong {
                          color: #4db470;
                        }
                      }
                      &:nth-child(3) {
                        strong {
                          color: #488fc3;
                        }
                      }
                      &:nth-child(4) {
                        strong {
                          color: #9266a9;
                        }
                      }
                    }
                    &.li-gpu {
                      &::before {
                        position: absolute;
                        content: "";
                        right: 0.1rem;
                        top: 0.1rem;
                        width: 7px;
                        height: 7px;
                        background-color: orange;
                        border-radius: 7px;
                      }
                    }
                    &.li-status {
                      &::before {
                        background-color: #8bc34a;
                      }
                    }
                  }
                }
              }
            }
            .el-divider--horizontal {
              margin: 0.1rem 0;
            }
          }
          .copy-style {
            cursor: pointer;
            flex-wrap: wrap;
            svg {
              margin: 0 0 0 0.05rem;
            }
          }
          .badge {
            display: flex;
            align-items: center;
            white-space: normal;
            word-break: break-word;
            img {
              width: 30px;
              height: 30px;
              margin-right: 5px;
              @media screen and (max-width: 1260px) {
                width: 25px;
                height: 25px;
              }
            }
            .machines-style {
              flex-wrap: wrap;
              span {
                padding: 3px 10px;
                margin: 3px 5px 3px 0;
                background-color: @theme-color;
                font-size: 12px;
                border-radius: 45px;
                word-break: break-word;
                line-height: 1;
                color: @white-color;
                &.green {
                  background-color: #4db470;
                }
              }
            }
          }
          &.el-table__expanded-cell {
            padding: 0.32rem 0.64rem;
            // border: 1px solid @white-color;
            &:hover {
              background-color: @primary-color !important;
            }
          }
        }
        // &.expanded,
        // &:hover {
        //   td {
        //     background-color: rgba(255, 255, 255, 0.85);
        //     color: #000;
        //     i {
        //       color: #000;
        //     }
        //   }
        // }
        &.expanded {
          border: 1px solid @white-color;
          border-collapse: collapse;
        }
      }
    }
    .el-table--border .el-table__inner-wrapper::after,
    .el-table--border::after,
    .el-table--border::before,
    .el-table__inner-wrapper::before {
      background-color: rgb(38, 39, 47);
      height: 0;
    }
    .el-pagination {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-pagination__total {
        color: @white-color;
      }
      .btn-next,
      .btn-prev,
      .el-pager li {
        min-width: 32px;
        margin: 0 4px;
        background-color: transparent;
        color: @white-color;
        border: 1px solid #f4f4f5;
        border-radius: 5px;
        &:not(.disabled).active,
        &:not(.disabled):hover,
        &.is-active {
          background-color: @theme-color;
          border-color: @theme-color;
        }
        &:not(.disabled):hover {
        }
      }
    }
  }
}
</style>

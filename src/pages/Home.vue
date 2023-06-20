<template>
  <el-row class="home" :gutter="20">
    <el-col :span="10" style="margin-top: 20px">
      <!-- 管理员显示 -->
      <el-card shadow="hover">
        <div class="user">
          <img src="../assets/user.png" />
          <div class="userinfo">
            <p class="name">Admin</p>
            <p class="role">超级管理员</p>
          </div>
        </div>
      </el-card>
      <!-- 租借数据 -->
      <el-card shadow="hover" style="margin-top: 20px" heigth="450px">
        <span>租借记录</span>
        <div style="margin-top: 20px">
          <el-table :data="tableData.slice(0, 6)">
            <el-table-column label="用户名" align="center">
              <template #default="scope">
                <div>
                  <span>{{ scope.row.user }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="手机号" align="center">
              <template #default="scope">
                <div>
                  <span>{{ scope.row.phone }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="场地" align="center">
              <template #default="scope">
                <div>
                  <span>{{ scope.row.area_name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="时间" align="center">
              <template #default="scope">
                <div>
                  <span>{{ scope.row.end_time.slice(0, 10) }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-col>
    <!-- 图表 -->
    <el-col :span="14" style="margin-top: 20px">
      <el-card shadow="hover">
        <!-- 场地图表 -->
        <div style="display: flex">
          <div
            id="areaEcharts"
            :style="{ width: '50%', height: '200px' }"
          ></div>
          <!-- 会员性别比例图表 -->
          <div
            id="fellowEcharts"
            :style="{ width: '50%', height: '200px' }"
          ></div>
        </div>
        <!-- 近期租借场地图表 -->
        <div id="dataEcharts" :style="{ height: '330px' }"></div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, ref } from "vue";
import axios from "axios";
import * as echarts from "echarts";
import { takeWhile } from "lodash";
import { log } from "console";

export default {
  data() {
    return {
      tableData: [],
      labList: [],
      LineDataX: [],
      LineDataY: [],
      men: 0,
      women: 0,
      end_time: [],
      number: [],
    };
  },
  methods: {
    getTableList() {
      axios.get("/datas").then((res) => {
        this.tableData = res.data.data;
      });
    },
    //绘制场地图
    getAreaData() {
      axios.get("/areas").then((res) => {
        if (res.data.code == 20041) {
          //再调用图标函数
          let arr = res.data.data;
          arr.forEach((item) => {
            //处理数据
            this.LineDataX.push(item.area_name);
            this.LineDataY.push(item.number);
          });
          let chart = echarts.init(document.getElementById("areaEcharts")); //引用带有id的标签
          let option = {
            xAxis: {
              type: "category",
              data: this.LineDataX,
              name: "场地名称",
            },
            yAxis: {
              type: "value",
              name: "场地数量",
            },
            series: [
              {
                data: this.LineDataY,
                type: "bar",
                barWidth: "20%",
              },
            ],
          };
          chart.setOption(option); //绘制 必须要有
          window.addEventListener("resize", () => {
            //根据屏幕进行实时绘制
            chart.resize();
          });
        }
      });
    },
    //绘制会员男女比例图
    getFellowData() {
      axios.get("/fellows").then((res) => {
        if (res.data.code == 20041) {
          //再调用图标函数
          let arr = res.data.data;
          arr.forEach((item) => {
            //处理数据
            if (item.fellow_sex == "男") {
              this.men++;
            } else {
              this.women++;
            }
          });
          let chart = echarts.init(document.getElementById("fellowEcharts")); //引用带有id的标签
          let option = {
            title: {
              subtext: "会员中男女比例",
              left: "center",
            },
            legend: {
              orient: "vertical",
              left: "left",
            },
            series: [
              {
                type: "pie",
                data: [
                  {
                    value: this.men,
                    name: "男",
                  },
                  {
                    value: this.women,
                    name: "女",
                  },
                ],
                radius: "50%",
              },
            ],
          };

          chart.setOption(option); //绘制 必须要有
          window.addEventListener("resize", () => {
            //根据屏幕进行实时绘制
            chart.resize();
          });
        }
      });
    },
    //租用场地近期记录图
    getDataData() {
      let map = new Map();
      axios.get("/datas").then((res) => {
        console.log(res);

        this.tableData = res.data.data;
        let arr = res.data.data;
        arr.forEach((item) => {
          //处理数据
          if (item.end_time) {
            map[item.end_time.slice(1, 10)] = 0;
          }
        });
        arr.forEach((item) => {
          //处理数据
          if (item.end_time) {
            map[item.end_time.slice(1, 10)]++;
          }
        });
        for (const key in map) {
          this.end_time.push(key);
          this.number.push(map[key]);
        }

        let chart = echarts.init(document.getElementById("dataEcharts")); //引用带有id的标签
        let option = {
          xAxis: {
            type: "category",
            data: this.end_time,
            name: "日期",
          },
          yAxis: {
            type: "value",
            name: "用户数量",
          },
          series: [
            {
              data: this.number,
              type: "bar",
              barWidth: "20%",
            },
          ],
        };
        console.log(this.end_time);

        chart.setOption(option); //绘制 必须要有
        window.addEventListener("resize", () => {
          //根据屏幕进行实时绘制
          chart.resize();
        });
      });
    },
  },
  mounted() {
    this.getAreaData();
    this.getTableList();
    this.getFellowData();
    this.getDataData();
  },
};
</script>

<style scoped>
.user {
  display: flex;
  align-items: center;
}
img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 40px;
}
</style>
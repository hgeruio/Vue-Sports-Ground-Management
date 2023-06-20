<template>
  <el-row :gutter="24" class="el-row">
    <!-- 搜索 -->
    <el-col :span="20">
      <el-input
        v-model="input.user"
        class="w-50 m-2"
        placeholder="请输入用户名"
        style="width: 20%"
        clearable
        @clear="searchData()"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
      </el-input>
      <el-select
        v-model="input.area_name"
        clearable
        placeholder="选择场地"
        @clear="searchData()"
      >
        <el-option
          v-for="item in areaData"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button
        type="primary"
        @click="searchData()"
        style="margin: 0 10px 0 10px; height: 30px"
        >搜索</el-button
      >
    </el-col>
    <!--  新增按钮-->
    <el-col :span="4">
      <!-- 文件下载 -->
      <el-button type="primary" @click="downLoad()">
        数据下载<el-icon><Download /></el-icon>
      </el-button>
      <el-button type="text" @click="addHandleCreate()">新增记录</el-button>
    </el-col>
  </el-row>
  <!--  新增表单-->
  <el-dialog title="新增记录" v-model="dialogFormVisible" style="width: 30%">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="user">
        <el-input v-model="form.user"></el-input>
      </el-form-item>
      <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item
        label="场地名"
        :label-width="formLabelWidth"
        prop="area_name"
      >
        <el-select v-model="form.area_name" placeholder="Select">
          <el-option
            v-for="item in areaData"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item
        label="是否为会员"
        :label-width="formLabelWidth"
        prop="fellow"
      >
        <el-radio-group v-model="form.fellow">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item
        label="时长（小时）"
        :label-width="formLabelWidth"
        prop="time"
      >
        <el-input-number
          v-model="form.time"
          :min="1"
          :max="10"
          @change="handleChange"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser()">确 定</el-button>
    </div>
  </el-dialog>

  <!--  表格-->
  <div style="margin-top: 20px">
    <el-table :data="tableData" id="tables" max-height="500px">
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
      <el-table-column label="场地名" align="center">
        <template #default="scope">
          <div>
            <span>{{ scope.row.area_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="会员" align="center">
        <template #default="scope">
          <div>
            <span>{{ scope.row.fellow }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="租用总额" align="center">
        <template #default="scope">
          <div>
            <span>{{ scope.row.money }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="租用时长" align="center">
        <template #default="scope">
          <div>
            <span>{{ scope.row.time }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="日期" align="center">
        <template #default="scope">
          <div>
            <span>{{
              scope.row.end_time == null
                ? scope.row.end_time
                : scope.row.end_time.slice(0, 10)
            }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import axios from "axios"
import { watch } from 'vue'
import * as XLSX from 'xlsx'
export default {
  data () {
    return {
      input: {
        user: '',
        area_name: '',
      },
      tableData: [],
      dialogFormVisible: false,
      loadVisible: false,
      areaData: [],
      areaDataList: [],
      fellowData: '',
      is_admin: '',
      flagFellow: 0,
      flagArea: [],
      form: {
        user: '',
        phone: '',
        area_name: '',
        money: '',
        time: 1,
        end_time: '',
        fellow: '',
        status: ''
      },
      newListData: [],
      formLabelWidth: '120px',
      rules: {
        user: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { required: true, pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请输入正确的手机号格式', trigger: 'blur' }

        ], area_name: [
          { required: true, message: '请输入场地名', trigger: 'blur' },
        ], time: [
          { required: true, message: '请输入租用时间', trigger: 'blur' },
        ],
      }
    }
  },
  created () {
    this.getAll()
    this.optionArea()
  },
  methods: {
    //添加记录中的时间
    handleChange () {

    },

    confirmLoad () {
      this.loadVisible = true
    },

    //新增表单中场地选择器
    optionArea () {
      axios.get("/areas").then((res) => {
        this.areaDataList = res.data.data
        let arr = res.data.data
        arr.forEach((item) => {
          //处理数据
          this.areaData.push(item.area_name)
        })
      })
    },

    //查询全部
    getAll () {
      axios.get("/datas").then((res) => {
        this.tableData = res.data.data
      })
    },

    //点击添加记录时弹框，并清空弹窗内容
    addHandleCreate () {
      this.dialogFormVisible = true,
        this.form = {}
    },

    //添加记录
    addUser () {
      this.$refs.form.validate((valid) => {
        //判断文本框是否为空
        if (valid) {
          let dt = new Date()
          let year = dt.getFullYear()
          let month = (dt.getMonth() + 1).toString().padStart(2, '0')
          let date = dt.getDate().toString().padStart(2, '0')
          let hour = dt.getHours().toString().padStart(2, '0')
          let minute = dt.getMinutes().toString().padStart(2, '0')
          let second = dt.getSeconds().toString().padStart(2, '0')
          this.form.end_time = `${year}-${month}-${date}T${parseInt(hour) + parseInt(this.form.time)}:${minute}:${second}.000+00:00`
          // this.form.end_time = `${year}-${month}-${date}${parseInt(hour) + parseInt(this.form.time)}:${minute}:${second}.000+00:00`
          console.log(this.form.end_time)
          let area = this.areaDataList
          //判断是否为会员
          axios.get("/fellows/phone/" + this.form.phone).then(res => {
            this.flagFellow = !res.data.data ? 0 : 1
          })
          this.form.fellow = !this.flagFellow ? "否" : "是"
          area.forEach((item) => {
            if (this.form.area_name == item.area_name)
              if (this.form.fellow == "是") {
                this.form.money = item.money * this.form.time * 0.8
              } else {
                this.form.money = item.money * this.form.time
              }
          })
          //文本框不为空，则获取数据
          axios.post("/datas/", this.form).then((res) => {
            if (res.data.code == 20031) {
              ElMessage({
                message: '添加成功！',
                type: 'success',
              })
            } else if (res.data.code == 20030) {
              ElMessage({
                message: '添加失败！',
                type: 'warning',
              })
            } else {
              this.$message.error(res.data.msg)
            }
          }).finally(() => {
            this.dialogFormVisible = false
            this.getAll()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })

    },
    //查询功能
    searchData () {
      // if (this.input) {
      console.log(this.input)
      axios.post("/datas/findData", this.input).then(res => {
        if (res.data.code == 20041) {
          console.log(res.data.data)
          this.tableData = res.data.data
        } else if (res.data.code == 20040) {
          this.tableData = []
        }
      })
    },
    // 文件下载
    downLoad () {
      let workbook = XLSX.utils.table_to_book(document.getElementById('tables')) //需要在table上定义一个id
      console.log(workbook)
      try {
        XLSX.writeFile(workbook, 'BOX信息.xlsx')
        ElMessage({
          type: 'success',
          message: '导出成功!'
        })
      } catch (e) {
        ElMessage.error('导出失败,失败信息:!')
      }
    }
  }
  // }
}
</script>
<style scoped>
.el-row {
  display: flex;
  flex-wrap: nowrap;
  position: relative;
  box-sizing: border-box;
  align-items: flex-end;
}
</style>
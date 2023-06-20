<template>
  <el-row :gutter="24" class="el-row">
    <!-- 搜索 -->
    <el-col :span="20">
      <el-input
        v-model="input"
        class="w-50 m-2"
        placeholder="请输入手机号"
        style="width: 20%"
        clearable
        @clear="getAll()"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
      </el-input>
      <el-button
        type="primary"
        @click="searchData()"
        style="margin: 0 10px 0 10px; height: 30px"
        >搜索</el-button
      >
    </el-col>
    <!-- 新增按钮 -->
    <el-col :span="4">
      <el-button type="text" @click="addHandleCreate()">添加会员</el-button>
    </el-col>
  </el-row>
  <!--  新增表单-->
  <el-dialog title="添加会员" v-model="dialogFormVisible" style="width: 30%">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item
        label="会员姓名"
        :label-width="formLabelWidth"
        prop="fellow_name"
      >
        <el-input v-model="form.fellow_name"></el-input>
      </el-form-item>
      <el-form-item
        label="电话"
        :label-width="formLabelWidth"
        prop="fellow_phone"
      >
        <el-input v-model="form.fellow_phone"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="fellow_sex">
        <el-radio-group v-model="form.fellow_sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser()">确 定</el-button>
    </div>
  </el-dialog>

  <!--  表格-->
  <div style="margin-top: 20px">
    <el-table :data="tableData" max-height="500px">
      <el-table-column label="会员姓名" align="center">
        <template #default="scope">
          <div>
            <span>{{ scope.row.fellow_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template #default="scope">
          <div>
            <span>{{ scope.row.fellow_phone }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template #default="scope">
          <div>
            <span>{{ scope.row.fellow_sex }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template #default="scope">
          <div>
            <span>{{
              scope.row.fellow_date == null
                ? scope.row.fellow_date
                : scope.row.fellow_date.slice(0, 10)
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="选项" align="center">
        <template #default="scope">
          <el-button size="small" type="danger" @click="handleDelete(scope.row)"
            >取消会员</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import axios from "axios"
export default {
  data () {
    return {
      input2: "",
      input: "",
      tableData: [],
      dialogFormVisible: false,
      editFormVisible: false,
      loadVisible: false,
      form: {
        fellow_name: "",
        fellow_phone: "",
        fellow_sex: "",
        fellow_date: ""
      },
      formLabelWidth: "100px",
      rules: {
        fellow_name: [
          { required: true, message: "请输入会员姓名", trigger: "blur" },
        ],
        fellow_phone: [
          { required: true, message: "请输入会员手机号", trigger: "blur" },
          { required: true, pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
        ],
        fellow_sex: [
          { required: true, message: "请输入会员性别", trigger: "change" },
        ],
      },
    }
  },
  created () {
    this.getAll()
  },
  methods: {
    confirmLoad () {
      this.loadVisible = true
    },


    //删除会员
    handleDelete (row) {
      //弹出框
      ElMessageBox.confirm("确定取消该会员吗？", "提示", {
        type: "info",
      })
        .then(() => {
          axios
            .delete("/fellows/" + row.id)
            .then((res) => {
              if (res.data.code == 20021) {
                ElMessage({
                  message: "取消成功！",
                  type: "success",
                })
              } else {
                ElMessage({
                  message: "取消失败！",
                  type: "warning",
                })
              }
            })
            .finally(() => {
              this.getAll()
            })
        })
        .catch(() => {
          //取消删除
          ElMessage({
            type: "info",
            message: "已取消删除！",
          })
        })
    },

    //查询全部
    getAll () {
      axios.get("/fellows").then((res) => {
        this.tableData = res.data.data
      })
    },

    //点击添加会员时弹框，并清空弹窗内容
    addHandleCreate () {
      (this.dialogFormVisible = true), (this.form = {})
    },

    //添加
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
          this.form.fellow_date = `${year}-${month}-${date}T${hour}:${minute}:${second}.000+00:00`
          console.log(this.form.fellow_date)
          //文本框不为空，则获取数据
          axios
            .post("/fellows/", this.form)
            .then((res) => {
              if (res.data.code == 20011) {
                ElMessage({
                  message: "添加成功！",
                  type: "success",
                })
                console.log(this.form)
              } else if (res.data.code == 20010) {
                ElMessage({
                  message: "添加失败！",
                  type: "warning",
                })
              } else {
                this.$message.error(res.data.msg)
              }
            })
            .finally(() => {
              this.dialogFormVisible = false
              this.getAll()
            })
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },
    //通过手机号查询
    searchData () {
      // if (this.input) {
      console.log(this.input)
      axios.get("/fellows/phone/" + this.input).then(res => {
        if (res.data.code == 20041) {
          console.log(res.data.data)
          this.tableData = res.data.data
        } else if (res.data.code == 20040) {
          this.tableData = []
        }
      })
    },
  },
};
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
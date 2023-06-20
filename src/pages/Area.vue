<template>
  <el-row :gutter="24" class="el-row">
    <!-- 搜索 -->
    <el-col :span="20">
      <el-input
        v-model="input"
        class="w-50 m-2"
        placeholder="请输入场地名"
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
    <!--  新增按钮-->
    <el-col :span="4">
      <el-button type="text" @click="addHandleCreate()">新增场地</el-button>
    </el-col>
  </el-row>
  <!--  新增表单-->
  <el-dialog title="新增场地" v-model="dialogFormVisible" style="width: 30%">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item
        label="场地名"
        :label-width="formLabelWidth"
        prop="area_name"
      >
        <el-input v-model="form.area_name"></el-input>
      </el-form-item>
      <el-form-item
        label="场地面积"
        :label-width="formLabelWidth"
        prop="area_range"
      >
        <el-input v-model="form.area_range"></el-input>
      </el-form-item>
      <el-form-item
        label="场地数量"
        :label-width="formLabelWidth"
        prop="number"
      >
        <el-input v-model="form.number"></el-input>
      </el-form-item>
      <el-form-item
        label="每小时收费"
        :label-width="formLabelWidth"
        prop="money"
      >
        <el-input v-model="form.money"></el-input>
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
      <el-table-column label="场地名" align="center">
        <template #default="scope">
          <div>
            <span>{{ scope.row.area_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="场地面积" align="center">
        <template #default="scope">
          <div>
            <span>{{ scope.row.area_range }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="场地数量" align="center">
        <template #default="scope">
          <div>
            <span>{{ scope.row.number }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="每小时收费" align="center">
        <template #default="scope">
          <div>
            <span>{{ scope.row.money }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="选项" align="center">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-button size="small" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 修改信息 -->
  <el-dialog title="修改场地信息" v-model="editFormVisible" style="width: 30%">
    <el-form :model="editform" :rules="rules" ref="editform">
      <el-form-item
        label="场地名称"
        :label-width="formLabelWidth"
        prop="area_name"
      >
        <el-input v-model="editform.area_name"></el-input>
      </el-form-item>
      <el-form-item label="场地面积" :label-width="formLabelWidth" prop="email">
        <el-input v-model="editform.area_range"></el-input>
      </el-form-item>
      <el-form-item
        label="场地数量"
        :label-width="formLabelWidth"
        prop="number"
      >
        <el-input v-model="editform.number"></el-input>
      </el-form-item>
      <el-form-item
        label="每小时收费"
        :label-width="formLabelWidth"
        prop="money"
      >
        <el-input v-model="editform.money"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button @click="editFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveUser()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import axios from "axios"
import { watch } from 'vue'
export default {
  data () {
    return {
      input: '',
      tableData: [],
      dialogFormVisible: false,
      editFormVisible: false,
      loadVisible: false,
      form: {
        area_name: '',
        area_range: '',
        number: '',
        money: ''
      },
      editform: {
        area_name: '',
        area_range: '',
        number: '',
        money: ''
      },
      newListData: [],
      formLabelWidth: '100px',
      rules: {
        area_name: [
          { required: true, message: '请输入场地名', trigger: 'blur' },
        ],
        area_range: [
          { required: true, message: '请输入场地范围', trigger: 'blur', },
          { message: '请输入正确的场地范围', trigger: 'blur', pattern: '^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$' },
        ],
        number: [
          { required: true, message: '请输入场地数量', trigger: 'blur' },
        ],
        money: [
          { required: true, message: '请输入每小时收费标准', trigger: 'blur' },
        ],
      }
    }
  },
  created () {
    this.getAll()
  },
  methods: {

    //弹出编辑窗口
    handleEdit (row) {
      // editform
      axios.get("/areas/" + row.id).then((res) => {
        if (res.data.code == 20041) {
          console.log(res.data.data)
          this.editform = res.data.data
          this.editFormVisible = true
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },

    confirmLoad () {
      this.loadVisible = true
    },

    //修改场地信息
    saveUser () {
      this.dialogFormVisible = false
      this.$refs.editform.validate((valid) => {
        //判断文本框是否为空
        if (valid) {
          //文本框不为空，则获取数据
          axios.put("/areas", this.editform).then((res) => {
            if (res.data.code == 20031) {
              ElMessage({
                message: '修改成功!',
                type: 'success',
              })
            } else if (res.data.code == 20030) {
              ElMessage({
                message: '修改失败!',
                type: 'warning',
              })
            } else {
              this.$message.error(res.data.msg)
            }
          }).finally(() => {
            this.editFormVisible = false
            this.getAll()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    //删除场地
    handleDelete (row) {
      //弹出框
      ElMessageBox.confirm("此操作将永久删除当前数据，是否继续？", "提示", {
        type: "warning",
      }).then(() => {
        axios.delete("/areas/" + row.id).then((res) => {
          if (res.data.code == 20021) {
            ElMessage({
              message: '删除成功！',
              type: 'success',
            })
          } else {
            ElMessage({
              message: '删除失败！',
              type: 'warning',
            })
          }
        }).finally(() => {
          this.getAll()
        })
      }).catch(() => {
        //取消删除
        ElMessage({
          type: 'info',
          message: '取消删除！',
        })
      })
    },

    //查询全部
    getAll () {
      axios.get("/areas").then((res) => {
        this.tableData = res.data.data
      })
      console.log(this.tableData)
    },

    //点击添加员工时弹框，并清空弹窗内容
    addHandleCreate () {
      this.dialogFormVisible = true,
        this.form = {}
    },

    //添加员工
    addUser () {
      this.$refs.form.validate((valid) => {
        //判断文本框是否为空
        if (valid) {
          //文本框不为空，则获取数据
          axios.post("/areas/", this.form).then((res) => {
            if (res.data.code == 20011) {
              ElMessage({
                message: '添加成功！',
                type: 'success',
              })
            } else if (res.data.code == 20010) {
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
      if (this.input) {
        axios.get("/areas/name/" + this.input).then(res => {
          if (res.data.code == 20041) {
            this.tableData = res.data.data
            console.log(res.data.data)
          } else if (res.data.code == 20040) {
            this.tableData = []
          }
        })
      }
    }
  }
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
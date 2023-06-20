<template>
  <el-row :gutter="24" class="el-row">
    <!-- 上传文件按钮 -->
    <el-col :span="20">
      <el-button type="primary" @click="confirmLoad()">
        文件上传<el-icon class="el-icon--right"><Upload /></el-icon>
      </el-button>
    </el-col>

    <!-- 新增按钮 -->
    <el-col :span="4">
      <el-button type="text" @click="addHandleCreate()">添加员工</el-button>
    </el-col>
  </el-row>
  <!--  新增表单-->
  <el-dialog title="添加员工" v-model="dialogFormVisible" style="width: 30%">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item
        label="员工姓名"
        :label-width="formLabelWidth"
        prop="username"
      >
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="员工邮箱" :label-width="formLabelWidth" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="工作类别" prop="is_admin">
        <el-radio-group v-model="form.is_admin">
          <el-radio label="普通员工"></el-radio>
          <el-radio label="管理员"></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser()">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 文件上传 -->
  <el-dialog title="上传文件" v-model="loadVisible">
    <el-upload
      class="upload-demo"
      drag
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      multiple
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </el-upload>
  </el-dialog>
  <!--  表格-->
  <div style="margin-top: 20px">
    <el-table :data="tableData" max-height="500px">
      <el-table-column label="用户名" align="center">
        <template #default="scope">
          <div>
            <span>{{ scope.row.username }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template #default="scope">
          <div>
            <span>{{ scope.row.email }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="职位" align="center">
        <template #default="scope">
          <div>
            <span>{{ scope.row.is_admin }}</span>
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
  <el-dialog title="修改员工信息" v-model="editFormVisible" style="width: 30%">
    <el-form :model="editform" :rules="rules" ref="editform">
      <el-form-item
        label="员工姓名"
        :label-width="formLabelWidth"
        prop="username"
      >
        <el-input v-model="editform.username"></el-input>
      </el-form-item>
      <el-form-item label="员工邮箱" :label-width="formLabelWidth" prop="email">
        <el-input v-model="editform.email"></el-input>
      </el-form-item>
      <el-form-item
        label="员工职位"
        :label-width="formLabelWidth"
        prop="is_admin"
      >
        <el-radio-group v-model="editform.is_admin">
          <el-radio label="普通员工"></el-radio>
          <el-radio label="管理员"></el-radio>
        </el-radio-group>
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
export default {
  data () {
    return {
      input2: "",
      tableData: [],
      dialogFormVisible: false,
      editFormVisible: false,
      loadVisible: false,
      form: {
        username: "",
        email: "",
        is_admin: "",
      },
      editform: {
        username: "",
        email: "",
        is_admin: "",
      },
      formLabelWidth: "100px",
      rules: {
        username: [
          { required: true, message: "请输入员工姓名", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入员工邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        is_admin: [
          { required: true, message: "请输入员工职位", trigger: "change" },
        ],
      },
    }
  },
  created () {
    this.getAll()
  },
  methods: {
    //弹出编辑窗口
    handleEdit (row) {
      // editform
      axios.get("/users/" + row.id).then((res) => {
        if (res.data.code == 20041) {
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

    //修改员工信息
    saveUser () {
      this.dialogFormVisible = false
      this.$refs.editform.validate((valid) => {
        //判断文本框是否为空
        if (valid) {
          //文本框不为空，则获取数据
          axios.put("/users", this.editform).then((res) => {
            if (res.data.code == 20031) {
              ElMessage({
                message: "修改成功!",
                type: "success",
              })
            } else if (res.data.code == 20030) {
              ElMessage({
                message: "修改失败!",
                type: "warning",
              })
            } else {
              this.$message.error(res.data.msg)
            }
          })
            .finally(() => {
              this.editFormVisible = false
              this.getAll()
            })
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },

    //删除员工
    handleDelete (row) {
      //弹出框
      ElMessageBox.confirm("此操作将永久删除当前数据，是否继续？", "提示", {
        type: "info",
      })
        .then(() => {
          axios
            .delete("/users/" + row.id)
            .then((res) => {
              if (res.data.code == 20021) {
                ElMessage({
                  message: "删除成功！",
                  type: "success",
                })
              } else {
                ElMessage({
                  message: "删除失败！",
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
            message: "取消删除！",
          })
        })
    },

    //查询全部
    getAll () {
      axios.get("/users").then((res) => {
        this.tableData = res.data.data
      })
    },

    //点击添加员工时弹框，并清空弹窗内容
    addHandleCreate () {
      (this.dialogFormVisible = true), (this.form = {})
    },

    //添加员工
    addUser () {
      this.$refs.form.validate((valid) => {
        //判断文本框是否为空
        if (valid) {
          //文本框不为空，则获取数据
          axios
            .post("/users/", this.form)
            .then((res) => {
              if (res.data.code == 20011) {
                ElMessage({
                  message: "添加成功！",
                  type: "success",
                })
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
<template>
  <fieldset style="text-align: left; margin: 0 auto; width: 30%; border: none">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" disabled />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" type="email" />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="ruleForm.password" type="password" />
      </el-form-item>
      <el-form-item label="再次确认密码" prop="password1">
        <el-input v-model="ruleForm.password1" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">修改</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </fieldset>
</template>
<script>
import axios from "axios"
export default {
  data () {
    return {
      ruleForm: {
        id: "",
        username: "",
        password: "",
        password1: "",
        email: "",
        is_admin: ""
      },
      rules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            pattern: /^[a-zA-Z](?![a-zA-Z]+$)\w{5,19}$/,
            message: "新密码需有字母、数字或下划线中的至少两种且首位为字母",
            trigger: "blur",
          },
        ],
        password1: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            pattern: /^[a-zA-Z](?![a-zA-Z]+$)\w{5,19}$/,
            message: "新密码需有字母、数字或下划线中的至少两种且首位为字母",
            trigger: "blur",
          },
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.ruleForm.resetFields()
      this.initialData()
    },
    submitForm () {
      if (this.ruleForm.password != this.ruleForm.password1) {
        ElMessage({
          type: "warning",
          message: "两次输入密码不一致"
        })
        this.$refs.ruleForm.resetFields()
        this.initialData()
      } else {
        axios.put('/users', this.ruleForm).then((res) => {
          if (res.data.code == 20031) {
            ElMessage({
              type: "success",
              message: "修改成功"
            })
            this.$refs.ruleForm.resetFields()
            this.initialData()
          }
        })
      }


    },
    initialData () {
      this.ruleForm.id = this.$cookies.get('userval').id
      this.ruleForm.email = this.$cookies.get('userval').email
      this.ruleForm.username = this.$cookies.get('userval').username
      this.ruleForm.is_admin = this.$cookies.get('userval').is_admin
    }
  },
  mounted () {
    this.initialData()
  }
}
</script>
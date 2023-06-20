<template>
  <div class="frame">
    <h1 style="text-align: center; color: #999">运动场地管理系统</h1>
    <h2 style="text-align: center; color: #999">用户登录</h2>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model="ruleForm.code"></el-input>
        <div class="s-canvas">
          <canvas
            id="s-canvas"
            :width="contentWidth"
            :height="contentHeight"
            @click="refreshIdentifyCode()"
          ></canvas>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >登录</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios'
import store from '/src/store/index'
export default {
  props: {
    fontSizeMin: {
      type: Number,
      default: 25
    },
    fontSizeMax: {
      type: Number,
      default: 30
    },
    backgroundColorMin: {
      type: Number,
      default: 255
    },
    backgroundColorMax: {
      type: Number,
      default: 255
    },
    colorMin: {
      type: Number,
      default: 0
    },
    colorMax: {
      type: Number,
      default: 160
    },
    lineColorMin: {
      type: Number,
      default: 100
    }, lineColorMax: {
      type: Number,
      default: 255
    },
    dotColorMin: {
      type: Number,
      default: 0
    },
    dotColorMax: {
      type: Number,
      default: 255
    },
    contentWidth: {
      type: Number,
      default: 112
    },
    contentHeight: {
      type: Number,
      default: 31
    }
  },
  data () {
    return {
      ruleForm: {
        username: '',
        password: '',
        code: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
      },
      identifyCode: "", //密码登录图形验证码
      identifyCodes: "1234567890abcdefghizklmnopqrstuvwxyz" //生成图形验证码的依据
    }
  },
  methods: {
    //登录
    submitForm (formName) {
      let flag = 0
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.identifyCode != this.ruleForm.code) {
            ElMessage({
              type: 'warning',
              message: '验证码输入错误',
            })
            this.refreshIdentifyCode()
          } else {
            axios.post("/users/login/", this.ruleForm).then((res) => {
              if (res.data.code == 20041 && this.identifyCode == this.ruleForm.code) {
                ElMessage({
                  type: "success",
                  message: "登录成功"
                })
                this.$cookies.set('userval', res.data.data)
                store.commit('setToken', res.data.token)

                localStorage.setItem('token', res.data.token)
                window.location.href = 'http://localhost:5173/#/home'
                // 登录成功的时候更新当前路由
              } else if (res.data.code == 20040) {
                ElMessage({
                  type: 'warning',
                  message: '用户或密码错误，请重新输入',
                })
                // localStorage.setItem('token', 0)
                this.resetForm(formName)
                this.refreshIdentifyCode()
              }
            })
          }
        } else {
          this.$message.error("用户登录失败，请重新输入")
        }
      })
    },
    // 将输入内容清空
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 刷新验证码
    refreshIdentifyCode () {
      this.identifyCode = ""
      this.makeIdentifyCode(4)
    },
    // 生成4位数的随机验证码
    makeIdentifyCode (l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode +=
          this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
    },
    // 生成单个验证码
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 生成一个随机的颜色
    randomColor (min, max) {
      let r = this.randomNum(min, max)
      let g = this.randomNum(min, max)
      let b = this.randomNum(min, max)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    drawPic () {
      let canvas = document.getElementById('s-canvas')
      let ctx = canvas.getContext('2d')
      ctx.textBaseline = 'bottom'
      // 绘制背景
      ctx.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax)
      ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
      // 绘制文字
      for (let i = 0; i < this.identifyCode.length; i++) {
        this.drawText(ctx, this.identifyCode[i], i)
      }
      this.drawLine(ctx)
      this.drawDot(ctx)
    },
    drawText (ctx, txt, i) {
      ctx.fillStyle = this.randomColor(this.colorMin, this.colorMax)
      ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei'
      let x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1))
      let y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
      var deg = this.randomNum(-45, 45)
      // 修改坐标原点和旋转角度
      ctx.translate(x, y)
      ctx.rotate(deg * Math.PI / 180)
      ctx.fillText(txt, 0, 0)
      // 恢复坐标原点和旋转角度
      ctx.rotate(-deg * Math.PI / 180)
      ctx.translate(-x, -y)
    },
    drawLine (ctx) {
      // 绘制干扰线
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = this.randomColor(this.lineColorMin, this.lineColorMax)
        ctx.beginPath()
        ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
        ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
        ctx.stroke()
      }
    },
    drawDot (ctx) {
      // 绘制干扰点
      for (let i = 0; i < 80; i++) {
        ctx.fillStyle = this.randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  },
  mounted () {
    // 初始化验证码
    this.identifyCode = ""
    this.makeIdentifyCode(4)
  },
  watch: {
    identifyCode () {
      this.drawPic()
    }
  },
}
</script>
<style>
.frame {
  width: 355px;
  height: 50%;
  padding: 3% 2%;
  margin-top: 4%;
  margin-left: 30%;
  background: inherit;
  border-radius: 18px;
  box-shadow: 1px 1px 3px #999, 2px 2px 3px #999, 3px 3px 3px #999;
}
</style>
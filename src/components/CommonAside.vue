<template>
  <el-aside :width="isCollapse ? '140px' : '64px'">
    <el-menu
      class="el-menu-vertical-demo"
      :collapse="!isCollapse"
      :collapse-transition="false"
    >
      <h3 v-show="isCollapse" class="title" @click="clickHome()">后台管理</h3>
      <h3 v-show="!isCollapse" class="title" @click="clickHome()">后台</h3>
      <el-menu-item
        :index="item.path"
        v-for="item in list"
        :key="item.path"
        @click="clickMenu(item)"
      >
        <component class="icons" :is="item.icon"></component>
        &nbsp;&nbsp;
        <span> {{ item.label }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  data () {
    return {
      admin: '',
      listCommon: [
        {
          path: "/area",
          name: "area",
          label: "场地管理",
          icon: "Basketball",
          url: "AreaManage"
        }, {
          path: "/data",
          name: "data",
          label: "租用记录",
          icon: "Timer",
          url: "DataManage"
        }, {
          path: "/fellow",
          name: "fellow",
          label: "会员管理",
          icon: "Star",
          url: "FellowManage"
        }, {
          path: "/user",
          name: "user",
          label: "个人中心",
          icon: "User",
          url: "UserManage"
        }
      ],
      listAdmin: [
        {
          path: "/area",
          name: "area",
          label: "场地管理",
          icon: "Basketball",
          url: "AreaManage"
        }, {
          path: "/data",
          name: "data",
          label: "租用记录",
          icon: "Timer",
          url: "DataManage"
        }, {
          path: "/fellow",
          name: "fellow",
          label: "会员管理",
          icon: "Star",
          url: "FellowManage"
        }, {
          path: "/employee",
          name: "employee",
          label: "员工管理",
          icon: "Postcard",
          url: "EmployeeManage"
        }, {
          path: "/user",
          name: "user",
          label: "个人中心",
          icon: "User",
          url: "UserManage"
        }
      ],
      list: []
    }
  },
  setup () {
    const router = useRouter()
    const store = useStore()
    const clickMenu = (item) => {
      router.push({
        name: item.name
      })
    }
    const clickHome = () => {
      router.push({
        name: "home"
      })
    }
    return {
      clickMenu,
      clickHome
    }
  },
  computed: {
    isCollapse () {
      return this.$store.state.isCollapse
    },
  },
  methods: {
    isAdmin () {

      this.admin = this.$cookies.get('userval').is_admin
      if (this.admin == '管理员') {
        this.list = this.listAdmin
      } else {
        this.list = this.listCommon
      }
    }
  },
  mounted () {
    this.isAdmin()
  },
}
</script>

<style lang="less" scoped>
el-aside {
  border-right-style: inset;
}
.icons {
  width: 18px;
  height: 18px;
}
.title {
  text-align: center;
  cursor: pointer;
}
</style>
<template>
  <div>
    <el-form :model="formData" label-position="right" label-width="80px">
      <el-form-item label="请求标题:">
        <el-input v-model="formData.title" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="请求内容:">
        <el-input v-model="formData.content" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="请求时间:">
        <el-date-picker v-model="formData.createTime" type="date" placeholder="选择日期" clearable></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="save">保存</el-button>
        <el-button size="mini" type="primary" @click="back">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  createAppLog,
  updateAppLog,
  findAppLog
} from '@/api/system_tools/appLog' //  此处请自行替换地址
import infoList from '@/utils/infoList'
export default {
  name: 'AppLog',
  mixins: [infoList],
  data() {
    return {
      type: '',
      formData: {
        title: '',
        content: '',
        createTime: new Date(),
      }
    }
  },
  async created() {
    // 建议通过url传参获取目标数据ID 调用 find方法进行查询数据操作 从而决定本页面是create还是update 以下为id作为url参数示例
    if (this.$route.query.id) {
      const res = await findAppLog({ ID: this.$route.query.id })
      if (res.code === 0) {
        this.formData = res.data.reappLog
        this.type = 'update'
      }
    } else {
      this.type = 'create'
    }
  },
  methods: {
    async save() {
      let res
      switch (this.type) {
        case 'create':
          res = await createAppLog(this.formData)
          break
        case 'update':
          res = await updateAppLog(this.formData)
          break
        default:
          res = await createAppLog(this.formData)
          break
      }
      if (res.code === 0) {
        this.$message({
          type: 'success',
          message: '创建/更改成功'
        })
      }
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style>
</style>

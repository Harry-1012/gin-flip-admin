<template>
  <div>
    <div class="search-term">
      <el-form
        :inline="true"
        :model="searchInfo"
        class="demo-form-inline"
      >
        <el-form-item label="内容">
          <el-input
            v-model="searchInfo.content"
            placeholder="内容"
          />
        </el-form-item>
        <el-form-item label="标题">
          <el-input
            style="width:120px;"
            v-model="searchInfo.title"
            placeholder="标题"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            size="mini"
            type="primary"
            @click="onSubmit"
          >查询</el-button>
          <el-button
            size="mini"
            type="info"
            @click="deleteYearOld"
          >清空一年前的日志</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="openDialog"
          >新增</el-button>
          <el-popover
            v-model:visible="deleteVisible"
            placement="top"
            width="160"
          >
            <p>确定要删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="deleteVisible = false"
              >取消</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="onDelete"
              >确定</el-button>
            </div>
            <template #reference>
              <el-button
                size="mini"
                type="danger"
                style="margin-left: 10px;"
              >批量删除</el-button>
            </template>
          </el-popover>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      border
      stripe
      style="width: 100%"
      tooltip-effect="dark"
      :data="tableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
      />
      <el-table-column
        label="日期"
        width="100"
      >
        <template #default="scope">{{ formatDate(scope.row.createTime) }}</template>
      </el-table-column>
      <el-table-column
        label="请求标题"
        width="160"
        prop="title"
      />
      <el-table-column
        label="请求内容"
        prop="content"
      >
        <template #default="scope">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="scope.row.content"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="按钮组"
        width="86"
      >
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            class="table-button"
            @click="updateAppLog(scope.row)"
          >编辑</el-button><br>
          <el-button
            type="danger"
            size="mini"
            @click="deleteRow(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="page"
      :page-size="pageSize"
      :page-sizes="[10, 30, 50, 100]"
      :style="{float:'right',padding:'20px'}"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <el-dialog
      v-model="dialogFormVisible"
      :before-close="closeDialog"
      title="弹窗操作"
    >
      <el-form
        :model="formData"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="请求标题:">
          <el-input
            v-model="formData.title"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="请求内容:">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="formData.content"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="请求时间:">
          <el-date-picker
            v-model="formData.createTime"
            type="date"
            placeholder="选择日期"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button
            type="primary"
            @click="enterDialog"
          >确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  createAppLog,
  deleteAppLog,
  deleteAppLogByIds,
  updateAppLog,
  findAppLog,
  getAppLogList,
} from "@/api/system_tools/appLog"; //  此处请自行替换地址
import infoList from "@/utils/infoList";
export default {
  name: "AppLog",
  mixins: [infoList],
  data() {
    return {
      listApi: getAppLogList,
      dialogFormVisible: false,
      type: "",
      deleteVisible: false,
      multipleSelection: [],
      formData: {
        title: "",
        content: "",
        createTime: new Date(),
      },
    };
  },
  async created() {
    await this.getTableData();
  },
  methods: {
    // 条件搜索前端看此方法
    onSubmit() {
      this.page = 1;
      this.pageSize = 10;
      this.getTableData();
    },
    deleteYearOld(){
       findAppLog({ ID: 666 })
        this.$message({
          type: "success",
          message: "删除一年前数据成功",
        })
      this.getTableData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteRow(row) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteAppLog(row);
      });
    },
    async onDelete() {
      const ids = [];
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择要删除的数据",
        });
        return;
      }
      this.multipleSelection &&
        this.multipleSelection.map((item) => {
          ids.push(item.ID);
        });
      const res = await deleteAppLogByIds({ ids });
      if (res.code === 0) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        if (this.tableData.length === ids.length && this.page > 1) {
          this.page--;
        }
        this.deleteVisible = false;
        this.getTableData();
      }
    },
    async updateAppLog(row) {
      const res = await findAppLog({ ID: row.ID });
      this.type = "update";
      if (res.code === 0) {
        this.formData = res.data.reappLog;
        this.dialogFormVisible = true;
      }
    },
    closeDialog() {
      this.dialogFormVisible = false;
      this.formData = {
        title: "",
        content: "",
        createTime: new Date(),
      };
    },
    async deleteAppLog(row) {
      const res = await deleteAppLog({ ID: row.ID });
      if (res.code === 0) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        if (this.tableData.length === 1 && this.page > 1) {
          this.page--;
        }
        this.getTableData();
      }
    },
    async enterDialog() {
      let res;
      switch (this.type) {
        case "create":
          res = await createAppLog(this.formData);
          break;
        case "update":
          res = await updateAppLog(this.formData);
          break;
        default:
          res = await createAppLog(this.formData);
          break;
      }
      if (res.code === 0) {
        this.$message({
          type: "success",
          message: "创建/更改成功",
        });
        this.closeDialog();
        this.getTableData();
      }
    },
    openDialog() {
      this.type = "create";
      this.dialogFormVisible = true;
    },
  },
};
</script>

<style>
</style>

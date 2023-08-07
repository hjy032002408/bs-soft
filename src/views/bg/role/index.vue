<template>
  <div>
    <!-- 搜索 -->
    <div id="search" style="margin-left: 25px; margin-top: 15px">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="角色名称">
          <el-input
            v-model="roleQuery.name"
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            style="margin-left: 5px"
            type="primary"
            @click="queryRoleByName"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作 -->
    <div
      id="action"
      style="margin-bottom: 20px; margin-top: -0px; margin-left: 20px;"
    >
      <el-button
        type="primary"
        style="margin-left: 5px"
        icon="el-icon-plus"
        @click="handleAddRole"
      >增加</el-button>
      <el-button
        type="danger"
        style="margin-left: 5px"
        icon="el-icon-delete"
        @click="batchRemoveRole"
      >删除</el-button>
      <el-button
        type="primary"
        style="margin-left: 5px"
        icon="el-icon-video-play"
        @click="resourceDevelop"
      >资源分配</el-button>
      <el-button
        type="primary"
        style="margin-left: 5px"
        icon="el-icon-s-custom"
        @click="getUserAll"
      >用户分配</el-button>
      <el-button
        type="primary"
        style="margin-left: 5px"
        icon="el-icon-s-custom"
        disabled
      >公司分配</el-button>
      <el-button
        type="primary"
        style="margin-left: 5px"
        icon="el-icon-refresh"
        @click="refreshData"
      >刷新</el-button>
    </div>
    <!--主体表格-->
    <el-table
      id="roleTable"
      ref="roleTable"
      v-loading="listLoading"
      :data="tableData"
      row-key="id"
      tooltip-effect="dark"
      highlight-current-row
      style="width: 100%; margin-top: 10px"
      border
      height="620px"
      @row-dblclick="handleEditRole"
    >
      <el-table-column
        type="selection"
        reserve-selection="true"
        width="40"
      />
      <el-table-column
        prop="id"
        label="序号"
        width="120"
      >
        <template slot-scope="scope">{{ (scope.$index+1)+(rolePage.pageNum-1)*rolePage.pageSize }}</template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="角色"
        width="126"
        align="center"
      />
      <el-table-column
        prop="code"
        label="角色编号"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="remark"
        label="角色备注"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="companyDTO.name"
        label="所属公司"
        align="center"
      />
      <el-table-column
        prop="organizationDTO.name"
        align="center"
        label="所属机构"
      />
      <el-table-column align="center" label="是否启用">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.status === 1"
            size="mini"
            type="success"
          >
            启用
          </el-tag>
          <el-tag
            v-else
            size="mini"
            type="danger"
          >
            停用
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="300"
      >
        <template slot-scope="scope">
          <div>
            <el-button
              type="primary"
              size="mini"
              style="margin-left: 5px"
              @click="handleCopyRole(scope.row)"
            >复制</el-button>
            <el-button
              size="mini"
              style="margin-left: 5px"
              @click="handleEditRole(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              style="margin-left: 5px"
              @click="removeRole(scope.row)"
            >删除</el-button>
            <el-button
              type="warning"
              size="mini"
              style="margin-left: 5px"
              @click="resourceCheck(scope.row)"
            >查看权限</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      align="center"
      :v-model="rolePage"
      :current-page.sync="rolePage.pageNum"
      :page-size="rolePage.pageSize"
      :page-sizes="[10, 15, 20, 50, 100, 200]"
      layout="total,sizes,prev, pager, next, jumper"
      :total="rolePage.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 增加弹框 -->
    <RoleDialog
      ref="AddRoleDialog"
      dialogtype="ADD"
      @update="fetchData(rolePage.pageNum)"
    />
    <!-- 复制弹框 -->
    <RoleDialog
      ref="CopyRoleDialog"
      dialogtype="COPY"
      @update="fetchData(rolePage.pageNum)"
    />
    <!-- 编辑弹框 -->
    <RoleDialog
      ref="EditRoleDialog"
      dialogtype="EDIT"
      @update="fetchData(rolePage.pageNum)"
    />
    <!-- 用户分配弹框 -->
    <RoleDialog
      ref="UserDialog"
      dialogtype="USER"
      @update="fetchData(rolePage.pageNum)"
    />
    <!-- 资源分配 -->
    <RoleDialog
      ref="ResourceDialog"
      dialogtype="RESOURCE"
      @update="fetchData(rolePage.pageNum)"
    />
    <!-- 资源分配 -->
    <RoleDialog
      ref="ResourceDialogCheck"
      dialogtype="RESOURCECHECK"
      @update="fetchData(rolePage.pageNum)"
    />
  </div>
</template>

<script>
import {
  remove,
  batchRemove,
  commonQuery
} from '@/api/right/role'
import RoleDialog from './role-dialog.vue'
export default {
  name: 'Role',
  components: { RoleDialog },
  data: function() {
    return {
      listLoading: false,
      // 角色相关数据
      tableData: [],
      // 角色页面
      rolePage: {
        total: null,
        // 页号
        pageNum: 1,
        // 页大小
        pageSize: 10,

        pages: null
      },
      roleQuery: { companyId: '' },
      roleDto: {
        name: '',
        code: '',
        remark: '',
        id: '',
        status: '',
        version: '',
        created_by: '',
        companyId: '',
        tenantId: '',
        orgId: ''
      }
    }
  },
  created() {
    this.fetchData(this.rolePage.pageNum)
  },
  methods: {
    /**
     * 页数改变
     * @param {*} val
     */
    handleCurrentChange(val) {
      this.fetchData(val)
    },
    //
    /**
     * 页记录数改变
     * @param {*} val
     */
    handleSizeChange(val) {
      this.rolePage.pageSize = val
      this.fetchData(this.rolePage.pageNum)
    },
    /**
     * 导入全部数据,
     * 根据页号导入数据
     * @param {*} pageNum
     */
    fetchData(pageNum) {
      this.listLoading = true
      this.roleQuery.total = this.rolePage.total
      this.roleQuery.pageNum = pageNum
      this.roleQuery.pageSize = this.rolePage.pageSize
      commonQuery(this.roleQuery)
        .then((response) => {
          // 如果异常则被axios 的拦截器拦截并且显示错误码和消息
          const { total, pages } = response
          // parseInt()：解析一个字符串，并返回一个整数。
          this.rolePage.total = parseInt(total)
          this.rolePage.pages = parseInt(pages)
          this.tableData = response.data
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
          const roleName = this.$route.query.name
          // 点击角色跳转存在则选中
          // 根据角色名字查找数据
          if (roleName) {
            const tableDate = this.tableData.find(
              (item) => item.name === roleName
            )
            this.$nextTick(() => {
              this.$refs.roleTable.toggleRowSelection(tableDate, true)
            })
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    /**
     * 刷新
     * @param rolePage.pageNum
     */
    refreshData() {
      this.fetchData(this.rolePage.pageNum)
    },
    /**
     * 通过名字查询
     * @param rolePage.pageNum
     */
    queryRoleByName() {
      this.rolePage.total = null
      this.rolePage.pages = null
      this.rolePage.pageNum = 1
      this.fetchData(this.rolePage.pageNum)
    },
    /**
     * 增加角色
     */
    handleAddRole() {
      this.$nextTick(() => {
        // refs调用上方子组件里面的函数
        this.$refs.AddRoleDialog.ShowroleDialogVisible()
      })
    },
    /**
     * 复制角色
     * @param {*} row
     */
    handleCopyRole(row) {
      this.$nextTick(() => {
        this.$refs.CopyRoleDialog.ShowUpdataDialogVisible(row)
      })
    },
    /**
     * 编辑角色
     * @param {*} row
     */
    handleEditRole(row) {
      this.$nextTick(() => {
        this.$refs.EditRoleDialog.ShowUpdataDialogVisible(row)
      })
    },
    /**
     * 查询所有用户
     * @param roleVo
     */
    getUserAll() {
      const roleVo = this.$refs.roleTable.selection
      if (roleVo == null || roleVo.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }
      this.$nextTick(() => {
        this.$refs.UserDialog.ShowUserDialog(roleVo)
      })
    },
    /**
     * 资源分配、
     * @param roleVo
     */
    resourceDevelop() {
      const roleVo = this.$refs.roleTable.selection
      if (roleVo == null || roleVo.length === 0) {
        this.$message.error('至少选择一个角色进行操作')
        return
      }
      this.$nextTick(() => {
        this.$refs.ResourceDialog.ShowResourceDialog(roleVo)
      })
    },
    /**
     *  查看权限
     * @param {*} row
     */
    resourceCheck(row) {
      this.$nextTick(() => {
        this.$refs.ResourceDialog.ShowResourceDialogCheck(row)
      })
    },
    /**
     * 批量删除
     * @param roleDtoS
     */
    batchRemoveRole() {
      // console.log(this.$refs.roleTable.selection)
      const roleVo = this.$refs.roleTable.selection
      if (roleVo == null || roleVo.length === 0) {
        this.$message.error('至少选择一条进行操作')
        return
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const roleDtoS = []
          for (let i = 0; i < roleVo.length; i++) {
            roleDtoS.push(
              {
                id: roleVo[i].id,
                version: roleVo[i].version
              }
            )
          }
          // 批量删除后端接口
          batchRemove(roleDtoS)
            .then((response) => {
              if (response.body === false) {
                this.$message.error(response.head.message)
              }
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              roleVo.length = 0
              // 刷新界面
              this.fetchData(1)
            })
            .catch((err) => {
              console.log(err)
              // this.$message.error('发生错误：' + err)
              this.$message.error('选中用户中多个存在资源，不能删除')
              this.fetchData(1)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    /**
     * 行删除
     * @param {*} row
     */
    removeRole(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'del-model',
        type: 'warning'
      })
        .then(() => {
          // 根据id和版本匹配删除
          remove(row.id, row.version)
            .then((response) => {
              if (response.body === false) {
                this.$message.error(response.head.message)
              }
              // 刷新界面
              this.fetchData(1)
            })
            .catch((err) => {
              // 可能是发生网络异常
              this.$message.error('发生错误:' + err)
            })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.clearfix {
  &:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: ' ';
    clear: both;
    height: 0;
  }
}
.box-card {
  height: 500px;
}
</style>

<template>
  <!-- 增加,复制，修改表单 -->
  <div v-if="roleDialogVisible" ref="roleForm">
    <el-dialog
      :title="Title"
      :visible.sync="roleDialogVisible"
      width="50%"
    >
      <el-form
        ref="roleForm"
        :model="roleDto"
        :rules="rules"
      >
        <el-form-item
          label="角色名称"
          prop="name"
        >
          <el-input
            v-model="roleDto.name"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="角色代码"
          prop="code"
        >
          <el-input
            v-model="roleDto.code"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="角色备注"
          prop="remark"
        >
          <el-input
            v-model="roleDto.remark"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="是否启用"
        >
          <template>
            <el-radio v-model="roleDto.status" :label="1">是</el-radio>
            <el-radio v-model="roleDto.status" :label="0">否</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="handleOkEvent('roleForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>

  <!-- 用户分配 -->
  <div v-else-if="userdialogVisible">
    <el-dialog
      :title="Title"
      :visible.sync="userdialogVisible"
      :before-close="handleClose"
      width="50%"
    >
      <el-form :inline="true">
        <el-form-item label="用户名称：">
          <el-input v-model="userQuery.name" placeholder="请输入用户名称" />
        </el-form-item>
        <el-button
          style="margin-left: 5px"
          type="primary"
          @click="queryUserByName"
        >查询</el-button>
      </el-form>
      <el-table
        ref="userTable"
        v-loading="listLoading"
        :data="userData"
        row-key="id"
        highlight-current-row
        height="350"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          reserve-selection="true"
          width="55"
        />
        <el-table-column
          prop="id"
          label="序号"
          width="120"
        >
          <template slot-scope="scope">{{ (scope.$index+1)+(userPage.pageNum-1)*userPage.pageSize }}</template>
        </el-table-column>
        <el-table-column prop="code" label="用户工号" align="center" />
        <el-table-column prop="name" label="用户名" align="center" />
        <el-table-column prop="company.name" label="公司" align="center" />
        <el-table-column prop="department.name" label="部门" align="center" />
      </el-table>
      <!-- 分页器-->
      <el-pagination
        :v-model="userPage"
        :current-page.sync="userPage.pageNum"
        :page-size="userPage.pageSize"
        :page-sizes="[15]"
        layout="total,sizes,prev, pager, next, jumper"
        :total="userPage.total"
        @size-change="handleUserSizeChange"
        @current-change="handleUserDataChange"
      />
      <span slot="footer">
        <el-button
          style="margin-left: 30px"
          @click="handleClose"
        >取 消</el-button>
        <!-- 分配用户 -->
        <el-button type="primary" @click="assignUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  <!-- 资源分配 -->
  <div v-else-if="resourcedialogVisible">
    <el-dialog
      :title="Title"
      :visible.sync="resourcedialogVisible"
      :before-close="handleClose"
      width="50%"
    >
      <BossTree ref="tree" />
      <span slot="footer">
        <el-button
          style="margin-left: 30px"
          @click="handleClose"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="assignResource"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
  <!-- 查看权限 -->
  <div v-else-if="resourcedialogVisiblecheck">
    <el-dialog
      :title="Title"
      :visible.sync="resourcedialogVisiblecheck"
      :before-close="handleClose"
      width="50%"
    >
      <BossTree ref="tree" resourcedialogtype="REVIEW" />
      <span slot="footer">
        <el-button
          style="margin-left: 30px"
          @click="handleClose"
        >取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  add,
  modify,
  commonQueryUser,
  assignUser,
  assignResource
} from '@/api/right/role'
import { treeQuery } from '@/api/right/resource'
export default {
  name: 'RoleDialog',
  // 定义对话框扩展属性
  props: {
    dialogtype: String
  },
  data() {
    return {
      // 角色相关数据
      roleVo: {},
      userQuery: {},
      // 拥护相关数据
      userData: [],
      // 保存选中的id
      roleIdList: [],
      userIdList: [],
      resourceIdList: [],
      resourcedialogtype: '',
      // 控制显示
      userdialogVisible: false,
      resourcedialogVisible: false,
      resourcedialogVisiblecheck: false,
      companydialogVisible: false,
      isReviewPerMission: false,
      roleDialogVisible: false,
      updatedialogVisible: false,
      listLoading: false,

      Title: '',
      addTitle: '增加角色',
      updateTitle: '修改角色',
      userTitle: '用户分配',
      resourceTitle: '资源分配',
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '角色编号不能为空', trigger: 'blur' }
        ],
        remark: [{ required: false, message: '备注不能为空', trigger: 'blur' }],
        companyId: [
          { required: true, message: '所属公司不能为空', trigger: 'change' }
        ]
      },
      // 角色数据
      roleDto: {
        name: '',
        // 编号
        code: '',
        // 备注
        remark: '',
        id: '',
        // 是否启用
        status: '',
        // 版本
        version: '',
        created_by: '',
        companyId: '',
        tenantId: '',
        orgId: ''
      },
      // 用户分配页面的数据
      userPage: {
        // 总数据数
        total: null,
        // 页号
        pageNum: 1,
        // 页大小
        pageSize: 15,

        pages: null
      }
    }
  },
  created() {
    this.getUser(this.userPage)
  },
  mounted() {
    this.initUi()
  },
  methods: {
    /**
     * 数据初始化
     */
    initUi() {
      this.roleDto = {}
    },
    /**
     * 页数改变
     * @param {*} val
     */
    handleUserDataChange(val) {
      this.userPage.pageNum = val
      // console.log(this.userPage.pageNum)
      this.getUser(this.userPage)
    },
    /**
     * 页记录数改变
     * @param {*} val
     */
    handleUserSizeChange(val) {
      this.userPage.pageSize = val
      this.getUser(this.userPage)
    },
    /**
     * 关闭弹窗
     */
    handleClose() {
      this.roleDialogVisible = false
      this.updatedialogVisible = false
      this.userdialogVisible = false
      this.resourcedialogVisible = false
      this.companydialogVisible = false
      this.resourcedialogVisiblecheck = false
    },
    /**
     * 判断
     * @param {*} form
     */
    handleOkEvent(form) {
      if (
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.dialogtype === 'ADD') {
              this.addRole()
            } else if (this.dialogtype === 'COPY') {
              this.copyRole(this.roleDto)
            } else if (this.dialogtype === 'EDIT') {
              this.updateFromInfo(this.roleDto)
            } else if (this.dialogtype === 'USER') {
              this.ShowUserDialog(this.roleVo)
            } else if (this.dialogtype === 'RESOURCE') {
              this.ShowResourceDialog(this.roleVo)
            } else if (this.dialogtype === 'RESOURCECHECK') {
              this.ShowResourceDialogCheck(this.roleVo)
            }
          } else {
            return false
          }
        })
      );
    },
    /**
     * 增加角色
     * @param roleDto
     */
    addRole() {
      this.roleDialogVisible = false
      this.roleDto.version = '1'
      this.roleDto.createdBy = '2'
      this.roleDto.tenantId = '1'
      this.roleDto.companyId = '1'
      this.roleDto.orgId = '1337376369553833984'
      add(this.roleDto)
        .then((response) => {
          // 新增之后重新加载
          this.$emit('update')
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    /**
     * 复制角色
     * @param {*} roleDto
     */
    copyRole(roleDto) {
      this.roleDialogVisible = false
      this.roleDto.version = '1'
      this.roleDto.createdBy = '2'
      this.roleDto.tenantId = '1'
      this.roleDto.companyId = '1'
      this.roleDto.orgId = '1337376369553833984'
      // JSON.parse()：从一个字符串中解析出json对象
      // json.stringify()：将对象、数组转换成字符串
      const roleVo = JSON.parse(JSON.stringify(this.roleDto))
      add(roleVo)
        .then((response) => {
          // 新增之后重新加载
          this.$emit('update')
          this.$message({
            type: 'success',
            message: '复制成功!'
          })
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
        .catch(() => {
          this.listLoading = false
        })
        .finally(() => {
          this.dialogType = ''
          this.updatedialogVisible = false
        })
    },
    /**
     * 修改角色
     * @param {*} roleDto
     */
    updateFromInfo(roleDto) {
      this.roleDialogVisible = false
      modify(roleDto)
        .then((response) => {
          // 编辑之后重新加载
          this.$emit('update')
          this.$message({
            type: 'success',
            message: '编辑成功!'
          })
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    /**
     * 资源分配
     * @param roleResourceDTO
     */
    assignResource() {
      const list = this.$refs.tree.getCheckedNodes()
      const listParent = this.$refs.tree.getHalfCheckedKeys()
      listParent.map((item) => {
        this.resourceIdList.push(item)
      })
      this.listLoading = true
      for (let i = 0; i < list.length; i++) {
        this.resourceIdList.push(list[i].id)
      }
      // 构建角色资源对象
      const roleResourceDTO = {
        roleIds: this.roleIdList,
        resourceIds: this.resourceIdList
      }
      // console.log('roleResourceDTO', roleResourceDTO)
      // 请求后端接口
      assignResource(roleResourceDTO)
        .then((response) => {
          this.$message({
            message: '分配成功',
            type: 'success'
          })
          this.resourcedialogVisible = false
          this.resourceIdList = []
          this.roleIdList = []
          // 进行重新加载
          this.$emit('update')
        })
        .catch(() => {
          this.$message({
            message: '分配失败',
            type: 'error'
          })
        }).finally(() => {
          this.listLoading = false
        })
    },
    // 修改展示信息
    /**
     * 添加用户
     */
    ShowroleDialogVisible() {
      this.initUi()
      this.Title = this.addTitle
      this.roleDialogVisible = true
      this.$refs.roleForm.resetFields()
    },
    /**
     * 复制和编辑
     * @param {*} row
     */
    ShowUpdataDialogVisible(row) {
      this.initUi()
      this.Title = this.updateTitle
      this.roleDto = row
      this.roleDialogVisible = true
      this.$refs.roleForm.resetFields()
    },
    /**
     * 用户分配
     * @param {*} roleVo
     */
    ShowUserDialog(roleVo) {
      this.initUi()
      this.Title = this.userTitle
      // this.roleDto = row
      this.userdialogVisible = true
      for (let i = 0; i < roleVo.length; i++) {
        // 存储角色id，供用户分配时使用
        this.roleIdList.push(roleVo[i].id)
      }
      // 导入用户信息，并显示到表单上
      this.$refs.roleForm.resetFields()
    },
    /**
     * 导入用户信息
     * @param {*} userPage
     */
    getUser(userPage) {
      // console.log(userPage)
      // this.listLoading = true
      this.userQuery.total = userPage.total
      this.userQuery.pageNum = userPage.pageNum
      this.userQuery.pageSize = userPage.pageSize
      // 导入用户信息，并显示到表单上
      // 通过名字查找用户
      commonQueryUser(this.userQuery)
        .then((response) => {
          const { total, pages } = response
          this.userPage.total = parseInt(total)
          this.userPage.pages = parseInt(pages)
          this.userData = response.data
        })
    },
    /**
     * 通过name查用户
     * @param userPage.pageNum
     */
    queryUserByName() {
      this.userPage.total = null
      this.userPage.pages = null
      this.userPage.pageNum = 1
      this.getUser(this.userPage.pageNum)
    },
    /**
     * 分配用户
     * @param userRoleDTO
     */
    assignUser() {
      const userVo = this.$refs.userTable.selection
      if (userVo == null || userVo.length === 0) {
        this.$message.error('至少选择一个用户进行操作')
        return
      }
      for (let i = 0; i < userVo.length; i++) {
        this.userIdList.push(userVo[i].id)
      }
      this.userdialogVisible = false
      const userRoleDTO = {
        roleIds: this.roleIdList,
        userIds: this.userIdList
      }
      assignUser(userRoleDTO)
        .then((response) => {
          this.$message({
            message: '分配成功',
            type: 'success'
          })
          this.userIdList = []
          this.roleIdList = []
          // 进行重新加载
          this.$emit('update')
        })
        .catch(() => {
          this.$message({
            message: '分配失败',
            type: 'error'
          })
        })
    },
    // 资源分配
    /**
     * 获取资源树
     * @param {*} roleVo
     */
    ShowResourceDialog(roleVo) {
      this.Title = this.resourceTitle

      this.listLoading = true
      this.resourcedialogVisible = true
      const resourceQuery = {}
      resourceQuery.pageSize = 1000
      /**
       *  先查询到所有的资源构建出树
       */
      treeQuery(resourceQuery)
        .then((response) => {
          this.$nextTick(() => {
            this.$refs.tree.getResourceTree(response.data)
            for (let i = 0; i < roleVo.length; i++) {
              this.roleIdList.push(roleVo[i].id)
            }
            // 根据角色的id查询到角色所对应的资源进行打钩
            if (roleVo.length === 1) {
              this.fillResourceTree(roleVo[0].id)
            }
          })
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    /**
     * 用户拥有资源的回填
     * @param {*} roleId
     */
    fillResourceTree(roleId) {
      const resourceQuery = {}
      resourceQuery.pageSize = 1000
      resourceQuery.roleId = roleId
      treeQuery(resourceQuery)
        .then((res) => {
          // console.log('9999', res.data.length)
          for (let i = 0; i < res.data.length; i++) {
            this.$refs.tree.setChecked(res.data[i].id, true, false)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /**
     * 查看权限
     * @param {*} row
     */
    ShowResourceDialogCheck(row) {
      this.Title = this.resourceTitle
      this.resourcedialogVisiblecheck = true
      this.roleDto = row
      // console.log(this.roleDto.id)

      this.listLoading = true
      const resourceQuery = {}
      resourceQuery.pageSize = 1000
      /**
       *  先查询到所有的资源构建出树
       */
      treeQuery(resourceQuery)
        .then((response) => {
          this.$nextTick(() => {
            this.$refs.tree.getResourceTree(response.data)

            this.fillResourceTree(row.id)
          })
        })
        .finally(() => {
          this.listLoading = false
        })
    }
  }
}
</script>

<style>

</style>

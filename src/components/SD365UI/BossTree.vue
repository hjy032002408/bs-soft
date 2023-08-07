<template>
  <div style="overflow: auto; overflow-y: auto">
    <el-card
      v-loading="listLoading"
      :visited="resourcedialogVisible"
      shadow="always"
      class="box-card"
      style="overflow: auto"
    >
      <el-tree
        ref="tree"
        node-key="id"
        show-checkbox
        :data="resourceData"
      />
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'BossTree',
  props: {
    resourcedialogtype: String,
    resourcedialogVisible: { type: Boolean, default: true }
  },
  data() {
    return {
      // 树的数据
      resourceData: []
    }
  },
  created() {
    this.getResourceTree()
  },
  methods: {
    /**
     * 获取资源树
     * @param {*} data
     */
    getResourceTree(data) {
      this.resourceData = this.transform(data)
      // 查看权限时，所有树节点全部禁用
      if (this.resourcedialogtype === 'REVIEW') this.resourceData = this.disableTreeNode(this.resourceData)
    },
    /**
     * 禁用所有树节点
     * @param {*} data
     */
    disableTreeNode(data) {
      data.map((item) => {
        this.$set(item, 'disabled', true)
        if (item.children && item.children.length > 0) {
          item.children = this.disableTreeNode(item.children)
        }
      })
      return data
    },
    /**
     * 存储节点
     * @param {*} list
     */
    transform(list) {
      var tree = []
      // 存储一级节点（系统）
      list.map((item) => {
        if (parseInt(item.parentId) === -1 && item.resourceType === 2) {
          tree.push({ label: item.name, id: item.id, children: [] })
        }
      })
      // 存储二级节点（主菜单）
      tree.map((itemParent) => {
        list.map((item) => {
          if (itemParent.id === item.parentId) {
            itemParent.children.push({
              id: item.id,
              label: item.name,
              children: []
            })
          }
        })
      })
      // 存储三级节点（子菜单）
      tree.map((itemParent) => {
        itemParent.children.map((itemSecondParent) => {
          list.map((item) => {
            if (itemSecondParent.id === item.parentId) {
              itemSecondParent.children.push({
                id: item.id,
                label: item.name,
                children: []
              })
            }
          })
        })
      })
      // 存储四级节点（请求权限）
      tree.map((itemParent) => {
        itemParent.children.map((itemSecondParent) => {
          itemSecondParent.children.map((itemthirdParent) => {
            list.map((item) => {
              if (itemthirdParent.id === item.parentId) {
                itemthirdParent.children.push({ id: item.id, label: item.name })
              }
            })
          })
        })
      })
      return tree
    },
    setChecked(id, selection, child) {
      // setChecked：通过 key / data 设置某个节点的勾选状态，
      // 使用此方法必须设置 node-key 属性
      // (key/data, checked, deep) 接收三个参数，
      // 1. 勾选节点的 key 或者 data
      // 2. boolean 类型，节点是否选中
      // 3. boolean 类型，是否设置子节点 ，默认为 false
      this.$refs.tree.setChecked(id, selection, child)
    },
    /**
     * 获取所选节点的信息函数
     */
    getCheckedNodes() {
      const list = this.$refs.tree.getCheckedNodes()
      return list
    },
    /**
     * 拿到半节点的节点数组
     */
    getHalfCheckedKeys() {
      const listParent = this.$refs.tree.getHalfCheckedKeys()
      return listParent
    }
  }
}
</script>

<style>

</style>

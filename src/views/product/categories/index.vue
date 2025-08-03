<template>
    <el-card>
        <!-- draggable：开启拖拽功能-->
        <!-- :allow-drop="canDragBehavior" ：是否可以拖拽进某个层级下-->
        <!--  @node-drop="handleDrop"：拖拽成功以后-->
        <el-tree 
            :data="dataSource" 
            show-checkbox 
            node-key="catId" 
            :expand-on-click-node="false"
            :default-expanded-keys="expandedKeys"  
        >
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <span>{{ data.name }}</span>
                    <div style="width: 200px;display:flex;justify-content: left;">
                        <!-- 只能是三级分类，不能添加四级 -->
                        <el-button v-if="data.catLevel <= 2" type="primary" link @click="append(data)">Append</el-button>
                        <el-button type="success" link @click="edit(data)">Edit</el-button>    
                        <!-- 节点下没有子元素才显示‘删除’ -->
                        <el-button v-if="data.children.length <= 0" style="margin-left: 8px" type="danger" link  @click="remove(node, data)"> Delete</el-button>
                    </div>
                </div>
            </template>
        </el-tree>
    </el-card>


    <!-- 新增或者修改三级菜单分类对话框 -->
     <el-dialog v-model="dialogFormVisible" :title="categoryCMForm.catId?'修改三级分类菜单':'新增三级分类菜单'" :close="dialogClose(ruleFormRef)" width="500">
    <el-form :model="categoryCMForm" ref="ruleFormRef" :rules="formRules">
      <el-form-item label="三级分类名称" prop="name">
        <el-input v-model="categoryCMForm.name" placeholder="请输入三级分类名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="categoryCMHadnler(ruleFormRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>



<script setup lang='ts'>
import { reactive, ref, onMounted} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import { reqDataSourceTree, reqBatchDel,reqCreateCategory,reqModifyCategory } from '@/api/product/categories'
import type { CategoryTreeData,CategoryCMForm,CategoryDropForm } from '@/api/product/categories/type'
import type { Action, RenderContentContext,FormRules,FormInstance ,AllowDropType,NodeDropType } from 'element-plus'
import type { DragEvents} from 'element-plus/es/components/tree/src/model/useDragNode'



type Node = RenderContentContext['node']
type Data = RenderContentContext['data']
const dataSource = ref<CategoryTreeData[]>([])
const expandedKeys = ref<string[]>([])
const dialogFormVisible = ref<boolean>(false)
const categoryCMForm = reactive<CategoryCMForm>({
    catId:'',
    name:'',
    parentCid:'',
    catLevel: 0

})
const categoryDropForm=reactive<CategoryDropForm>({
    catId:'',
    parentCid:'',
    catLevel:0,
    sort:0
})
const ruleFormRef = ref<FormInstance>()
const formRules = reactive<FormRules<CategoryCMForm>>({
  name: [
    { required: true, message: '请填写三级分类名称', trigger: 'blur' }
  ]
})

onMounted(() => {
    getDataSource()
})





// 新增或者修改对话框关闭时的一些操作，清空表单校验并清空表单v-model数据
const dialogClose=(formEl: FormInstance | undefined)=>{
    if (!formEl) return
    formEl.resetFields()
    categoryCMForm.name = ''
    categoryCMForm.catLevel=0
}

// 新增或修改三级分类
const categoryCMHadnler = async (formEl: FormInstance | undefined)=>{
    if (!formEl) return
        await formEl.validate(async (valid, fields) => {
        if (valid) {
        if(categoryCMForm.catId){
            categoryCMForm.catLevel = categoryCMForm.catLevel++ // 层级：在哪个节点点击的‘Append’,就是这个节点再加一
            //修改
            await reqModifyCategory(categoryCMForm).then(()=>{
                ElMessage.success("修改三级分类成功")
                dialogFormVisible.value = false
                getDataSource()
            })
        }else{
            // 新增
        await reqCreateCategory(categoryCMForm).then(()=>{
            ElMessage.success("新增三级分类成功")
            dialogFormVisible.value = false
            getDataSource()
        })  
        }
    } 
  })
    
}


// 删除三级分类菜单
const remove = (node: Node, data: Data) => {
    // 刷新后，默认展开的节点
    expandedKeys.value.push(node.parent.data.catId)
    ElMessageBox.alert(`是否删除三级分类菜单【${data.name}】`, {
        confirmButtonText: 'OK',
        callback: async (action: Action) => {
            if (action.match('confirm')) {
                const catId = Number(data.catId)
                await reqBatchDel([catId]).then(() => {
                    ElMessage({
                        type: 'success',
                        message: `删除三级分类菜单成功`,
                    })
                    getDataSource()
                })
            }
        },
    })
}

// 获取tree类型的分类数据
const getDataSource = async () => {
    await reqDataSourceTree().then(res => {
        dataSource.value = res
    })
}


// 当前节点点击‘Append’,打开对话框进行信息
const append = (data: Data) => {
    editAndAppendOpertion(data)
}

// 当前节点点击‘Append’,打开对话框进行信息
const edit = (data: Data) => {
    editAndAppendOpertion(data)
    categoryCMForm.catId = data.catId
    categoryCMForm.name = data.name
}

// edit 和 append 按钮之后共同的一些操作
const editAndAppendOpertion=(data: Data)=>{
    // data:当前节点信息
    dialogFormVisible.value = true
    // 设置默认的tree展开节点，修改后新增以后可以直观的看到操作成功与否
    expandedKeys.value.push(data.parentCid)
    // 赋值一些用户无需填写，而需要提交给后台的数据
    // data.catLevel++不能放到这里,不然‘Append’手速快多点几下就消失不见，因为DOM中有v-if判断
    categoryCMForm.catLevel = data.catLevel
    categoryCMForm.parentCid = data.parentCid // 当前新增的分类是父id
}



//==============================拖拽功能：暂未开发完成===========================================

/**
 * 
 * 拖拽成功完成时触发的事件 
 * @param draggingNode 被拖拽节点对应的 Node
 * @param dropNode 结束拖拽时最后进入的节点
 * @param dropType 被拖拽节点的放置位置（before、after、inner）
 * @param ev event本身
 */
const handleDrop = (draggingNode: Node,dropNode: Node,dropType: NodeDropType,ev: DragEvents) => {
  // TODO 脑袋都炸了，以后真的有需求再说  
  console.log('被拖拽节点对应的 Node:', draggingNode.data.name)
  console.log('结束拖拽时最后进入的节点:', dropNode.data.name)
  console.log('被拖拽节点的放置位置:', dropType)
  // 1、当前节点结束拖拽后最新的父Id
  if(dropType == 'before' || dropType == 'after'){
    // '结束拖拽时最后进入的节点'
    categoryDropForm.parentCid = dropNode.parent.data.parentCid
  }
  if(dropType == 'inner'){
    // '结束拖拽时最后进入的节点'的pid
    categoryDropForm.parentCid = dropNode.data.parentCid
  }
  // 2、当前节点结束拖拽后最新的顺序
  // 3、当前节点结束拖拽后最新的层级
}

/**
 * 拖拽时判定目标节点能否成为拖动目标位置。 如果返回 false ，拖动节点不能被拖放到目标节点
 * @param draggingNode 被拖拽节点对应的 Node
 * @param dropNode 所进入节点对应的 Node
 * @param type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
 */
const canDragBehavior = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
	// // 业务规定，分类等级最多三级，所进入节点对应的层级不能是3 则不允许拖动到内部，只能是 'prev' 或 'next'
	if (dropNode.data.catLevel>=3) {
		return type !== 'inner'
	}
	return true
}

//==============================拖拽功能：暂未开发完成===========================================
</script>


<!-- ======================================样式================================ -->
<style scoped lang="scss">
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
</style>
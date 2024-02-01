import React, { useEffect, useState } from 'react'
import { Table, Popconfirm, Button, Popover, Switch, message, Modal, Tree } from 'antd'
import { EditOutlined, DeleteOutlined, UnorderedListOutlined } from "@ant-design/icons"
import axios from 'axios'
export default function RoleList() {
  const [messageApi, contextHolder] = message.useMessage()
  const [dataSource, setDataSource] = useState([])
  const [checkRights, setCheckRights] = useState([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (item) => {
        return <>

          <Popconfirm
            title="提示"
            description={`确定删除${item.roleName}角色名称吗?`}
            onConfirm={() => confirm(item)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} />
          </Popconfirm>

          <Popover content={<div>
            <Switch defaultChecked checked={item.pagepermisson} onChange={() => handleSwitch(item)} />
          </div>} title="权限配置" trigger={item.pagepermisson === undefined ? "" : "hover"}>
            <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} style={{ marginLeft: '10px' }} onClick={() => handleModalOpen(item)} />
          </Popover>

        </>
      }
    },
  ];
  useEffect(() => {
    //请求table表格数据
    axios.get('http://localhost:3000/roles').then(res => setDataSource(res.data))
    //请求树形结构数据
    axios.get('http://localhost:3000/rights?_embed=children').then(res => setTreeData(res.data))
  }, [])
  const handleModalOpen = (row: any) => {

    setCheckRights(row.rights)
    setIsModalOpen(true)
  }
  const confirm = (e: any) => {
    console.log(e);
    axios.delete(`http://localhost:3000/roles?id=${e.id}`)
    setDataSource(dataSource.filter((item: any) => item.id !== e.id))
    messageApi.open({
      type: 'warning',
      content: 'This is a warning message',
    });
  };
  const [treeData, setTreeData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onCheck = (checkedKeys: any, info: any) => {
    setCheckRights(checkedKeys)
  }
  return (
    <>
      <Table dataSource={dataSource} columns={columns} />
      <Modal title="权限配置" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkStrictly
          defaultExpandAll
          expandedKeys={checkRights}
          onCheck={onCheck}
          checkedKeys={checkRights}
          treeData={treeData}
        />
      </Modal>
    </>
  )
}

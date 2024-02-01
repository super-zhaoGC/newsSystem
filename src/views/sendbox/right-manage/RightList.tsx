import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Popconfirm, message, Popover, Switch } from 'antd'
import axios from 'axios';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"

export default function RightList() {
  const [messageApi, contextHolder] = message.useMessage()
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      align: 'center'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      align: 'center',
      render: (key: string) => {
        return <Tag color="blue">{key}</Tag>
      }
    },
    {
      title: '操作',
      align: 'center',
      render: (item) => {
        return <>

          <Popconfirm
            title="提示"
            description={`确定删除${item.title}权限吗?`}
            onConfirm={() => confirm(item)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} />
          </Popconfirm>

          <Popover content={<div>
            <Switch defaultChecked checked={item.pagepermisson} onChange={() => handleSwitch(item)} />
          </div>} title="权限配置" trigger={item.pagepermisson === undefined ? "" : "hover"}>
            <Button type="primary" disabled={item.pagepermisson === undefined} shape="circle" icon={<EditOutlined />} style={{ marginLeft: '10px' }} />
          </Popover>

        </>
      }
    },
  ];

  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get('http://localhost:3000/rights?_embed=children').then(res => {
      const list = res.data
      list[0].children = undefined
      setDataSource(list)
    })
  }, [])

  const confirm = (e: any) => {
    console.log(e);
    // message.success('Click on Yes');
    if (e.grade === 1) {

      axios.delete(`http://localhost:3000/rights?id=${e.id}`)
      setDataSource(dataSource.filter((item: any) => item.id !== e.id))

    } else {
      const list: any = dataSource.filter((item: any) => item.id === e.rightId)
      list[0].children = list[0].children.filter(item => item.id !== e.id)
      console.log(list);
      axios.delete(`http://localhost:3000/children/${e.id}`)
      setDataSource([...dataSource])
    }
    messageApi.open({
      type: 'warning',
      content: 'This is a warning message',
    });
  };
  const handleSwitch = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    console.log(item);
    setDataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`http://localhost:3000/rights/?id=${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
  }

  return (
    <><Table dataSource={dataSource} columns={columns} bordered scroll={{ y: 450 }} />;</>
  )
}

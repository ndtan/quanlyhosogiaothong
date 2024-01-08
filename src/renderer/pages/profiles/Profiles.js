import React, {useEffect, useState} from 'react';
import {Breadcrumb, Layout} from 'antd';
import {EllipsisOutlined, PlusOutlined} from '@ant-design/icons';
import {ProTable, TableDropdown} from '@ant-design/pro-components';
import {Button, Dropdown, Space, Tag} from 'antd';
import {Outlet, Link} from 'react-router-dom';
import {getOfficers} from "../../business/officers";
import icon from "../../../../assets/icon.svg";

// export default function Profiles() {
//   const [officers, setOfficers] = useState([]);
//
//   useEffect(() => {
//     getOfficers({}).then(officers => setOfficers(officers));
//     // createOfficer({}).then(info => console.log('info', info))
//     //   .catch(error => console.warn(error));
//   }, []);
//
//   console.log('officers', officers);
//
//   return (
//     <div>
//       <h1>Profiles</h1>
//       {officers.map(o => <div key={o.id}>
//         <span>{o.id}</span>
//         <span>{o.name}</span>
//         <span>{o.birthday}</span>
//       </div>)}
//       {officers.map(o => <div key={o.id}>
//         <span>{o.id}</span>
//         <span>{o.name}</span>
//         <span>{o.birthday}</span>
//       </div>)}
//       {officers.map(o => <div key={o.id}>
//         <span>{o.id}</span>
//         <span>{o.name}</span>
//         <span>{o.birthday}</span>
//       </div>)}
//     </div>
//   );
// }

import {useRef} from 'react';

export const waitTimePromise = async (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time = 100) => {
  await waitTimePromise(time);
};

const columns = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'Biển số',
    dataIndex: 'plate',
    copyable: true,
    ellipsis: true,
    tip: 'Title',
    formItemProps: {
      rules: [
        {
          required: true,
          message: 'Required',
        },
      ],
    },
  },
  {
    title: 'Nội dung',
    dataIndex: 'content',
    copyable: true,
    ellipsis: true,
    tip: 'Title',
    formItemProps: {
      rules: [
        {
          required: true,
          message: 'Required',
        },
      ],
    },
  },
  // {
  //   disable: true,
  //   title: 'State',
  //   dataIndex: 'state',
  //   filters: true,
  //   onFilter: true,
  //   ellipsis: true,
  //   valueType: 'select',
  //   valueEnum: {
  //     all: {text: 'All'.repeat(50)},
  //     open: {
  //       text: 'Error',
  //       status: 'Error',
  //     },
  //     closed: {
  //       text: 'Success',
  //       status: 'Success',
  //       disabled: true,
  //     },
  //     processing: {
  //       text: '解决中',
  //       status: 'Processing',
  //     },
  //   },
  // },
  // {
  //   disable: true,
  //   title: 'labels',
  //   dataIndex: 'labels',
  //   search: false,
  //   renderFormItem: (_, {defaultRender}) => {
  //     return defaultRender(_);
  //   },
  //   render: (_, record) => (
  //     <Space>
  //       {record.labels.map(({name, color}) => (
  //         <Tag color={color} key={name}>
  //           {name}
  //         </Tag>
  //       ))}
  //     </Space>
  //   ),
  // },
  // {
  //   title: 'showTime',
  //   key: 'showTime',
  //   dataIndex: 'created_at',
  //   valueType: 'date',
  //   sorter: true,
  //   hideInSearch: true,
  // },
  // {
  //   title: 'created_at',
  //   dataIndex: 'created_at',
  //   valueType: 'dateRange',
  //   hideInTable: true,
  //   search: {
  //     transform: (value) => {
  //       return {
  //         startTime: value[0],
  //         endTime: value[1],
  //       };
  //     },
  //   },
  // },
  // {
  //   title: 'option',
  //   valueType: 'option',
  //   key: 'option',
  //   render: (text, record, _, action) => [
  //     <a
  //       key="editable"
  //       onClick={() => {
  //         action?.startEditable?.(record.id);
  //       }}
  //     >
  //       编辑
  //     </a>,
  //     <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
  //       查看
  //     </a>,
  //     <TableDropdown
  //       key="actionGroup"
  //       onSelect={() => action?.reload()}
  //       menus={[
  //         {key: 'copy', name: 'copy'},
  //         {key: 'delete', name: 'delete'},
  //       ]}
  //     />,
  //   ],
  // },
];

export default () => {
  const actionRef = useRef();
  return (
    <ProTable
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        console.log(sort, filter);
        await waitTime(500);
        return {
          data: [
            {plate: '73A-HDK', content: "Cấp mới"}
          ],
          success: true,
          total: 17
        };
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: {fixed: 'right', disable: true},
        },
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="Hồ sơ phương tiện giao thông"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined/>}
          onClick={() => {
            actionRef.current?.reload();
          }}
          type="primary"
        >
          新建
        </Button>,
        <Dropdown
          key="menu"
          menu={{
            items: [
              {
                label: '1st item',
                key: '1',
              },
              {
                label: '2nd item',
                key: '1',
              },
              {
                label: '3rd item',
                key: '1',
              },
            ],
          }}
        >
          <Button>
            <EllipsisOutlined/>
          </Button>
        </Dropdown>,
      ]}
    />
  );
};

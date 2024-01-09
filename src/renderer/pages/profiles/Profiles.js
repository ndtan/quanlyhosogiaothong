import React, {useContext, useEffect, useState} from 'react';
import {Breadcrumb, Layout} from 'antd';
import {EllipsisOutlined, PlusOutlined} from '@ant-design/icons';
import {ProTable, TableDropdown} from '@ant-design/pro-components';
import {Button, Dropdown, Space, Tag} from 'antd';
import {Outlet, Link} from 'react-router-dom';
import {getOfficers} from "../../business/officers";
import icon from "../../../../assets/icon.svg";
import {useRef} from 'react';
import {getProfiles} from "../../business/profiles";

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
    title: 'STT',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'Biển số xe',
    dataIndex: 'plate',
    ellipsis: true,
    fieldProps: { placeholder: "Tìm biển số xe..." },
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
    title: 'Nội dung nhập hồ sơ',
    dataIndex: 'content',
    // copyable: true,
    // ellipsis: true,
    // tip: 'Title',
    hideInSearch: true,
    fieldProps: { placeholder: "Nhập biển số..." },
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
    title: 'Cán bộ nhập hồ sơ',
    dataIndex: 'created_by',
    fieldProps: { placeholder: "Tìm theo cán bộ..." },
    // copyable: true,
    // ellipsis: true,
    // tip: 'Title',
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
  {
    title: 'Ngày nhập',
    key: 'created_at',
    dataIndex: 'created_at',
    valueType: 'date',
    // sorter: true,
    hideInSearch: true,
  },
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

function _getProfiles() {
  return getProfiles({}).then(profiles=>{
    console.log('profiles', profiles);
    return profiles;
  }).then(profiles => ({
    data: profiles,
    success: true,
    total: 27
  }))
}

const viVN = {
  tableForm: {
    search: 'Query',
    reset: 'Reset',
    submit: 'Submit',
    collapsed: 'Mở rộng',
    expand: 'Thu gọn',
    inputPlaceholder: 'Please enter',
    selectPlaceholder: 'Please select',
  },
  alert: {
    clear: 'Clear',
  },
  tableToolBar: {
    leftPin: 'Pin to left',
    rightPin: 'Pin to right',
    noPin: 'Unpinned',
    leftFixedTitle: 'Fixed the left',
    rightFixedTitle: 'Fixed the right',
    noFixedTitle: 'Not Fixed',
    reset: 'Reset',
    columnDisplay: 'Column Display',
    columnSetting: 'Settings',
    fullScreen: 'Full Screen',
    exitFullScreen: 'Exit Full Screen',
    reload: 'Refresh',
    density: 'Density',
    densityDefault: 'Default',
    densityLarger: 'Larger',
    densityMiddle: 'Middle',
    densitySmall: 'Compact',
  },
};
import { ProProvider, createIntl } from '@ant-design/pro-components';
const enUSIntl = createIntl('en_US', viVN);

export default () => {
  const values = useContext(ProProvider);
  const actionRef = useRef();
  return (
    <ProProvider.Provider value={{ ...values, intl: enUSIntl }}>
    <ProTable
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        await waitTime(500);
        return _getProfiles();
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
        searchText: "Tìm kiếm",
        resetText: "Xóa bộ lọc",
        expandText: "Mở rộng"
      }}
      options={{
        fullScreen: true,
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
        defaultPageSize: 10, showSizeChanger: true, hideOnSinglePage: false,
        showTotal: (total, range) => `Từ ${range[0]} đến ${range[1]} của ${total} hồ sơ`,
        onChange: (page) => console.log(page),
        locale: {
          items_per_page: "Hồ sơ mỗi trang",
          jump_to: "Nhảy đến",
          jump_to_confirm:"Xác nhận nhảy đến",
          page: "trang",
          prev_page: "trang trước",
          next_page: "trang sau",
          page_size:"kích thước trang"
        }
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
          Thêm mới hồ sơ
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
    </ProProvider.Provider>
  );
};

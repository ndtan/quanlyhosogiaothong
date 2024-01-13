import React, {useContext, useEffect, useState} from 'react';
import {Breadcrumb, Form, Layout, message} from 'antd';
import {EllipsisOutlined, PlusOutlined} from '@ant-design/icons';
import {ModalForm, ProForm, ProFormSelect, ProFormText, ProTable, TableDropdown, ProCard} from '@ant-design/pro-components';
import {Button, Dropdown, Space, Tag} from 'antd';
import {Outlet, Link} from 'react-router-dom';
import {ProProvider, createIntl} from '@ant-design/pro-components';
import {getOfficers} from "../../business/officers";
import icon from "../../../../assets/icon.svg";
import {useRef} from 'react';
import {createProfile, getProfileByPlate, getProfiles} from "../../business/profiles";
import ProfileDetail from "./ProfileManipulate";
import {ProFormDatePicker} from "@ant-design/pro-form";
import ProfileManipulate from "./ProfileManipulate";

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

const viVN = {
  tableForm: {
    search: 'Tìm kiếm',
    reset: 'Làm lại',
    submit: 'Đồng ý',
    collapsed: 'Mở rộng',
    expand: 'Thu gọn',
    inputPlaceholder: 'Vui lòng nhập',
    selectPlaceholder: 'Vui lòng chọn',
  },
  alert: {
    clear: 'Xóa',
  },
  tableToolBar: {
    leftPin: 'Ghim sang trái',
    rightPin: 'Ghim sang phải',
    noPin: 'Bỏ ghim',
    leftFixedTitle: 'Cố định sang trái',
    rightFixedTitle: 'Cố định sang phải',
    noFixedTitle: 'Không cố định',
    reset: 'Làm lại',
    columnDisplay: 'Cột hiển thị',
    columnSetting: 'Cài đặt',
    fullScreen: 'Xem toàn màn hình',
    exitFullScreen: 'Thu nhỏ',
    reload: 'Tải lại dữ liệu',
    density: 'Mật độ hiển thị',
    densityDefault: 'Mặc định',
    densityLarger: 'Thấp',
    densityMiddle: 'Trung bình',
    densitySmall: 'Cao',
  },
};

const columns = [
  {
    title: 'STT',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
    renderText: (text, record, index, action) => {
      return index + 1;
    },
  },
  {
    title: 'Biển số xe',
    dataIndex: 'plate',
    ellipsis: true,
    fieldProps: {placeholder: "Nhập biển số xe"},
    formItemProps: {
      rules: [{required: true, message: 'Nhập biển số xe'}],
    },
  },
  {
    title: 'Nội dung hồ sơ',
    dataIndex: 'content',
    // copyable: true,
    ellipsis: true,
    // tip: 'Title',
    hideInSearch: true,
    fieldProps: {placeholder: "Nhập nội dung hồ sơ"},
    formItemProps: {
      rules: [{required: true, message: 'Nhập nội dung hồ sơ'}],
    },
  },
  {
    title: 'Cán bộ nhập',
    dataIndex: 'created_by_id',
    // filters: true,
    // onFilter: true,
    // ellipsis: true,
    valueType: 'select',
    request: (params, props) =>
      getOfficers({}).then((officers) => officers.map((s) => ({label: s.name, value: s.id}))),
    fieldProps: {placeholder: "Chọn cán bộ nhập"},
    formItemProps: {
      rules: [{required: true, message: 'Chọn cán bộ nhập'}],
    },
  },
  {
    title: 'Ngày nhập',
    key: 'created_at',
    dataIndex: 'created_at',
    valueType: 'date',
    // sorter: true,
    hideInSearch: true,
    fieldProps: {placeholder: "Chọn cán bộ nhập"},
    formItemProps: {
      rules: [{required: true, message: 'Chọn ngày nhập'}],
    },
  },
  {
    title: 'Tùy chọn',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a key="detail" onClick={() => {
      }}>Bổ sung</a>,
    ],
  },
];

function _getProfiles(params, sort, filter) {
  return getProfiles(params, sort, filter)
    .then(profiles => {
      console.log('profiles', profiles);
      return profiles
    })
    .then(profiles => profiles.map(p => ({...p, created_at: p.created_at * 1000})))
    .then(profiles => ({
      data: profiles,
      success: true,
      total: profiles.length < params.pageSize ? ((params.current - 1) * params.pageSize + profiles.length)
        : (params.current * params.pageSize + 1)
    }))
}

const enUSIntl = createIntl('en_US', viVN);

export default () => {
  const values = useContext(ProProvider);
  const actionRef = useRef();
  const [profile, setProfile] = useState();
  const [modalVisit, setModalVisit] = useState(false);
  const [form] = Form.useForm();
  return (
    <ProProvider.Provider value={{...values, intl: enUSIntl}}>
      <ProCard layout="center" bordered style={{marginBottom: 8}}>
        <ProForm
          title="Khai thác hồ sơ"
          form={form}
          layout={'inline'}
          autoFocusFirstInput
          submitTimeout={2000}
          className={'form-manipulation'}
          submitter={{
            searchConfig: {submitText: 'Khai thác'},
            resetButtonProps: {style: {display: 'none'}},
          }}
          onFinish={async (values) => {
            try {
              console.log('values', values);
              const profile = await getProfileByPlate(values?.plate);
              if (!profile) {
                message.error("Không tìm thấy biển số xe.")
                return false;
              }
              console.log('profile', profile);
              setProfile(profile);
              setModalVisit(true);
            } catch (err) {
              message.error(err.toString());
              return false;
            }
          }}
        >
          <ProForm.Group>
            <ProFormText
              width="md"
              name="plate"
              placeholder="Nhập biển số xe để khai thác"
              formItemProps={{rules: [{required: true, message: 'Nhập biển số xe'}]}}
            />
          </ProForm.Group>
        </ProForm>
        <ProfileManipulate profile_id={profile?.id} open={modalVisit} requestClose={()=>setModalVisit(false)} />
      </ProCard>

      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log('params', params);
          console.log('sort', sort);
          console.log('filter', filter);
          sort.id = 'desc';
          await waitTime(500);
          return _getProfiles(params, sort, filter);
        }}
        rowKey="id"
        search={false}
        options={{
          fullScreen: true,
          setting: {
            listsHeight: 300,
          },
        }}
        pagination={{
          defaultPageSize: 10, showSizeChanger: true, hideOnSinglePage: true,
          showTotal: (total, range) => `Từ ${range[0]} đến ${range[1]} của ${total} hồ sơ`,
          onChange: (page) => console.log(page),
          locale: {
            items_per_page: "Hồ sơ mỗi trang",
            jump_to: "Nhảy đến",
            jump_to_confirm: "Xác nhận nhảy đến",
            page: "trang",
            prev_page: "trang trước",
            next_page: "trang sau",
            page_size: "kích thước trang"
          }
        }}
        dateFormatter="string"
        headerTitle="Hồ sơ đang khai thác"
        toolBarRender={() => [
          <a key="export" onClick={() => {
          }}>
            Xuất danh sách
          </a>,
        ]}
      />
    </ProProvider.Provider>
  );
};

import {PlusOutlined} from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import {Button, Form, message} from 'antd';
import {getOfficers} from "../../business/officers";
import {ProFormDatePicker} from "@ant-design/pro-form";
import React, {useEffect, useState} from "react";
import {createProfile} from "../../business/profiles";

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default ({trigger}) => {
  const [form] = Form.useForm();
  return (
    <ModalForm
      title="Thêm hồ sơ mới"
      trigger={trigger}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      submitTimeout={2000}
      submitter={{searchConfig: {resetText: "Hủy", submitText: "Thêm hồ sơ"}}}
      onFinish={async (values) => {
        try {
          const info = await createProfile(values);
          console.log('info', info);
          if (info) {
            message.success('Đã thêm hồ sơ');
            return true;
          } else {
            message.error("Không thể thêm hồ sơ. Vui lòng kiểm tra thông tin và thử lại.");
            return false;
          }
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
          label="Biển số xe"
          tooltip="Nhập chính xác biển số xe bao gồm cả dấu gạch ngang, dấu chấm"
          placeholder="Nhập biển số xe"
          formItemProps={{
            rules: [{required: true, message: 'Nhập biển số xe'}],
          }}
        />
        <ProFormSelect
          request={async () => getOfficers({}).then(officers => officers.map(o => ({value: o.id, label: o.name})))}
          width="md"
          name="created_by_id"
          label="Cán bộ nhập"
          placeholder="Chọn cán bộ nhập"
          formItemProps={{
            rules: [{required: true, message: 'Chọn cán bộ nhập'}],
          }}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          options={[
            {value: "Xe đăng ký lần đầu", label: "Xe đăng ký lần đầu"},
            {value: "Xe biển số định danh lần 1", label: "Xe biển số định danh lần 1"},
            {value: "Xe biển số định danh lần 2", label: "Xe biển số định danh lần 2"},
            {value: "Xe biển số định danh lần 3", label: "Xe biển số định danh lần 3"},
            {value: "Xe biển số định danh lần 4", label: "Xe biển số định danh lần 4"},
            {value: "Xe biển số định danh lần 5", label: "Xe biển số định danh lần 5"},
            {value: "Xe tịch thu", label: "Xe tịch thu"},
            {value: "Xe 175 cm", label: "Xe 175 cm"},
          ]}
          width="md"
          name="content"
          label="Nội dung nhập hồ sơ"
          placeholder="Chọn nội dung nhập hồ sơ"
          formItemProps={{
            rules: [{required: true, message: 'Chọn nội dung nhập hồ sơ'}],
          }}
        />
        <ProFormDatePicker
          width="md"
          name="created_at"
          label="Ngày nhập"
          placeholder="Chọn ngày nhập"
          formItemProps={{
            rules: [{required: true, message: 'Chọn ngày nhập hồ sơ'}],
          }}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

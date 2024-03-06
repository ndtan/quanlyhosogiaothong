import {PlusOutlined} from '@ant-design/icons';
import {ModalForm, ProForm, ProFormDateRangePicker, ProFormSelect, ProFormText} from '@ant-design/pro-components';
import {Button, Form, message} from 'antd';
import {ProFormDatePicker} from "@ant-design/pro-form";
import React, {useEffect, useState} from "react";
import {createOfficer} from "../../business/officers";

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default ({trigger, onFinish}) => {
  const [form] = Form.useForm();
  return (
    <ModalForm
      title="Thêm mới cán bộ"
      trigger={trigger}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('cancel'),
      }}
      submitTimeout={2000}
      submitter={{searchConfig: {resetText: "Hủy", submitText: "Thêm cán bộ"}}}
      onFinish={async (values) => {
        try {
          console.log('values', values);
          const info = await createOfficer(values);
          console.log('info', info);
          if (info) {
            message.success('Đã thêm hồ sơ');
            onFinish?.();
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
          name="name"
          label="Tên cán bộ"
          tooltip="Nhập tên cán bộ"
          placeholder="Nhập tên cán bộ"
          formItemProps={{
            rules: [{required: true, message: 'Nhập tên cán bộ'}],
          }}
        />
        <ProFormText
          width="md"
          name="department"
          label="Phòng ban"
          tooltip="Nhập phòng ban cán bộ đang làm việc"
          placeholder="Nhập phòng ban cán bộ đang làm việc"
          formItemProps={{
            rules: [{required: true, message: 'Nhập phòng ban cán bộ đang làm việc'}],
          }}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="role"
          label="Chức vụ"
          tooltip="Nhập chức vụ của cán bộ"
          placeholder="Nhập chức vụ của cán bộ"
          formItemProps={{
            rules: [{required: true, message: 'Nhập chức vụ của cán bộ'}],
          }}
        />
        <ProFormDatePicker
          width="md"
          name="birthday"
          label="Ngày sinh"
          placeholder="Chọn ngày sinh"
          tooltip="Chọn ngày sinh của cán bộ"
        />
      </ProForm.Group>
    </ModalForm>
  );
};

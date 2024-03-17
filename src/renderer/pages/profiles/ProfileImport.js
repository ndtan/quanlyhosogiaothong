import React, {useEffect, useState} from "react";
import {CloudUploadOutlined, PlusOutlined, UploadOutlined} from '@ant-design/icons';
import {ModalForm, ProForm, ProFormDateRangePicker, ProFormSelect, ProFormText} from '@ant-design/pro-components';
import {Button, Form, message, Upload} from 'antd';
import readXlsxFile from 'read-excel-file'
import {ProFormDatePicker, ProFormDigit} from "@ant-design/pro-form";
import {getOfficers} from "../../business/officers";
import {createProfile} from "../../business/profiles";
import OfficerCreate from "../officers/OfficerCreate";


const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default ({trigger, onFinish}) => {
  const [form] = Form.useForm();
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [importing, setImporting] = useState(false);

  const uploadChanged = (event) => {
    if (event.fileList.length > 0) {
      form.setFieldValue('file', event.fileList[0]);
      readXlsxFile(event.fileList[0].originFileObj).then(rows => {
        setRows(rows);
      })
    } else {
      form.resetFields(['file']);
      setRows([]);
    }
  }

  const fileRemoved = (event) => {
    form.resetFields(['file']);
    setRows([]);
  }

  return (
    <ModalForm
      title="Nhập hồ sơ từ file excel"
      trigger={trigger}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      submitTimeout={2000}
      submitter={{searchConfig: {resetText: "Hủy", submitText: `Nhập ${rows.length} hồ sơ`}}}
      onValuesChange={(changeValues) => {
        console.log(changeValues);
        if (changeValues.created_by_id === 0) {
          document.getElementById('show-add-officer').click();
        }
      }}
      onFinish={async (values) => {
        try {
          const { file, ...others } = values;
          const rows = await readXlsxFile(file.originFileObj);
          console.log('rows', rows);
          // `rows` is an array of rows
          // each row being an array of cells.
          if (rows.some(row => row.length !== 2)) {
            throw "File excel không đúng mẫu. File dữ liệu phải gồm 2 cột: Biển số xe và Nơi đăng ký";
          }
          const success = [];
          const errors = [];
          let count = 0;
          setImporting(true);
          for (let row of rows) {
            count++;
            setCount(count);
            const plate = row[0];
            const registration_place = row[1];
            const data = {plate, ...others};
            console.log("Importing data", data);
            try {
              const info = await createProfile(data);
              success.push({data, info});
              console.log("Imported", data);
            } catch (error) {
              errors.push({data, error});
              console.log("Import error", error);
            }
          }
          console.log('Import success', success);
          console.log('Import errors', errors);
          message.success(`Đã nhập thành công ${success.length}/${rows.length} hồ sơ`);
          onFinish?.();
          return true;
        } catch (err) {
          message.error(err.toString());
          return false;
        } finally {
          setImporting(false);
        }
      }}
    >
      <ProForm.Group>
        <ProForm.Item name={'file'} label={"File dữ liệu"}
                      width="md"
                      required={true} wrapperCol={{span: 12}}
                      rules={[{required: true, message: 'Chọn file excel để nhập dữ liệu'}]}>
          <Upload
            name="upload"
            showUploadList={{ showRemoveIcon: true }}
            accept=".xls, .xlsx"
            beforeUpload={() => false}
            multiple={false} maxCount={1}
            onChange={e => uploadChanged(e)}
            onRemove={e => fileRemoved(e)}
          >
            <Button icon={<CloudUploadOutlined />}>Chọn file excel để nhập dữ liệu</Button>
          </Upload>
        </ProForm.Item>

        <ProForm.Item noStyle shouldUpdate>
          {(form) => {
            return <ProFormSelect
              params={{id: form.getFieldValue('created_by_id')}}
              request={async () => getOfficers({})
                .then(officers => officers.map(o => ({value: o.id, label: o.name})))
                .then(officers => [{value: 0, label: <span style={{fontStyle: 'italic'}}>--- Thêm mới cán bộ ---</span>},...officers])
              }
              width="md"
              name="created_by_id"
              label="Cán bộ nhập"
              placeholder="Chọn cán bộ nhập"
              formItemProps={{
                rules: [{required: true, message: 'Chọn cán bộ nhập'}],
              }}
            />
          }}
        </ProForm.Item>

        <ProForm.Item noStyle shouldUpdate hidden={true}>
          {(form) => {
            return <OfficerCreate
              trigger={<Button key="button" icon={<PlusOutlined/>} id={'show-add-officer'}>Thêm mới</Button>}
              onFinish={(info)=>form.setFieldValue('created_by_id', info.lastInsertRowid)}
              onCancel={()=>form.resetFields(["created_by_id"])}/>
          }}
        </ProForm.Item>

      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          options={[
            {value: "Xe đăng ký lần đầu", label: "Xe đăng ký lần đầu"},
            {value: "Xe đổi biển", label: "Xe đổi biển"},
            {value: "Xe sang tên (Quy Nhơn)", label: "Xe sang tên (Quy Nhơn)"},
            {value: "Xe chuyển đến", label: "Xe chuyển đến"},
            {value: "Xe tịch thu", label: "Xe tịch thu"},
            {value: "Xe 175 cm", label: "Xe 175 cm"},
            {value: "Xe đấu giá", label: "Xe đấu giá"},
            {value: "Xe biển số định danh lần 1", label: "Xe biển số định danh lần 1"},
            {value: "Xe biển số định danh lần 2", label: "Xe biển số định danh lần 2"},
            {value: "Xe biển số định danh lần 3", label: "Xe biển số định danh lần 3"},
            {value: "Xe biển số định danh lần 4", label: "Xe biển số định danh lần 4"},
            {value: "Xe biển số định danh lần 5", label: "Xe biển số định danh lần 5"},
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
      <p style={{visibility: importing ? 'unset' : 'hidden'}}>
        Đang nhập {count}/{rows.length} ({Math.round(count/rows.length*100)}%) hồ sơ...
      </p>
    </ModalForm>
  );
};

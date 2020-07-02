import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { scanProject } from '../../api';

interface IProps {
  projectName: string; 
  branchName: string;
  filterPath: string;
}

interface IRecord {
  filename: string;
  files: string[]
}

const columns = [
  {
    title: '文件名',
    dataIndex: 'filename',
    key: 'filename',
  },
  {
    title: '被引用文件',
    key: 'files',
    render: (_: string, record: IRecord) => record.files.map(item => <div key={item}>{item}</div>)
  },
  {
    title: '被引用次数',
    key: 'count',
    render: (_: string, record: IRecord) => record.files.length,
    sorter: (a: IRecord, b: IRecord) => a.files.length - b.files.length
  },
]

const FileTable = ({ projectName, branchName, filterPath }: IProps) => {
  const [tableData, setTableData] = useState([] as IRecord[]);
  const [renderData, setRenderData] = useState([] as IRecord[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData({ projectName, branchName });
  }, [projectName, branchName]);

  useEffect(() => {
    if (!filterPath) return;
    setRenderData(tableData.filter(({ filename }) => filename.includes(filterPath)));
  }, [filterPath, tableData]);

  const getData = async ({ projectName, branchName }: Pick<IProps, 'projectName' | 'branchName'>) => {
    if (!projectName || !branchName) return;
    setLoading(true);
    const data = await scanProject({ projectName, branchName });
    const newData = Object.entries(data).map(([key, value]) => ({ filename: key, files: value, key }));
    setTableData(newData);
    setLoading(false);
  }

  return (
    <Table className='table' dataSource={filterPath ? renderData : tableData} columns={columns} bordered loading={loading} />
  )
};

export default FileTable;

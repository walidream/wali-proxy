import React, { useState, useMemo, useCallback } from 'react';
import { useSelector,useDispatch } from "react-redux";
import Highlighter from 'react-highlight-words';

import { Table, Input, Button} from 'antd';

import Tags from "./components/Tags"
import TagFilter from "./components/TagFilter"
import { SPLIT_SYMBOL, ALL } from '@/constants'
import { RuleType } from "./types"

import useTagColor from '@/hooks/useTagColor'
import { getRulesList, getSelectRules } from "@/model/storage/selector"

const { Search } = Input;

const RulesList = () => {
  const dispatch = useDispatch()

  const [selectionType] = useState<'checkbox'>('checkbox')
  const [searchInp, setSearchInp] = useState('')
  const [selectTag, setSelectTag] = useState(ALL)

  const dataSource = useSelector(getRulesList)
  const slectRules = useSelector(getSelectRules)

  const colorMap = useTagColor()
  const tagList = useMemo(() => 
    dataSource.map(item => item.tag?.split(SPLIT_SYMBOL).map(tag => tag.trim())).flat()
  , [dataSource])    
 
  const filterDataSource = useMemo(() => {
    let _data = dataSource?.map(item => {
      let tagMap = new Map()
      let _tags = item.tag?.split(SPLIT_SYMBOL).map(tag => tag.trim()).flat()
      _tags?.forEach(tag => tagMap.set(tag, colorMap.get(tag)))
  
      item["tagMap"] = tagMap
      
      return item;
    })
    //过滤输入
    if(searchInp !== ''){
      _data = _data.filter(item => 
        item.host?.toLocaleUpperCase().includes(searchInp.toLocaleUpperCase().trim()) || 
        item.target?.toLocaleUpperCase().includes(searchInp.toLocaleUpperCase().trim())
      )
    }

    //过滤标签
    return _data.filter(item => 
      selectTag === ALL || 
      (item.tagMap && item.tagMap.get(selectTag))
     )

  }, [dataSource, selectTag, searchInp,colorMap])

  const onDelete = useCallback((key:string) => {
    dispatch.storage.removeRulesItem(key)
  },[dispatch],)

  const onEditor = useCallback((key:string) => {
    dispatch.storage.editorFormRule(key)
  },[dispatch])
  
  const columns = useMemo(() => {
    return [
      {
        title: '源(域名/URL)',
        dataIndex: 'host',
        width: 300,
        ellipsis: false,
        render:(host:string) => {
          return(
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[searchInp]}
              autoEscape={true}
              textToHighlight={host?host:''}
            />
          )
        }
      },
      {
        title: '目标(域名/URL)',
        dataIndex: 'target',
        width: 300,
        ellipsis: false,
        render:(target:string) => {
          return(
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[searchInp]}
              autoEscape={true}
              textToHighlight={target?target:''}
            />
          )
        }
      },
      {
        title: '链接',
        dataIndex: 'link',
        width: 100,
        render: (link:string, record:any) => {
          return (
           <Button type="link" target="_blank" href={link}>Yapi</Button>
          )
        }
      },
      {
        title: '标签',
        dataIndex: 'tag',
        width: 100,
        render: (tag:string, record:any) => {
          return (
            <Tags tagMap={record?.tagMap}></Tags>
          )
        }
      },
      {
        title: '排序',
        dataIndex: 'sort',
        width: 100,
        sorter: {
          compare: (a:any, b:any) => a.sort - b.sort,
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 150
      },
      {
        title: 'Action',
        key: 'operation',
        width: 250,
        render: (record:any) => {
          return(
            <div className='operation-wrap'>
              <span onClick={() => onEditor(record?.key)}>编辑</span>
              <span onClick={() => onDelete(record?.key)}>删除</span>
            </div>
          )
        },
      },
    ]
  }, [searchInp,onDelete,onEditor])

  const onSearch = (value:string) => {
    setSearchInp(value)
  }

  const rowSelection = useMemo(() => {
    return {
      selectedRowKeys: slectRules,
      onChange: (selectedRowKeys: React.Key[], selectedRows: RuleType[]) => {
        dispatch.storage.selectRules(selectedRowKeys)
      }
    }
  }, [slectRules,dispatch])

  return(
    <React.Fragment>
      <TagFilter
        tagsData={tagList} 
        tagsMap={colorMap}
        tagvalue={selectTag}
        tagsOnClick={setSelectTag}/>
      <div className='search-wrap'>
        <Search placeholder="input search text" onSearch={onSearch} enterButton />
      </div>
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        size={'small'}
        scroll={{ x: true }}
        columns={columns}
        dataSource={filterDataSource}
      />
    </React.Fragment>
  )
}

export default RulesList


import React from "react";
import { Tag } from 'antd';

const Tags = ({
  tagMap,
}:{
  tagMap?: Map<any,any>
}) => {

  if(tagMap === undefined) return null

  const keys = [...tagMap.keys()]

  return(
    <React.Fragment>
      {
        keys?.map(key => (
          <Tag key={key} color={tagMap.get(key)}>
            {key}
          </Tag>
        ))
      }
    </React.Fragment>
  )
}

export default Tags


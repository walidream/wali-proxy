import React from "react";

import { ALL } from "@/constants"
import { statisticalArray } from "@/utils"

const TagFilter = (
  {
    tagsData,
    tagsMap,
    tagvalue,
    tagsOnClick,
  }:{
    tagsData: string[],
    tagsMap: Map<any,any>,
    tagvalue: string,
    tagsOnClick: (key:string) => void
  }
) =>{

  if(tagsMap.size === 0) return null

  const keys = [...tagsMap.keys()]
  const tagsCount = statisticalArray(keys,tagsData)  

  const _style = (tag:string) => {
    if(tagvalue === tag){
      return{
        border: tagsMap.get(tag),
        color: "#fff",
        backgroundColor:tagsMap.get(tag),
        borderRadius:"2px",
        
      }
    }
    return {
      border: "0",
      color: tagsMap.get(tag),
      backgroudColor:"#fff",
      borderRadius:"0",
    }
  }

  const _onTagClick = (key:string) => {
    tagsOnClick && tagsOnClick(key)
  }

  return (
    <div className="tags-filter">
      {
        keys?.map((key,ind) => (
          <span 
            key={ind} 
            className="tag" 
            style={_style(key)}
            onClick={() => _onTagClick(key)}>
            {key === ALL ?'全部':key}({key === ALL? tagsData.length: tagsCount.get(key)})
          </span>
        ))
      }
    </div>
  )
}

export default TagFilter
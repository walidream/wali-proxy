import { useSelector } from "react-redux";
import { TAGS_COLOR, SPLIT_SYMBOL, ALL} from '@/constants'
import { getRulesList } from "@/model/storage/selector"

const useTagColor = () => {

  const rules = useSelector(getRulesList)
  let colorMap = new Map([[ALL, "#409eff"]])
  const tagList = rules.map(item => item.tag?.split(SPLIT_SYMBOL).map(tag => tag.trim())).flat()
  const tags = [...new Set(tagList)]
  tags.forEach((tag, ind )=> colorMap.set(tag, TAGS_COLOR[ind]))

  return colorMap
}

export default useTagColor



















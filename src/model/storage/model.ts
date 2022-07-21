import { createModel } from "@rematch/core";
import { RootModel } from "../store";

import { YAPI_PROXY_RULES, YAPI_PROXY_ENABLE, YAPI_PROXY_LOGIN} from "@/constants"
import { chromeStorage } from "@/utils/storage" 
import { addRulesArray, uuid, selectRulesArray } from "@/utils"
import { RuleType } from "@/modules/Rule/types"


interface RuleListType extends RuleType {

}

interface StorageModel {
  enable: boolean;
  login: boolean;
  formRule:RuleType;
  rulesList: RuleListType[];
}

const initialState: StorageModel = {
  enable: false,
  login: false,
  formRule: {
    key: uuid(),
    host:'',
    target:'',
    tag:'',
    sort:0,
    remark:'',
    link:'',
    checked:false
  },
  rulesList: []
};

const storage = createModel<RootModel>()({
  name: "storage",
  state: initialState,
  reducers: {
    initStorage(state, payload: Object){
      return{
        ...state,
        ...payload
      }
    },
    addRulesItem(state, payload: RuleType){
      let rules = state.rulesList || []
      rules = addRulesArray(rules, payload)
      
      chromeStorage.set({YAPI_PROXY_RULES: rules}, (data:any)=>{
        console.log('设置rule',rules)
      })

      return {
        ...state,
        rulesList: rules
      }
    },
    removeRulesItem(state, payload:string){
      let rules = state.rulesList
      let _rules = rules.filter((item:RuleType)  => item.key !== payload)

      chromeStorage.set({YAPI_PROXY_RULES: _rules}, (data:any)=>{
        console.log('选中rules',_rules)
      })

      return {
        ...state,
        rulesList: _rules
      }
    },
    editorFormRule(state, payload: string){
      const rules = state.rulesList 
      console.log(rules)
      const rule = rules?.filter((item:RuleType)  => item.key === payload).pop()      

      if(rule){
        return{
          ...state,
          formRule:rule
        }
      }
      return {
        ...state
      }
    },
    resetFormRule(state){
      return{
        ...state,
        formRule: {
          key: uuid(),
          host:'',
          target:'',
          tag:'',
          sort:0,
          remark:'',
          checked:false
        }
      }
    },
    switchEnable(state, paypload:boolean){
      chromeStorage.set({YAPI_PROXY_ENABLE: paypload}, (data:any)=>{
        console.log('设置开关',paypload)
      })
      return{
        ...state,
        enable:paypload
      }
    },
    selectRules(state, paypload:string[]){
      const ruleList = state.rulesList 
      const rules = selectRulesArray(ruleList, paypload)

      chromeStorage.set({YAPI_PROXY_RULES: rules}, (data:any)=>{
        console.log('选中rules',rules)
      })

      return{
        ...state,
        rulesList:rules
      }
    },
    loginEnable(state, paypload:boolean){
      chromeStorage.set({YAPI_PROXY_LOGIN: paypload}, (data:any)=>{
        console.log('设置登陆',paypload)
      })
      return{
        ...state,
        login:paypload
      }
    }
  },
  effects: dispatch => ({
    async getYapiRules(payload, rootState) {

      chromeStorage.get([YAPI_PROXY_RULES,YAPI_PROXY_ENABLE, YAPI_PROXY_LOGIN], (data:any) => {
        console.log('获取数据', data)
        const {
          YAPI_PROXY_RULES:rulesList,  
          YAPI_PROXY_ENABLE: enable,
          YAPI_PROXY_LOGIN: login
        } = data
        dispatch.storage.initStorage({
          enable,
          rulesList,
          login
        })
      })
    }
  })
});

export default storage;

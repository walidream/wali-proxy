import { createSelector } from "reselect";
import { RootState } from "../store";

export const getRulesList = (state: RootState) => state.storage.rulesList || [];
export const getFormRule = (state: RootState) => state.storage.formRule;

export const getChecked = (state: RootState) => state.storage.enable;

export const getSelectRules = createSelector(
  [getRulesList],
  ( rulesList ) => {
    if(rulesList){
      return rulesList.filter(item => item.checked ).map(item => item.key)
    }
    return []
  }  
)

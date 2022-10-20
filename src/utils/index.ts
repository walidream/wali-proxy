import { v4 as uuidv4 } from "uuid";

export const statisticalArray = (sourceArr: any[], targetArr: string[]) => {
  let countMap = new Map();

  sourceArr.forEach((val) => {
    targetArr.forEach((v) => {
      if (v === val) {
        countMap.get(v)
          ? countMap.set(val, countMap.get(v) + 1)
          : countMap.set(val, 1);
      }
    });
  });

  return countMap;
};

//select rule
export const selectRulesArray = (sourceArr: any[], targetArr: string[]) => {
  let rules = sourceArr.map((item) => {
    item.checked = false;
    return item;
  });

  targetArr.forEach((val) => {
    rules.forEach((v) => {
      if (v.key === val) {
        v.checked = true;
      }
    });
  });

  return rules;
};

//add rule
export const addRulesArray = (sourceArr: any[], value: any) => {
  let rules = [];
  const index = sourceArr.findIndex(
    (val) => val.key !== "" && val.key === value.key
  );
  if (index === -1) {
    rules = [value, ...sourceArr];
  } else {
    sourceArr[index] = value;
    rules = [...sourceArr];
  }
  return rules;
};

//Generate rule key
export const uuid = () => {
  return uuidv4();
};

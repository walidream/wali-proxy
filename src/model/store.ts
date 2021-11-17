import { init, Models, RematchDispatch, RematchRootState } from "@rematch/core";
import loadingPlugin, { ExtraModelsFromLoading } from "@rematch/loading";
import selectPlugin from "@rematch/select";

import storage from "./storage/model";

export interface RootModel extends Models<RootModel> {
  storage: typeof storage;
}

type FullModel = ExtraModelsFromLoading<RootModel>;

export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

export const store =  (initStateMap: any, context: any) => {
  return init<RootModel, FullModel>({
    models: {
      storage,
    },
    plugins: [selectPlugin(), loadingPlugin()]
  });
};

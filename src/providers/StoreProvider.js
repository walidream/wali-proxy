import { Provider } from 'react-redux'

const StoreProvider = ({ store, children }) => <Provider store={store}>{children}</Provider>

export default StoreProvider
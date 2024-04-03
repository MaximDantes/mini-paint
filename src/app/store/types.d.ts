import { store } from '@/app/store/store'

declare global {
    type RootState = ReturnType<typeof store.getState>
    type AppDispatch = typeof store.dispatch
}

import { createReducer, on } from '@ngrx/store';
import { deleteItem, setItems, unSetItems } from './ingreso-egreso.action';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AppState } from '../app.reducer';

export interface State {
  items: IngresoEgreso[];
}

export interface AppStateWithIngreso extends AppState {
  ingresosEgresos: State;
}

export const initialState: State = {
  items: [],
};

export const ingresoEgresoReducer = createReducer(
  initialState,
  on(setItems, (state, { items }) => ({
    ...state,
    items: [...state.items, ...items],
  })),
  on(unSetItems, (state) => ({
    ...state,
    items: [],
  })),
  on(deleteItem, (state, { uidItem }) => ({
    ...state,
    items: [...state.items.filter((item) => item.uid !== uidItem)],
  }))
);

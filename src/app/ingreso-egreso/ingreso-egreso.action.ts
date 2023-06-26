import { createAction, props } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

export const setItems = createAction(
  '[INGRESO EGRESO] setItems',
  props<{ items: IngresoEgreso[] }>()
);
export const unSetItems = createAction('[INGRESO EGRESO] unSetItems');
export const deleteItem = createAction(
  '[INGRESO EGRESO] deleteItem',
  props<{ uidItem: string }>()
);

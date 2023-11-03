
import { atom } from 'jotai';
import { ModalDataType } from './types';

export const ModalData = atom<ModalDataType>({
    content: null,
    isShowing: false,
});

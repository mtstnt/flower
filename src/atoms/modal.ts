
import { atom } from 'jotai';
import { JSX } from 'react'

type Nullable<T> = T | null;

type ModalDataType = {
    data?: Nullable<any>,
    content: Nullable<JSX.Element>,
    isShowing: boolean,
};

export type ModalProps = {
    nodeId: string,
}

export const ModalData = atom<ModalDataType>({
    content: null,
    isShowing: false,
});

import React, { InputHTMLAttributes, ReactNode, useState } from "react";
import styles from "./styles.module.scss";
import { CategoryItemProps } from "../../../pages/categories";
import { ProductItemProps } from "../../../pages/products";
import { TableItemProps } from "../../../pages/tables";
import { UserItemProps } from "../../../pages/users";

interface InputPropsCategory extends InputHTMLAttributes<HTMLInputElement> {
    isChecked: boolean;
    itemCategory: CategoryItemProps
    handleDisableCategory: (id: string, disable: boolean) => void;
}

interface InputPropsUser extends InputHTMLAttributes<HTMLInputElement> {
    isChecked: boolean;
    itemUser: UserItemProps
    handleDisableUser: (id: string, disable: boolean) => void;
}

interface InputPropsUserReadOnly extends InputHTMLAttributes<HTMLInputElement> {
    isChecked: boolean;
}

interface InputPropsTableDisable extends InputHTMLAttributes<HTMLInputElement> {
    isChecked: boolean;
    itemTable: TableItemProps
    handleDisableTable: (id: string, disable: boolean) => void;
}

interface InputPropsTable extends InputHTMLAttributes<HTMLInputElement> {
    isChecked: boolean;
}

interface InputPropsProduct extends InputHTMLAttributes<HTMLInputElement> {
    isChecked: boolean;
    itemProduct: ProductItemProps
    handleDisableProduct: (id: string, table_call_waiter: boolean) => void;
}

interface InputPropsTableCallWaiter extends InputHTMLAttributes<HTMLInputElement> {
    isChecked: boolean;
    itemTable: TableItemProps
    handleCallWaiter: (id: string) => void;
}

interface InputPropsTableCloseBill extends InputHTMLAttributes<HTMLInputElement> {
    isChecked: boolean;
    itemTable: TableItemProps
    handleCloseBill: (id: string) => void;
}

export function SwitchTableDisable({ isChecked, itemTable, handleDisableTable }: InputPropsTableDisable) {
    return (
        <label className={styles.toggleSwitchDisable}>
            <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleDisableTable(itemTable.id, itemTable.status)} />
            <span
                className={styles.switch}
                title={isChecked === true && ('Mesa disponível (SIM)') || ('Mesa disponível (NÃO)')} />
        </label>
    );
}

export function SwitchTable({ isChecked }: InputPropsTable) {
    return (
        <label className={styles.toggleSwitch}>
            <input
                type="checkbox"
                checked={isChecked}
                readOnly />
            <span
                className={styles.switch} />
        </label>
    );
}

export function SwitchCategory({ isChecked, itemCategory, handleDisableCategory }: InputPropsCategory) {
    return (
        <label className={styles.toggleSwitchDisable}>
            <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleDisableCategory(itemCategory.id, itemCategory.status)} />
            <span
                className={styles.switch}
                title="Habilitar / Desabilitar" />
        </label>
    );
}

export function SwitchUser({ isChecked, itemUser, handleDisableUser }: InputPropsUser) {
    return (
        <label className={styles.toggleSwitchDisable}>
            <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleDisableUser(itemUser.id, itemUser.status)} />
            <span
                className={styles.switch}
                title="Habilitar / Desabilitar" />
        </label>
    );
}

export function SwitchUserReadOnly({ isChecked }: InputPropsUserReadOnly) {
    return (
        <label className={styles.toggleSwitch}>
            <input
                type="checkbox"
                checked={isChecked}
                readOnly />
            <span
                className={styles.switch} />
        </label>
    );
}

export function SwitchProduct({ isChecked, itemProduct, handleDisableProduct }: InputPropsProduct) {
    return (
        <label className={styles.toggleSwitchDisable}>
            <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleDisableProduct(itemProduct.id, itemProduct.status)} />
            <span
                className={styles.switch}
                title="Habilitar / Desabilitar" />
        </label>
    );
}

export function SwitchTableCallWaiter({ isChecked, itemTable, handleCallWaiter }: InputPropsTableCallWaiter) {
    return (
        <label className={styles.toggleSwitchDisable}>
            <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleCallWaiter(itemTable.id)} />
            <span
                className={styles.switch}
                title="Habilitar / Desabilitar" />
        </label>
    );
}

export function SwitchTableCloseBill({ isChecked, itemTable, handleCloseBill }: InputPropsTableCloseBill) {
    return (
        <label className={styles.toggleSwitchDisable}>
            <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleCloseBill(itemTable.id)} />
            <span
                className={styles.switch}
                title="Habilitar / Desabilitar" />
        </label>
    );
}
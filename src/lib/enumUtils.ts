/* eslint-disable @typescript-eslint/no-namespace */
import { $Enums } from "@prisma/client";

export namespace TransactionType {
  export function toString(type: $Enums.TransactionType) {
    switch (type) {
      case $Enums.TransactionType.EXPENSE:
        return "Expense";
      case $Enums.TransactionType.INCOME:
        return "Income";
      case $Enums.TransactionType.SAVINGS:
        return "Savings";
    }
  }
}

export namespace CategoryOwnerType {
  export function toString(type: $Enums.CategoryOwnerType) {
    switch (type) {
      case $Enums.CategoryOwnerType.SYSTEM:
        return "System";
      case $Enums.CategoryOwnerType.USER:
        return "User";
    }
  }
}

import { $Enums } from "@prisma/client";

export const TransactionType = {
  toString(type: $Enums.TransactionType): string {
    switch (type) {
      case $Enums.TransactionType.EXPENSE:
        return "Expenses";
      case $Enums.TransactionType.INCOME:
        return "Income";
      case $Enums.TransactionType.SAVINGS:
        return "Savings";
    }
  },

  toRoute(type: $Enums.TransactionType): string {
    switch (type) {
      case $Enums.TransactionType.EXPENSE:
        return "/expenses";
      case $Enums.TransactionType.INCOME:
        return "/income";
      case $Enums.TransactionType.SAVINGS:
        return "/savings";
    }
  },
};

export const TransactionFrequency = {
  toString(type: $Enums.TransactionFrequency): string {
    switch (type) {
      case $Enums.TransactionFrequency.NON_RECURRING:
        return "Non-Recurring";
      case $Enums.TransactionFrequency.DAILY:
        return "Daily";
      case $Enums.TransactionFrequency.WEEKLY:
        return "Weekly";
      case $Enums.TransactionFrequency.BI_WEEKLY:
        return "Bi-Weekly";
      case $Enums.TransactionFrequency.MONTHLY:
        return "Monthly";
      case $Enums.TransactionFrequency.BI_MONTHLY:
        return "Bi-Monthly";
      case $Enums.TransactionFrequency.QUARTERLY:
        return "Quarterly";
      case $Enums.TransactionFrequency.YEARLY:
        return "Yearly";
    }
  },
};

export const CategoryOwnerType = {
  toString(type: $Enums.CategoryOwnerType): string {
    switch (type) {
      case $Enums.CategoryOwnerType.SYSTEM:
        return "System";
      case $Enums.CategoryOwnerType.USER:
        return "User";
    }
  },
};

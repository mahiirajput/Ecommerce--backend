import { AdminRoles } from '../enums/admin-roles.enum';
import { permissions } from '../enums/permissions';

export const RolePermissions: Record<AdminRoles, permissions[]> = {
  [AdminRoles.Super_Admin]: Object.values(permissions), // all permissions

  [AdminRoles.Product_Admin]: [
    permissions.PRODUCT_CREATE,
    permissions.PRODUCT_READ,
    permissions.PRODUCT_UPDATE,
    permissions.PRODUCT_DELETE,
    permissions.PRODUCT_BULK_OPERATIONS,
    permissions.CATEGORY_CREATE,
    permissions.CATEGORY_READ,
    permissions.CATEGORY_UPDATE,
    permissions.CATEGORY_DELETE,
    permissions.PRODUCT_SEARCH,
    permissions.ADVANCED_SEARCH,
    permissions.IMAGE_UPLOAD,
    permissions.IMAGE_DELETE,
  ],

  [AdminRoles.Order_Admin]: [
    // You can define order-related permissions here if you add them
    // e.g., ORDER_VIEW, ORDER_UPDATE, etc.
  ],

  [AdminRoles.Payment_Admin]: [
    // Finance-related permissions go here if defined
    // e.g., VIEW_REVENUE, EXPORT_FINANCIAL_REPORTS, etc.
  ],

  [AdminRoles.User_Admin]: [
    // User-related permissions go here
    // e.g., USER_VIEW, USER_UPDATE, USER_DELETE, etc.
  ],
};

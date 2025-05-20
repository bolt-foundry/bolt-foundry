// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource.ts';
import * as PermissionsAPI from './permissions.ts';
import {
  PermissionCreateParams,
  PermissionCreateResponse,
  PermissionCreateResponsesPage,
  PermissionDeleteResponse,
  PermissionRetrieveParams,
  PermissionRetrieveResponse,
  Permissions,
} from './permissions.ts';

export class Checkpoints extends APIResource {
  permissions: PermissionsAPI.Permissions = new PermissionsAPI.Permissions(this._client);
}

Checkpoints.Permissions = Permissions;
Checkpoints.PermissionCreateResponsesPage = PermissionCreateResponsesPage;

export declare namespace Checkpoints {
  export {
    Permissions as Permissions,
    type PermissionCreateResponse as PermissionCreateResponse,
    type PermissionRetrieveResponse as PermissionRetrieveResponse,
    type PermissionDeleteResponse as PermissionDeleteResponse,
    PermissionCreateResponsesPage as PermissionCreateResponsesPage,
    type PermissionCreateParams as PermissionCreateParams,
    type PermissionRetrieveParams as PermissionRetrieveParams,
  };
}

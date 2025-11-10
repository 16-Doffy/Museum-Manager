import { Account } from '../users/types';
import { Museum } from '../museum/types';

export interface PendingAccount extends Account {
  status: 'Pending';
  museumId: null;
  museumName: null;
}

export interface PendingMuseum extends Museum {
  status: 'Pending';
}

export interface AssignMuseumRequest {
  accountId: string;
  museumId: string;
}

export interface AssignMuseumResponse {
  account: Account;
  museum: Museum;
}


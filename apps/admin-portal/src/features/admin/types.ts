export interface AccountStats {
  totalActiveUsers: number;
  accountByRole: {
    [roleName: string]: {
      count: number;
    };
  };
  newAccountsLast7Days: {
    items: Array<{
      id: string;
      email: string;
      fullName: string;
      status: string;
      createAt: string;
      updateAt: string | null;
      roleId: string;
      roleName: string;
      museumId: string | null;
      museumName: string | null;
    }>;
    totalItems: number;
    pageIndex: number;
    totalPages: number;
    pageSize: number;
  };
}

export interface MuseumStats {
  totalMuseums: number;
  museumsByStatus: {
    Active: {
      count: number;
    };
    Inactive: {
      count: number;
    };
  };
  museumWithMostArtifacts: {
    museumId: string;
    museumName: string;
    artifactCount: number;
  };
}

export interface ArtifactStats {
  totalArtifacts: number;
  artifactsByStatus: {
    OnDisplay: {
      count: number;
    };
    InStorage: {
      count: number;
    };
    UnderRestoration: {
      count: number;
    };
    Deleted: {
      count: number;
    };
  };
}

import api from "../../../services/api";

export interface CategoryDTO {
  id: number;
  name: string;
  character?: string | null;
  color?: string | null;
  productCount: number;
  categoryType?: number;
  subcategories: Array<{
    id: number;
    name: string;
    character?: string | null;
    color?: string | null;
    productCount: number;
  }>;
}

export type UpsertMainCategoryPayload = {
  id?: number;
  name: string;
  categoryType: number;
};

export type UpsertSubCategoryPayload = {
  id?: number;
  type: "sub";
  name: string;
  mainCategoryId: number;
  character?: string | null;
  color?: string | null;
  categoryType: number;
};

export type UpsertCategoryPayload =
  | UpsertMainCategoryPayload
  | UpsertSubCategoryPayload;

export const categoryApi = {
  async getAll(): Promise<CategoryDTO[]> {
    const { data } = await api.get<CategoryDTO[]>("/category", {
      skipAuthRedirect: true,
    });
    return data;
  },
  async upsert(payload: UpsertCategoryPayload): Promise<boolean> {
    const { data } = await api.post<boolean>("/category", payload, {
      skipAuthRedirect: true,
    });
    return data;
  },
  async removeCategory(id: number): Promise<boolean> {
    const { data } = await api.delete<boolean>(`/category/${id}`, {
      skipAuthRedirect: true,
    });
    return data;
  },
  async removeSubCategory(mainId: number, subId: number): Promise<boolean> {
    // backend has route: DELETE /category/:mainId/sub/:subId
    const { data } = await api.delete<boolean>(
      `/category/${mainId}/sub/${subId}`,
      { skipAuthRedirect: true }
    );
    return data;
  },
};

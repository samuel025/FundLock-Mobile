import { API } from "@/lib/api";

export interface SearchCompanyResponse {
  id: string;
  name: string;
}

export interface SearchOutletResponse {
  id: string;
  name: string;
  orgId?: string;
}

export async function searchCompanies(
  categoryId: string,
  query: string
): Promise<SearchCompanyResponse[]> {
  try {
    const response = await API.get(`/companies/search`, {
      params: {
        categoryId,
        q: query,
      },
    });
    return response.data?.data ?? response.data ?? [];
  } catch (error) {
    console.error("Search companies error:", error);
    return [];
  }
}

export async function searchOutlets(
  query: string,
  categoryId?: string,
  companyId?: string
): Promise<SearchOutletResponse[]> {
  try {
    const params: Record<string, string> = { q: query };
    if (categoryId) params.categoryId = categoryId;
    if (companyId) params.companyId = companyId;

    const response = await API.get(`/outlets/search`, {
      params,
    });
    return response.data?.data ?? response.data ?? [];
  } catch (error) {
    console.error("Search outlets error:", error);
    return [];
  }
}

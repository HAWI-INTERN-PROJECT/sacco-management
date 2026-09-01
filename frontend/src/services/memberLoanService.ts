import api from "@/lib/api";

export type MemberLoanStatus =
  | "pending"
  | "approved"
  | "active"
  | "rejected"
  | "closed"
  | "completed";

export interface MemberLoan {
  id: number;
  loan_number: string;
  amount: number;
  purpose: string;
  status: MemberLoanStatus;
  interest_rate: number | null;
  term_months: number | null;
  total_repayable: number | null;
  monthly_installment: number | null;
  rejection_reason: string | null;
  approved_at: string | null;
  disbursed_at: string | null;
  created_at: string | null;
  repayment_schedule?: MemberLoanSchedule[];
  repayments?: MemberLoanRepayment[];
}

export interface MemberLoanSchedule {
  id: number;
  installment_number: number;
  due_date: string;
  principal_due: number;
  interest_due: number;
  total_due: number;
  amount_paid: number;
  status: "pending" | "paid" | "overdue";
}

export interface MemberLoanRepayment {
  id: number;
  loan_schedule_id: number;
  amount: number;
  paid_at: string;
  method: string;
}

interface LaravelLoanPagination {
  data: MemberLoan[];
  meta?: {
    current_page?: number;
    last_page?: number;
    total?: number;
  };
}

export interface MemberLoansPage {
  loans: MemberLoan[];
  pagination: {
    currentPage: number;
    lastPage: number;
    total: number;
  };
}

export interface ApplyForLoanRequest {
  amount: number;
  purpose: string;
  loan_type: string;
  term_months: number;
  guarantor_id?: number | null;
}

export async function getMemberLoans(page = 1): Promise<MemberLoansPage> {
  const { data } = await api.get<LaravelLoanPagination>("/me/loans", {
    params: { page },
  });

  return {
    loans: data.data ?? [],
    pagination: {
      currentPage: data.meta?.current_page ?? page,
      lastPage: data.meta?.last_page ?? 1,
      total: data.meta?.total ?? 0,
    },
  };
}

export async function getMemberLoan(id: string): Promise<MemberLoan> {
  const { data } = await api.get<{ data: MemberLoan }>(`/loans/${id}`);
  return data.data;
}

export async function applyForLoan(
  request: ApplyForLoanRequest,
): Promise<MemberLoan> {
  const { data } = await api.post<{ data: MemberLoan }>("/loans", request);
  return data.data;
}

export interface GuarantorSearchUser {
  id: number;
  name: string;
  email: string;
  national_id: string;
}

export async function searchGuarantors(query: string): Promise<GuarantorSearchUser[]> {
  const { data } = await api.get<{ data: GuarantorSearchUser[] }>("/guarantors/search", {
    params: { search: query }
  });
  return data.data;
}

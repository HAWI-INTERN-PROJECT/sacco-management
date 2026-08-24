import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, CircleAlert, FileText, Send } from "lucide-react";
import {
  applyForLoan,
  type ApplyForLoanRequest,
} from "@/services/memberLoanService";

interface LoanApplicationForm {
  amount: string;
  purpose: string;
}

export default function ApplyLoan() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoanApplicationForm>({
    defaultValues: { amount: "", purpose: "" },
  });

  const mutation = useMutation({
    mutationFn: (request: ApplyForLoanRequest) => applyForLoan(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["member", "loans"] });
      toast.success(t("member.apply_loan.success"));
      navigate("/member/loans");
    },
    onError: (error) => {
      const fallbackMessage = t("member.apply_loan.submit_error");
      setSubmissionError(fallbackMessage);

      if (!isAxiosError(error)) return;

      const responseData = error.response?.data as
        | { message?: string; errors?: Record<string, string[]> }
        | undefined;
      setSubmissionError(responseData?.message ?? fallbackMessage);

      const fieldErrors = responseData?.errors;
      if (fieldErrors?.amount?.[0]) {
        setError("amount", { type: "server", message: fieldErrors.amount[0] });
      }
      if (fieldErrors?.purpose?.[0]) {
        setError("purpose", { type: "server", message: fieldErrors.purpose[0] });
      }
    },
  });

  const onSubmit = (formData: LoanApplicationForm) => {
    setSubmissionError(null);
    const amount = Number(formData.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("amount", {
        type: "validate",
        message: t("member.apply_loan.amount_invalid"),
      });
      return;
    }

    const purpose = formData.purpose.trim();
    if (!purpose) {
      setError("purpose", {
        type: "validate",
        message: t("member.apply_loan.purpose_required"),
      });
      return;
    }

    mutation.mutate({ amount, purpose });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link to="/member/loans" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t("member.apply_loan.back_to_loans")}
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
          {t("member.apply_loan.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("member.apply_loan.subtitle")}
        </p>
      </div>

      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold text-emerald-900 dark:text-emerald-200">
              {t("member.apply_loan.review_title")}
            </h2>
            <p className="mt-1 text-sm text-emerald-800/80 dark:text-emerald-300/80">
              {t("member.apply_loan.review_description")}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            {t("member.apply_loan.application_details")}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("member.apply_loan.required_notice")}
          </p>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="loan-amount" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t("member.apply_loan.amount")} <span className="text-rose-500">*</span>
            </label>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-medium text-slate-500 dark:text-slate-400">ETB</span>
              <input
                id="loan-amount"
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                aria-invalid={Boolean(errors.amount)}
                aria-describedby={errors.amount ? "loan-amount-error" : undefined}
                className={`w-full rounded-lg border bg-white py-2.5 pl-14 pr-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 dark:bg-slate-950 dark:text-white ${errors.amount ? "border-rose-500" : "border-slate-300 dark:border-slate-700"}`}
                placeholder={t("member.apply_loan.amount_placeholder")}
                {...register("amount", {
                  required: t("member.apply_loan.amount_required"),
                  validate: (value) => Number(value) > 0 || t("member.apply_loan.amount_invalid"),
                })}
              />
            </div>
            {errors.amount && <p id="loan-amount-error" className="mt-1.5 text-sm text-rose-600 dark:text-rose-400">{errors.amount.message}</p>}
          </div>

          <div>
            <label htmlFor="loan-purpose" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t("member.apply_loan.purpose")} <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="loan-purpose"
              rows={5}
              aria-invalid={Boolean(errors.purpose)}
              aria-describedby={errors.purpose ? "loan-purpose-error" : undefined}
              className={`mt-2 w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 dark:bg-slate-950 dark:text-white ${errors.purpose ? "border-rose-500" : "border-slate-300 dark:border-slate-700"}`}
              placeholder={t("member.apply_loan.purpose_placeholder")}
              {...register("purpose", {
                required: t("member.apply_loan.purpose_required"),
                validate: (value) => value.trim().length > 0 || t("member.apply_loan.purpose_required"),
              })}
            />
            {errors.purpose && <p id="loan-purpose-error" className="mt-1.5 text-sm text-rose-600 dark:text-rose-400">{errors.purpose.message}</p>}
          </div>
        </div>

        {submissionError && (
          <div role="alert" className="mt-5 flex gap-2 rounded-lg border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            <CircleAlert className="h-5 w-5 shrink-0" aria-hidden="true" />
            <p>{submissionError}</p>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
          <Link to="/member/loans" className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            {t("member.apply_loan.cancel")}
          </Link>
          <button type="submit" disabled={mutation.isPending} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
            <Send className="h-4 w-4" aria-hidden="true" />
            {mutation.isPending ? t("member.apply_loan.submitting") : t("member.apply_loan.submit")}
          </button>
        </div>
      </form>
    </div>
  );
}

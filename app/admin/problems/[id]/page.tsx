import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminProblemDetail } from "@/components/admin/admin-problem-detail"

export default async function AdminProblemDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirectTo=/admin")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/")
  }

  return <AdminProblemDetail problemId={params.id} />
}

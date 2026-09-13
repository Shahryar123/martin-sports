import { Plus, FolderTree } from "lucide-react";
import { categoryRepository } from "@/lib/repositories/category-repository";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { CategoryFormDialog } from "@/components/admin/categories/category-form-dialog";
import { CategoriesTable } from "@/components/admin/categories/categories-table";

export default async function AdminCategoriesPage() {
  const categories = await categoryRepository.adminList();
  const nextSortOrder = categories.length
    ? Math.max(...categories.map((c) => c.sortOrder)) + 1
    : 0;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description={`${categories.length} categor${categories.length === 1 ? "y" : "ies"} in the shop taxonomy.`}
        action={
          <CategoryFormDialog
            nextSortOrder={nextSortOrder}
            trigger={
              <Button>
                <Plus className="size-4" /> New Category
              </Button>
            }
          />
        }
      />

      {categories.length === 0 ? (
        <EmptyState
          icon={FolderTree}
          title="No categories yet"
          description="Create your first category to start organizing products."
        />
      ) : (
        <CategoriesTable categories={categories} />
      )}
    </div>
  );
}

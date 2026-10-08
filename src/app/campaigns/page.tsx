"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, PageHeader } from "@/components/ui/PageHeader";
import { formatDate } from "@/lib/format";
import { CampaignForm } from "@/features/campaigns/components/CampaignForm";
import { useCampaigns, useCreateCampaign, useDeleteCampaign } from "@/features/campaigns/hooks";

const tone = { active: "green", scheduled: "amber", ended: "grey" } as const;

export default function CampaignsPage() {
  const [open, setOpen] = useState(false);
  const { data: campaigns, isLoading } = useCampaigns();
  const create = useCreateCampaign();
  const remove = useDeleteCampaign();

  return (
    <>
      <PageHeader
        title="Campaigns"
        description="Time-boxed discounts on a set of products."
        action={<Button onClick={() => setOpen(true)}>New campaign</Button>}
      />

      <div className="overflow-x-auto rounded-lg border border-line bg-white">
        {isLoading ? (
          <p className="px-6 py-10 text-sm text-ink-soft">Loading campaigns…</p>
        ) : campaigns?.length === 0 ? (
          <EmptyState
            title="No campaigns yet"
            hint="Pick products, set a discount and a date range. Status updates automatically."
            action={<Button onClick={() => setOpen(true)}>New campaign</Button>}
          />
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-line">
              <tr>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Runs</th>
                <th className="px-4 py-3 text-right">Products</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {campaigns?.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">{c.discountType === "percentage" ? `${c.discountValue}% off` : `$${c.discountValue} off`}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {formatDate(c.startDate)} to {formatDate(c.endDate)}
                  </td>
                  <td className="px-4 py-3 text-right">{c.productIds.length}</td>
                  <td className="px-4 py-3">
                    <Badge tone={tone[c.status]}>{c.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="danger"
                      onClick={() => window.confirm(`Delete "${c.name}"?`) && remove.mutate(c.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <Modal title="New campaign" onClose={() => setOpen(false)}>
          <CampaignForm
            onCancel={() => setOpen(false)}
            onSubmit={async (values) => {
              await create.mutateAsync(values);
              setOpen(false);
            }}
          />
        </Modal>
      )}
    </>
  );
}

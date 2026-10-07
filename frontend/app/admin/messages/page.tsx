
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/src/components/admin/AdminSidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type MessageStatus =
  | "Unread"
  | "Read"
  | "Replied";

interface ApiContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status:
    | "UNREAD"
    | "READ"
    | "REPLIED";
  created_at: string;
  updated_at: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
}

const statusMap: Record<
  ApiContactMessage["status"],
  MessageStatus
> = {
  UNREAD: "Unread",
  READ: "Read",
  REPLIED: "Replied",
};

const reverseStatusMap: Record<
  MessageStatus,
  ApiContactMessage["status"]
> = {
  Unread: "UNREAD",
  Read: "READ",
  Replied: "REPLIED",
};

function mapMessage(
  message: ApiContactMessage
): ContactMessage {
  return {
    id: message.id,
    name: message.name,
    email: message.email,
    phone: message.phone ?? "",
    subject: message.subject,
    message: message.message,
    status: statusMap[message.status],
    createdAt: message.created_at,
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "en-RW",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString(
    "en-RW",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

export default function MessagesPage() {
  const router = useRouter();

  const [messages, setMessages] =
    useState<ContactMessage[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | MessageStatus>("ALL");

  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessage | null>(null);

  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/contact`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load messages"
        );
      }

      const mappedMessages =
        (data.messages ?? data.data ?? [])
          .map(mapMessage);

      setMessages(mappedMessages);
    } catch (err) {
      console.error(
        "Fetch messages error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load messages"
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchMessages();
  }, [fetchMessages]);

  const filteredMessages = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesSearch =
        !query ||
        message.name
          .toLowerCase()
          .includes(query) ||
        message.email
          .toLowerCase()
          .includes(query) ||
        message.subject
          .toLowerCase()
          .includes(query) ||
        message.message
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        message.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [messages, search, statusFilter]);

  const unreadCount =
    messages.filter(
      (message) =>
        message.status === "Unread"
    ).length;

  const readCount =
    messages.filter(
      (message) =>
        message.status === "Read"
    ).length;

  const repliedCount =
    messages.filter(
      (message) =>
        message.status === "Replied"
    ).length;

  async function updateStatus(
    id: number,
    status: MessageStatus
  ) {
    try {
      setUpdatingId(id);

      const response = await fetch(
        `${API_URL}/api/contact/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status:
              reverseStatusMap[status],
          }),
        }
      );

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update message"
        );
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === id
            ? {
                ...message,
                status,
              }
            : message
        )
      );

      setSelectedMessage((current) =>
        current?.id === id
          ? {
              ...current,
              status,
            }
          : current
      );
    } catch (err) {
      console.error(
        "Update message status error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update status"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteMessage(id: number) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this message?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(
        `${API_URL}/api/contact/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete message"
        );
      }

      setMessages((current) =>
        current.filter(
          (message) => message.id !== id
        )
      );

      if (
        selectedMessage?.id === id
      ) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error(
        "Delete message error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete message"
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <AdminSidebar />

        <section className="flex-1 overflow-hidden">
          <div className="border-b border-white/10 px-5 py-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
                  Admin Portal
                </p>

                <h1 className="mt-2 text-2xl font-light tracking-wide">
                  Messages
                </h1>

                <p className="mt-2 max-w-xl text-sm text-white/40">
                  Manage customer inquiries
                  received through the contact
                  form.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchMessages}
                className="w-fit border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white/60 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="p-5 lg:p-8">
            {error && (
              <div className="mb-6 border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatCard
                label="Unread"
                value={unreadCount}
              />

              <StatCard
                label="Read"
                value={readCount}
              />

              <StatCard
                label="Replied"
                value={repliedCount}
              />
            </div>

            {/* Search and filter */}
            <div className="mt-8 flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search name, email, subject..."
                className="w-full border border-white/10 bg-[#101010] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | "ALL"
                      | MessageStatus
                  )
                }
                className="border border-white/10 bg-[#101010] px-4 py-3 text-sm text-white/70 outline-none focus:border-[#D4AF37]/50"
              >
                <option
                  value="ALL"
                  className="bg-[#101010]"
                >
                  All Statuses
                </option>

                <option
                  value="Unread"
                  className="bg-[#101010]"
                >
                  Unread
                </option>

                <option
                  value="Read"
                  className="bg-[#101010]"
                >
                  Read
                </option>

                <option
                  value="Replied"
                  className="bg-[#101010]"
                >
                  Replied
                </option>
              </select>
            </div>

            {/* Messages table */}
            <div className="mt-6 overflow-hidden border border-white/10 bg-[#101010]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="px-5 py-4 text-[10px] font-normal uppercase tracking-[0.18em] text-white/30">
                        Customer
                      </th>

                      <th className="px-5 py-4 text-[10px] font-normal uppercase tracking-[0.18em] text-white/30">
                        Subject
                      </th>

                      <th className="px-5 py-4 text-[10px] font-normal uppercase tracking-[0.18em] text-white/30">
                        Date
                      </th>

                      <th className="px-5 py-4 text-[10px] font-normal uppercase tracking-[0.18em] text-white/30">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-[10px] font-normal uppercase tracking-[0.18em] text-white/30">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-12 text-center text-sm text-white/30"
                        >
                          Loading messages...
                        </td>
                      </tr>
                    ) : filteredMessages.length ===
                      0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-12 text-center"
                        >
                          <p className="text-sm text-white/40">
                            No messages found.
                          </p>

                          <p className="mt-2 text-xs text-white/20">
                            Try changing your
                            search or filter.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredMessages.map(
                        (message) => (
                          <tr
                            key={message.id}
                            className="border-b border-white/5 transition hover:bg-white/[0.025]"
                          >
                            <td className="px-5 py-4">
                              <p className="text-sm text-white/80">
                                {message.name}
                              </p>

                              <p className="mt-1 text-xs text-white/30">
                                {message.email}
                              </p>
                            </td>

                            <td className="max-w-[280px] px-5 py-4">
                              <p className="truncate text-sm text-white/70">
                                {message.subject}
                              </p>
                            </td>

                            <td className="px-5 py-4 text-xs text-white/40">
                              {formatDate(
                                message.createdAt
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <StatusBadge
                                status={
                                  message.status
                                }
                              />
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedMessage(
                                      message
                                    )
                                  }
                                  className="border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-white/50 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                                >
                                  View
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    deletingId ===
                                    message.id
                                  }
                                  onClick={() =>
                                    deleteMessage(
                                      message.id
                                    )
                                  }
                                  className="border border-red-500/10 px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-red-400/60 transition hover:border-red-400 hover:text-red-300 disabled:opacity-30"
                                >
                                  {deletingId ===
                                  message.id
                                    ? "..."
                                    : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="mt-4 text-xs text-white/20">
              Showing{" "}
              {filteredMessages.length} of{" "}
              {messages.length} messages
            </p>
          </div>
        </section>
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-white/10 bg-[#111111]">
            <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                  Message Details
                </p>

                <h2 className="mt-2 text-xl font-light">
                  {selectedMessage.subject}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedMessage(null)
                }
                className="text-xl text-white/30 transition hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <DetailItem
                  label="Customer"
                  value={
                    selectedMessage.name
                  }
                />

                <DetailItem
                  label="Email"
                  value={
                    selectedMessage.email
                  }
                />

                <DetailItem
                  label="Phone"
                  value={
                    selectedMessage.phone ||
                    "Not provided"
                  }
                />

                <DetailItem
                  label="Received"
                  value={formatDateTime(
                    selectedMessage.createdAt
                  )}
                />
              </div>

              <div>
                <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-white/30">
                  Message
                </p>

                <div className="whitespace-pre-wrap border border-white/10 bg-[#0A0A0A] p-4 text-sm leading-7 text-white/65">
                  {
                    selectedMessage.message
                  }
                </div>
              </div>

              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-white/30">
                  Status
                </p>

                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      "Unread",
                      "Read",
                      "Replied",
                    ] as MessageStatus[]
                  ).map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={
                        updatingId ===
                        selectedMessage.id
                      }
                      onClick={() =>
                        updateStatus(
                          selectedMessage.id,
                          status
                        )
                      }
                      className={`border px-4 py-2 text-xs transition ${
                        selectedMessage.status ===
                        status
                          ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                          : "border-white/10 text-white/40 hover:border-white/30 hover:text-white"
                      } disabled:opacity-40`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() =>
                    deleteMessage(
                      selectedMessage.id
                    )
                  }
                  className="border border-red-500/20 px-4 py-3 text-xs uppercase tracking-[0.15em] text-red-400 transition hover:border-red-400 hover:bg-red-500/5"
                >
                  Delete Message
                </button>

                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="border border-[#D4AF37]/40 px-4 py-3 text-center text-xs uppercase tracking-[0.15em] text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
                >
                  Reply by Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="border border-white/10 bg-[#101010] p-5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
        {label}
      </p>

      <p className="mt-3 text-3xl font-light text-white">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: MessageStatus;
}) {
  const styles = {
    Unread:
      "border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37]",
    Read:
      "border-white/10 bg-white/[0.03] text-white/40",
    Replied:
      "border-green-500/20 bg-green-500/5 text-green-400",
  };

  return (
    <span
      className={`inline-flex border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-white/30">
        {label}
      </p>

      <p className="break-words text-sm text-white/70">
        {value}
      </p>
    </div>
  );
}


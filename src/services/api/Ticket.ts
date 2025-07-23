import { api } from "./index";

export async function pickTicket(id: number): Promise<void> {
  await api.post(`/private/tickets/${id}/pick`);
}

export async function returnTicket(id: number): Promise<void> {
  await api.post(`/private/tickets/${id}/return`);
}

export async function resolveTicket(id: number): Promise<void> {
  await api.post(`/private/tickets/${id}/resolve`);
}

export async function sendTicketMessage(
  id: number,
  props:
    | { type: "text"; text: string }
    | {
        type: "audio";
        ptt?: boolean;
        files: { id: number; type: "audio" | "image/video" | "document" }[];
      }
    | {
        type: "image";
        text?: string;
        files: { id: number; type: "audio" | "image/video" | "document" }[];
      }
    | {
        type: "file";
        text?: string;
        files: { id: number; type: "audio" | "image/video" | "document" }[];
      }
): Promise<void> {
  await api.post(`/private/tickets/${id}/message`, props);
}

export async function updateBusiness(
  id: number,
  body: {
    name?: string;
    description?: string | null;
  }
): Promise<{
  updateAt: Date;
}> {
  const { data } = await api.put(`/private/businesses/${id}`, undefined, {
    params: body,
  });
  return data.business;
}

export async function getBusinessDetails(id: number): Promise<{
  name: string;
  updateAt: Date;
  createAt: Date;
  id: number;
  description: string | null;
}> {
  const { data } = await api.get(`/private/businesses/${id}/details`);
  return data.business;
}

export async function getBusiness(id: number): Promise<{
  name: string;
  description: string | null;
}> {
  const { data } = await api.get(`/private/businesses/${id}`);
  return data.business;
}

export async function getTickets(params?: {
  status?: "NEW" | "OPEN" | "RESOLVED" | "DELETED";
  page?: number;
}): Promise<
  {
    status: "NEW" | "OPEN" | "RESOLVED" | "DELETED";
    departmentId: number;
    name: string;
    id: number;
    userId?: number;
    lastInteractionDate: Date;
    count_unread: number;
    lastMessage: string | null;
  }[]
> {
  const { data } = await api.get("/private/tickets", { params });
  return data.tickets;
}

type MessageType = {
  type: "text";
  text: string;
  id: number;
  createAt: Date;
};
export async function getTicket(id: number): Promise<{
  id: number;
  inboxDepartmentId: number;
  businessId: number;
  inboxUserId: number | null;
  status: "NEW" | "OPEN" | "RESOLVED" | "DELETED";
  contact: {
    name: string;
    completeNumber: string;
    tags: { id: number; name: string }[];
  };
  messages: {
    content: MessageType;
    by: "contact" | "user" | "system";
    // number: string;
    // createAt: Date;
    // inboxUserId: number | null;
    // name: string;
    // type: string;
    // by: "contact" | "user" | "system";
    // latitude: string;
    // longitude: string;
    // address: string;
    // fileName: string;
    // caption: string;
    // fullName: string;
    // message: string;
    // org: string;
  }[];
}> {
  const { data } = await api.get(`/private/tickets/${id}`);
  return data.ticket;
}

export async function getOptionsBusinesses({
  filterIds,
  ...params
}: {
  name?: string;
  filterIds?: number[];
}): Promise<{ name: string; id: number }[]> {
  const { data } = await api.get("/private/businesses/options", {
    params: { ...params, filterIds: filterIds?.join("-") },
  });
  return data.businesses;
}

export async function deleteBusiness(id: number): Promise<void> {
  await api.delete(`/private/business/${id}`);
}

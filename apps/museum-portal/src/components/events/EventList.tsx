"use client";

import React from "react";

export interface EventItem {
  id: string;
  title: string;
  date: string;
  type: string;
  tickets: number;
}

export default function EventList({ events }: { events: EventItem[] }) {
  return (
    <section className="bg-black border rounded p-4">
      <h3 className="font-semibold mb-3">Upcoming Events</h3>
      {events.map((e) => (
        <div key={e.id} className="flex justify-between text-sm border-b py-2">
          <span>
            {e.title} • {e.date}
          </span>
          <span>{e.tickets} tickets</span>
        </div>
      ))}
    </section>
  );
}

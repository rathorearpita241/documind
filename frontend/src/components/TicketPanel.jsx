export default function TicketPanel({ ticket }) {
  if (!ticket) {
    return (
      <div className="ticketPanel empty">
        <h3>🎫 Ticket</h3>
        <p>No ticket generated yet</p>
      </div>
    );
  }

  return (
    <div className="ticketPanel">
      <h3>🎫 Support Ticket</h3>

      <div className="ticketItem">
        <span>Customer</span>
        <p>{ticket.customer}</p>
      </div>

      <div className="ticketItem">
        <span>Issue</span>
        <p>{ticket.query_type}</p>
      </div>

      <div className="ticketItem">
        <span>Resolution</span>
        <p>{ticket.resolution}</p>
      </div>
    </div>
  );
}
from enum import Enum


class Role(str, Enum):
    CUSTOMER = "customer"
    WORKER = "worker"
    ADMIN = "admin"


class BookingStatus(str, Enum):
    PENDING = "pending"           # created, awaiting worker acceptance
    ACCEPTED = "accepted"         # worker accepted
    EN_ROUTE = "en_route"         # worker on the way
    IN_PROGRESS = "in_progress"   # work has started
    COMPLETED = "completed"       # work finished, payment due
    CANCELLED = "cancelled"       # cancelled by customer or worker
    DISPUTED = "disputed"         # under dispute resolution
    REFUNDED = "refunded"         # payment refunded


# Allowed status transitions: {from_status: [allowed_to_statuses]}
BOOKING_TRANSITIONS: dict[BookingStatus, list[BookingStatus]] = {
    BookingStatus.PENDING: [BookingStatus.ACCEPTED, BookingStatus.CANCELLED],
    BookingStatus.ACCEPTED: [BookingStatus.EN_ROUTE, BookingStatus.CANCELLED],
    BookingStatus.EN_ROUTE: [BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED],
    BookingStatus.IN_PROGRESS: [BookingStatus.COMPLETED, BookingStatus.DISPUTED],
    BookingStatus.COMPLETED: [BookingStatus.DISPUTED, BookingStatus.REFUNDED],
    BookingStatus.DISPUTED: [BookingStatus.REFUNDED, BookingStatus.COMPLETED],
    BookingStatus.CANCELLED: [],
    BookingStatus.REFUNDED: [],
}

const TIME: Record<string, number> = {
    SECOND: 1000,
    MINUTE: 1000 * 60,
    HOUR: 1000 * 60 * 60,
    DAY: 1000 * 60 * 60 * 24
};

const SyncIntervals: Record<string, number> = {
    hourly: TIME.HOUR,
    "3hours": TIME.HOUR * 3,
    "12hours": TIME.HOUR * 12,
    daily: TIME.DAY,
    weekly: TIME.DAY * 7
};
